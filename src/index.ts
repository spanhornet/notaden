// Crypto
import { randomUUID } from "node:crypto";

// Express
import express, { Request, Response } from "express";

// Model Context Protocol
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

// Server
import { createServer } from "./server.js";

// Set port
if (!process.env.PORT) {
  throw new Error("PORT is not set");
}
const PORT = parseInt(process.env.PORT);

// Create application
const app = express();
app.use(express.json());

// Store transports by session
const transports: Record<string, StreamableHTTPServerTransport> = {};

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Model Context Protocol (MCP) endpoint
app.all("/mcp", async (req: Request, res: Response) => {
  console.log(`[${new Date().toISOString()}] ${req.method} /mcp`);

  try {
    // Get session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Use existing transport
      transport = transports[sessionId];
    } else if (!sessionId && req.method === "POST" && isInitializeRequest(req.body)) {
      // Create newtransport
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          console.log(`Session initialized: ${sid}`);
          transports[sid] = transport;
        },
      });

      // Delete transport on close
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          console.log(`Session closed: ${sid}`);
          delete transports[sid];
        }
      };

      // Connect transport to server
      const server = createServer();
      await server.connect(transport);
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    // Handle request with transport
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle shutdown
async function shutdown(): Promise<void> {
  console.log("\n⏳ Shutting down server...");

  for (const sessionId in transports) {
    try {
      console.log(`Closing session: ${sessionId}`);
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`  Error closing session ${sessionId}:`, error);
    }
  }

  console.log("✅ Server shutdown complete");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
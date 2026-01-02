// Model Context Protocol
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Tools
import { registerTools } from "./tools/index.js";

// Initialize server
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Nota",
    version: "1.0.0",
    description: "Model Context Protocol (MCP) Server for Nota",
  });

  // Register tools
  registerTools(server);

  return server;
}
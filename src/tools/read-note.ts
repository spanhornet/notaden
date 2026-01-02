// Zod
import { z } from "zod";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { getResolvedPath, readNote } from "../lib/files-handler.js";

export function registerReadNoteTool(server: McpServer): void {
  server.registerTool(
    "read_note",
    {
      description: "Read the contents of a markdown note",
      inputSchema: {
        path: z
          .string()
          .describe("Path to the note (relative to Nota folder, e.g., 'inbox/My Note.md')"),
      },
    },
    async ({ path: notePath }) => {
      try {
        const fullPath = getResolvedPath(notePath);
        const content = await readNote(fullPath);

        return {
          content: [{ type: "text", text: content }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error reading note: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


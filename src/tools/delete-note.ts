// Zod
import { z } from "zod";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { getResolvedPath, deleteNote } from "../lib/files-handler.js";

export function registerDeleteNoteTool(server: McpServer): void {
  server.registerTool(
    "delete_note",
    {
      description: "Delete a markdown note",
      inputSchema: {
        path: z.string().describe("Path to the note to delete (relative to Nota folder)"),
      },
    },
    async ({ path: notePath }) => {
      try {
        const fullPath = getResolvedPath(notePath);
        await deleteNote(fullPath);

        return {
          content: [{ type: "text", text: `Deleted note: ${notePath}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting note: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


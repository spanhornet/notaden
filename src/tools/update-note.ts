// Zod
import { z } from "zod";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { getResolvedPath, noteExists, writeNote } from "../lib/files-handler.js";

export function registerUpdateNoteTool(server: McpServer): void {
  server.registerTool(
    "update_note",
    {
      description: "Update an existing markdown note",
      inputSchema: {
        path: z.string().describe("Path to the note (relative to Nota folder)"),
        content: z.string().describe("New content for the note"),
      },
    },
    async ({ path: notePath, content }) => {
      try {
        const fullPath = getResolvedPath(notePath);
        
        // Check if file exists
        if (!(await noteExists(fullPath))) {
          return {
            content: [{ type: "text", text: `Note not found: ${notePath}` }],
            isError: true,
          };
        }

        await writeNote(fullPath, content);

        return {
          content: [{ type: "text", text: `Updated note: ${notePath}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error updating note: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


// Zod
import { z } from "zod";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { getResolvedPath, noteExists, appendNote } from "../lib/files-handler.js";

export function registerAppendNoteTool(server: McpServer): void {
  server.registerTool(
    "append_to_note",
    {
      description: "Append content to an existing note",
      inputSchema: {
        path: z.string().describe("Path to the note (relative to Nota folder)"),
        content: z.string().describe("Content to append"),
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

        await appendNote(fullPath, content);

        return {
          content: [{ type: "text", text: `Appended content to: ${notePath}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error appending to note: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


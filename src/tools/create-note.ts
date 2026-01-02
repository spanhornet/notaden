// Zod
import { z } from "zod";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { getResolvedPath, noteExists, writeNote } from "../lib/files-handler.js";

export function registerCreateNoteTool(server: McpServer): void {
  server.registerTool(
    "create_note",
    {
      description: "Create a new markdown note",
      inputSchema: {
        path: z
          .string()
          .describe("Path for the new note (relative to Nota folder, e.g., 'inbox/New Note.md')"),
        content: z.string().describe("Content of the note in Markdown format"),
      },
    },
    async ({ path: notePath, content }) => {
      try {
        const fullPath = getResolvedPath(notePath);

        // Check if file already exists
        if (await noteExists(fullPath)) {
          return {
            content: [{ type: "text", text: `Note already exists at: ${notePath}` }],
            isError: true,
          };
        }

        await writeNote(fullPath, content);

        return {
          content: [{ type: "text", text: `Created note: ${notePath}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error creating note: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


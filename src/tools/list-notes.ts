// Zod
import { z } from "zod";

// Node
import * as path from "node:path";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { getNotes, directory } from "../lib/files-handler.js";

export function registerListNotesTool(server: McpServer): void {
  server.registerTool(
    "list_notes",
    {
      description: "List all markdown notes in your Nota folder",
      inputSchema: {
        folder: z
          .string()
          .optional()
          .describe("Subfolder to list (e.g., 'inbox'). Leave empty for all notes."),
      },
    },
    async ({ folder }) => {
      try {
        const searchDir = folder
          ? path.join(directory, folder)
          : directory;
        const files = await getNotes(searchDir, directory);

        if (files.length === 0) {
          return {
            content: [{ type: "text", text: "No notes found." }],
          };
        }

        const formatted = files.map((f) => `- ${f}`).join("\n");
        return {
          content: [{ type: "text", text: `Found ${files.length} notes:\n\n${formatted}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error listing notes: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


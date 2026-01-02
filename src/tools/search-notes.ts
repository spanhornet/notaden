// Zod
import { z } from "zod";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { searchNotes } from "../lib/files-handler.js";

export function registerSearchNotesTool(server: McpServer): void {
  server.registerTool(
    "search_notes",
    {
      description: "Search for text across all notes",
      inputSchema: {
        query: z.string().describe("Text to search for"),
      },
    },
    async ({ query }) => {
      try {
        const results = await searchNotes(query);

        if (results.length === 0) {
          return {
            content: [{ type: "text", text: `No matches found for: "${query}"` }],
          };
        }

        let output = `Found matches in ${results.length} file(s):\n\n`;

        for (const result of results) {
          output += `## ${result.file}\n`;
          output += result.matches.slice(0, 5).join("\n");
          if (result.matches.length > 5) {
            output += `\n... and ${result.matches.length - 5} more matches`;
          }
          output += "\n\n";
        }

        return {
          content: [{ type: "text", text: output }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error searching notes: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


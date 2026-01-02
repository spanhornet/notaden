// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { getDirectories } from "../lib/files-handler.js";

export function registerListFoldersTool(server: McpServer): void {
  server.registerTool(
    "list_folders",
    {
      description: "List all folders in your Nota directory",
    },
    async () => {
      try {
        const folders = await getDirectories();

        if (folders.length === 0) {
          return {
            content: [{ type: "text", text: "No folders found." }],
          };
        }

        const formatted = folders.map((f) => `- ${f}/`).join("\n");
        return {
          content: [{ type: "text", text: `Folders in Nota:\n\n${formatted}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error listing folders: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


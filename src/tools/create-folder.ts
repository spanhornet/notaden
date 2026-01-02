// Zod
import { z } from "zod";

// Node
import * as path from "node:path";

// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Utilities
import { createDirectory, directory } from "../lib/files-handler.js";

export function registerCreateFolderTool(server: McpServer): void {
  server.registerTool(
    "create_folder",
    {
      description: "Create a new folder in your Nota directory",
      inputSchema: {
        name: z.string().describe("Name of the folder to create"),
      },
    },
    async ({ name }) => {
      try {
        const folderPath = path.join(directory, name);
        await createDirectory(folderPath);

        return {
          content: [{ type: "text", text: `Created folder: ${name}/` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error creating folder: ${error}` }],
          isError: true,
        };
      }
    }
  );
}


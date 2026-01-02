// Model Context Protocol
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Tools
import { registerListNotesTool } from "./list-notes.js";
import { registerReadNoteTool } from "./read-note.js";
import { registerCreateNoteTool } from "./create-note.js";
import { registerUpdateNoteTool } from "./update-note.js";
import { registerAppendNoteTool } from "./append-note.js";
import { registerDeleteNoteTool } from "./delete-note.js";
import { registerSearchNotesTool } from "./search-notes.js";
import { registerListFoldersTool } from "./list-folders.js";
import { registerCreateFolderTool } from "./create-folder.js";

export function registerTools(server: McpServer): void {
  registerListNotesTool(server);
  registerReadNoteTool(server);
  registerCreateNoteTool(server);
  registerUpdateNoteTool(server);
  registerAppendNoteTool(server);
  registerDeleteNoteTool(server);
  registerSearchNotesTool(server);
  registerListFoldersTool(server);
  registerCreateFolderTool(server);
}

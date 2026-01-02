# Notaden

An MCP (Model Context Protocol) server for managing notes. This project exposes a set of tools that allow Large Language Models (LLMs) to create, read, update, delete, and search notes stored on your filesystem.

## Features

- **Full CRUD operations**: Create, read, update, and delete notes
- **Folder management**: List and create folders for organization
- **Search**: Full-text search across all notes
- **Append mode**: Add content to existing notes without overwriting
- **Session management**: Supports multiple concurrent MCP sessions
- **Path safety**: All file operations are sandboxed to a configurable directory

## Tools

| Tool            | Description                                    |
|-----------------|------------------------------------------------|
| `list_notes`    | List all markdown notes in the notes directory |
| `read_note`     | Read the contents of a specific note           |
| `create_note`   | Create a new markdown note                     |
| `update_note`   | Update an existing note's content              |
| `append_note`   | Append content to an existing note             |
| `delete_note`   | Delete a note                                  |
| `search_notes`  | Search for text across all notes               |
| `list_folders`  | List all folders in the notes directory        |
| `create_folder` | Create a new folder                            |

## Structure

```
notaden/
├── src/
│   ├── index.ts           # Express server & MCP transport setup
│   ├── server.ts          # MCP server initialization
│   ├── lib/
│   │   └── files-handler.ts   # File system operations
│   └── tools/
│       ├── index.ts           # Tool registration
│       ├── list-notes.ts
│       ├── read-note.ts
│       ├── create-note.ts
│       ├── update-note.ts
│       ├── append-note.ts
│       ├── delete-note.ts
│       ├── search-notes.ts
│       ├── list-folders.ts
│       └── create-folder.ts
├── build/                 # Compiled JavaScript output
├── package.json
└── tsconfig.json
```
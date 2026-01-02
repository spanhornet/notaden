// Node
import * as fs from "node:fs/promises";
import * as path from "node:path";

function getEnvPath(key: string, defaultPath: string): string {
  const value = process.env[key];
  if (!value) return defaultPath;

  if (value.startsWith("~")) {
    return path.join(process.env.HOME || "", value.slice(1));
  }
  return value;
}

// Set directory
const defaultDirectory = path.join(process.env.HOME || "", "Nota");
export const directory = getEnvPath("DIRECTORY", defaultDirectory);

// Resolve file path
export function resolveFilePath(filePath: string): string {
  const resolved = path.resolve(directory, filePath);
  
  // Ensure the resolved path is within directory
  if (!resolved.startsWith(directory + path.sep) && resolved !== directory) {
    throw new Error("Path is outside the allowed directory");
  }
  
  return resolved;
}

// Ensure markdown extension
export function ensureMarkdownExtension(filePath: string): string {
  if (!filePath.endsWith(".md")) {
    return filePath + ".md";
  }
  return filePath;
}

// Get full resolved path for note
export function getResolvedPath(filePath: string): string {
  return resolveFilePath(ensureMarkdownExtension(filePath));
}

// Get files recursively from directory
export async function getNotes(
  dir: string = directory,
  baseDir: string = directory
): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and attachments
        if (!entry.name.startsWith(".") && entry.name !== "attachments") {
          const subFiles = await getNotes(fullPath, baseDir);
          files.push(...subFiles);
        }
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        // Return relative path from base directory
        files.push(path.relative(baseDir, fullPath));
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

// Check if file exists
export async function noteExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Read file contents
export async function readNote(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

// Write file contents
export async function writeNote(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}

// Append file contents
export async function appendNote(filePath: string, content: string): Promise<void> {
  await fs.appendFile(filePath, "\n" + content, "utf-8");
}

// Delete file
export async function deleteNote(filePath: string): Promise<void> {
  await fs.unlink(filePath);
}

// Get all directories in path
export async function getDirectories(dir: string = directory): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name);
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

// Create directory
export async function createDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export interface SearchResult {
  file: string;
  matches: string[];
}

// Search for text in markdown files
export async function searchNotes(query: string): Promise<SearchResult[]> {
  const files = await getNotes();
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  for (const file of files) {
    try {
      const content = await readNote(resolveFilePath(file));
      const lines = content.split("\n");
      const matches: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(queryLower)) {
          matches.push(`Line ${i + 1}: ${lines[i].trim()}`);
        }
      }

      if (matches.length > 0) {
        results.push({ file, matches });
      }
    } catch {
      // Skip files that cannot be read
    }
  }

  return results;
}


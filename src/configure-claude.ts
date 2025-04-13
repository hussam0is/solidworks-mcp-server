import { resolve } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Get the absolute path to the server script
const serverPath = resolve('dist/index.js');

// Determine the Claude Desktop config path based on the OS
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

let configPath: string;
if (isWindows) {
  configPath = join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
} else if (isMac) {
  configPath = join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
} else {
  console.error('Unsupported operating system. Claude Desktop is only available on Windows and macOS.');
  process.exit(1);
}

// Create the config directory if it doesn't exist
const configDir = configPath.substring(0, configPath.lastIndexOf('\\') || configPath.lastIndexOf('/'));
if (!existsSync(configDir)) {
  mkdirSync(configDir, { recursive: true });
}

// Create the Claude Desktop config
const config = {
  mcpServers: {
    solidworks: {
      command: 'node',
      args: [serverPath]
    }
  }
};

// Write the config file
try {
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Claude Desktop configuration has been written to: ${configPath}`);
  console.log('Please restart Claude Desktop to use the SolidWorks MCP server.');
} catch (error) {
  console.error('Failed to write Claude Desktop configuration:', error);
  process.exit(1);
}

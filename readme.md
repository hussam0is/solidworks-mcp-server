# SolidWorks MCP Server (under development)

A Model Context Protocol (MCP) server that provides AI assistants with the ability to interact with SolidWorks CAD software. This server enables AI assistants like Claude to open SolidWorks files, retrieve model properties, create new parts, and export documents to PDF.

![SolidWorks MCP](https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/assets/mcp-logo.png)

> **Note**: This project is a demonstration of how to integrate SolidWorks with AI assistants using the Model Context Protocol. For production use, you'll need to implement proper COM automation with SolidWorks.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). It allows AI assistants like Claude to interact with external tools and data sources in a standardized way.

This project implements an MCP server that exposes SolidWorks functionality to AI assistants, enabling them to perform CAD operations through natural language requests.

## Features

- Open SolidWorks documents (.SLDPRT, .SLDASM, .SLDDRW)
- Retrieve model properties and metadata
- Create new part files
- Export documents to PDF
- More capabilities can be added as needed

## Available MCP Tools

This server exposes the following tools to AI assistants:

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `open_document` | Opens a SolidWorks document file | `filePath`: Full path to the SolidWorks document file |
| `get_model_properties` | Gets properties and metadata of a SolidWorks model | `filePath`: Path to the SolidWorks model file |
| `create_new_part` | Creates a new empty SolidWorks part file | None |
| `export_to_pdf` | Exports a SolidWorks document to PDF format | `filePath`: Path to the SolidWorks document to export<br>`outputPath`: Path where the PDF file should be saved |

## Prerequisites

- Node.js (v16 or higher)
- SolidWorks installed on the same machine
- Windows OS (required for COM automation with SolidWorks)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/solidworks-mcp-server.git
   cd solidworks-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage with Claude Desktop

1. Build the project:
   ```bash
   npm run build
   ```

2. Configure Claude Desktop to use this MCP server:
   ```bash
   npm run configure
   ```
   This will automatically create or update the Claude Desktop configuration file at `%AppData%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS).

3. Restart Claude Desktop and you should see the SolidWorks tools available.

### Example Prompts for Claude

Once the server is configured with Claude Desktop, you can use prompts like these:

- "Can you open the SolidWorks file at C:\Projects\MyPart.SLDPRT and tell me about its properties?"
- "I need a new SolidWorks part file. Can you create one for me?"
- "Please export the SolidWorks file at C:\Projects\Assembly.SLDASM to a PDF at C:\Projects\Assembly.pdf"

Claude will use the MCP tools to interact with SolidWorks and perform these operations.

### Manual Configuration

If you prefer to manually configure Claude Desktop, edit the configuration file at `%AppData%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "solidworks": {
      "command": "node",
      "args": [
        "C:\\path\\to\\solidworks-mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

## Development

For development with hot reloading:
```bash
npm run dev
```

## Extending the Server

To add more SolidWorks functionality:

1. Add new methods to the `SolidWorksAPI` class in `src/solidworks-api.ts`
2. Add new tools in `src/index.ts` using the `server.tool()` method

## Notes on SolidWorks Integration

This server uses COM automation to interact with SolidWorks. For a production environment, you'll need to:

1. Install a proper COM library like `node-activex` or `winax`
2. Ensure SolidWorks is registered correctly on your system
3. Handle proper error cases and SolidWorks application lifecycle

## Project Structure

```
├── src/                  # Source code
│   ├── index.ts          # Main server file
│   ├── solidworks-api.ts # SolidWorks API wrapper
│   ├── test-client.ts    # Test script
│   └── configure-claude.ts # Claude Desktop configuration script
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

## GitHub Repository Setup

To push this project to GitHub:

1. Create a new repository on GitHub (without initializing it)
2. Add the remote repository URL:
   ```bash
   git remote add origin https://github.com/yourusername/solidworks-mcp-server.git
   ```
3. Add all files to the staging area:
   ```bash
   git add .
   ```
4. Commit the files:
   ```bash
   git commit -m "Initial commit"
   ```
5. Push to GitHub:
   ```bash
   git push -u origin main
   ```

## License

MIT

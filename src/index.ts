import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import solidWorksAPI from "./solidworks-api";

// Create server instance
const server = new McpServer({
  name: "solidworks",
  version: "1.0.0",
});

// Tool 1: Open a SolidWorks document
server.tool(
  "open_document",
  "Opens a SolidWorks document file (.SLDPRT, .SLDASM, .SLDDRW)",
  {
    filePath: z.string().describe("Full path to the SolidWorks document file"),
  },
  async ({ filePath }) => {
    const success = await solidWorksAPI.openDocument(filePath);

    return {
      content: [
        {
          type: "text",
          text: success
            ? `Successfully opened document: ${filePath}`
            : `Failed to open document: ${filePath}`
        },
      ],
    };
  }
);

// Tool 2: Get model properties
server.tool(
  "get_model_properties",
  "Gets properties and metadata of a SolidWorks model",
  {
    filePath: z.string().describe("Path to the SolidWorks model file"),
  },
  async ({ filePath }) => {
    try {
      const properties = await solidWorksAPI.getModelProperties(filePath);

      return {
        content: [
          {
            type: "text",
            text: `Model Properties for ${filePath.split('/').pop()}:\n${JSON.stringify(properties, null, 2)}`
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error getting model properties: ${error instanceof Error ? error.message : String(error)}`
          },
        ],
      };
    }
  }
);

// Tool 3: Create a new part
server.tool(
  "create_new_part",
  "Creates a new empty SolidWorks part file",
  {},
  async () => {
    try {
      const newPartPath = await solidWorksAPI.createNewPart();

      return {
        content: [
          {
            type: "text",
            text: `Created new part at ${newPartPath}`
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error creating new part: ${error instanceof Error ? error.message : String(error)}`
          },
        ],
      };
    }
  }
);

// Tool 4: Export to PDF
server.tool(
  "export_to_pdf",
  "Exports a SolidWorks document to PDF format",
  {
    filePath: z.string().describe("Path to the SolidWorks document to export"),
    outputPath: z.string().describe("Path where the PDF file should be saved"),
  },
  async ({ filePath, outputPath }) => {
    const success = await solidWorksAPI.exportToPDF(filePath, outputPath);

    return {
      content: [
        {
          type: "text",
          text: success
            ? `Successfully exported to PDF: ${outputPath}`
            : `Failed to export to PDF`
        },
      ],
    };
  }
);

// Start the server
async function main() {
  // Connect to SolidWorks on startup
  const connected = await solidWorksAPI.connect();
  console.log(connected
    ? 'Successfully connected to SolidWorks'
    : 'Could not connect to SolidWorks - will try again when needed');

  // Create a transport using standard IO for server communication
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  await server.connect(transport);
  console.error("SolidWorks MCP Server running on stdio");
}

main().catch((error: Error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

import { MCPTool, MCPParameter } from '@modelcontextprotocol/typescript-sdk';
import solidWorksAPI from './solidworks-api';

// Tool 1: Open a SolidWorks document
export const openDocumentTool = new MCPTool({
  name: 'open_solidworks_document',
  description: 'Opens a SolidWorks document file (.SLDPRT, .SLDASM, .SLDDRW)',
  parameters: [
    new MCPParameter({
      name: 'filePath',
      description: 'Full path to the SolidWorks document file',
      type: 'string',
      required: true
    })
  ],
  execute: async ({ filePath }) => {
    const success = await solidWorksAPI.openDocument(filePath as string);
    return {
      success,
      message: success 
        ? `Successfully opened document: ${filePath}` 
        : `Failed to open document: ${filePath}`
    };
  }
});

// Tool 2: Get model properties
export const getModelPropertiesTool = new MCPTool({
  name: 'get_model_properties',
  description: 'Gets properties and metadata of a SolidWorks model',
  parameters: [
    new MCPParameter({
      name: 'filePath',
      description: 'Path to the SolidWorks model file',
      type: 'string',
      required: true
    })
  ],
  execute: async ({ filePath }) => {
    try {
      const properties = await solidWorksAPI.getModelProperties(filePath as string);
      return {
        success: true,
        properties
      };
    } catch (error) {
      return {
        success: false,
        message: `Error getting model properties: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
});

// Tool 3: Create a new part
export const createNewPartTool = new MCPTool({
  name: 'create_new_part',
  description: 'Creates a new empty SolidWorks part file',
  parameters: [],
  execute: async () => {
    try {
      const newPartPath = await solidWorksAPI.createNewPart();
      return {
        success: true,
        filePath: newPartPath,
        message: `Created new part at ${newPartPath}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating new part: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
});

// Tool 4: Export to PDF
export const exportToPDFTool = new MCPTool({
  name: 'export_to_pdf',
  description: 'Exports a SolidWorks document to PDF format',
  parameters: [
    new MCPParameter({
      name: 'filePath',
      description: 'Path to the SolidWorks document to export',
      type: 'string',
      required: true
    }),
    new MCPParameter({
      name: 'outputPath',
      description: 'Path where the PDF file should be saved',
      type: 'string',
      required: true
    })
  ],
  execute: async ({ filePath, outputPath }) => {
    const success = await solidWorksAPI.exportToPDF(
      filePath as string, 
      outputPath as string
    );
    
    return {
      success,
      message: success 
        ? `Successfully exported to PDF: ${outputPath}` 
        : `Failed to export to PDF`
    };
  }
});

// Add more tools as needed for SolidWorks operations

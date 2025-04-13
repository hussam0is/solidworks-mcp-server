import { MCPClient } from '@modelcontextprotocol/typescript-sdk';

async function testSolidWorksMCP() {
  // Create a client connecting to our local server
  const client = new MCPClient({
    url: 'http://localhost:3000/mcp'
  });

  // Connect to the server
  await client.connect();

  // List available tools
  const tools = await client.listTools();
  console.log('Available tools:', tools.map(t => t.name));

  // Get connection status
  const status = await client.getResource('solidworks_connection_status');
  console.log('SolidWorks connection status:', status);

  // Test creating a new part
  try {
    const result = await client.executeTool('create_new_part', {});
    console.log('Create new part result:', result);

    if (result.success && result.filePath) {
      // Get properties of the new part
      const propertiesResult = await client.executeTool('get_model_properties', {
        filePath: result.filePath
      });
      console.log('Part properties:', propertiesResult);

      // Export to PDF
      const pdfResult = await client.executeTool('export_to_pdf', {
        filePath: result.filePath,
        outputPath: result.filePath.replace('.SLDPRT', '.pdf')
      });
      console.log('PDF export result:', pdfResult);
    }
  } catch (error) {
    console.error('Error testing tools:', error);
  }

  // Disconnect
  await client.disconnect();
}

testSolidWorksMCP().catch(console.error);

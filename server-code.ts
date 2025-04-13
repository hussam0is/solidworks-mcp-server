import express from 'express';
import { MCPServer, MCPResourceProvider } from '@modelcontextprotocol/typescript-sdk';
import { 
  openDocumentTool, 
  getModelPropertiesTool, 
  createNewPartTool, 
  exportToPDFTool 
} from './solidworks-tools';
import solidWorksAPI from './solidworks-api';

// Define our SolidWorks MCP server
const app = express();
const port = process.env.PORT || 3000;

// Initialize the MCP server
const server = new MCPServer({
  name: 'solidworks-mcp',
  description: 'SolidWorks integration for AI assistants',
  version: '1.0.0'
});

// Register our SolidWorks tools
server.registerTool(openDocumentTool);
server.registerTool(getModelPropertiesTool);
server.registerTool(createNewPartTool);
server.registerTool(exportToPDFTool);

// Connection status resource
const connectionStatus = new MCPResourceProvider({
  name: 'solidworks_connection_status',
  description: 'Provides the current connection status to SolidWorks',
  async provide() {
    return {
      connected: solidWorksAPI.connected,
      version: 'SolidWorks 2023 SP2.0', // This would come from the actual API
      timestamp: new Date().toISOString()
    };
  }
});

server.registerResourceProvider(connectionStatus);

// Start the server
app.use('/mcp', server.createExpressRouter());

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'solidworks-mcp' });
});

app.listen(port, () => {
  console.log(`SolidWorks MCP server running at http://localhost:${port}`);
  
  // Try to connect to SolidWorks on startup
  solidWorksAPI.connect().then(connected => {
    console.log(connected 
      ? 'Successfully connected to SolidWorks' 
      : 'Could not connect to SolidWorks - will try again when needed');
  });
});

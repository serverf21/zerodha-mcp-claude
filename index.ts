import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { getAllHoldings, placeOrder } from "./trade";
// import { placeOrder } from './your-trading-module.js'; // Update this path to your actual module

console.error("Starting MCP server...");

// Create a low-level MCP server
const server = new Server(
  {
    name: "TradingServer",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
      resources: {}
    }
  }
);

// Handle tools list
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "hello",
        description: "Say hello to someone",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name to greet" }
          },
          required: ["name"],
          additionalProperties: false
        }
      },
      {
        name: "add",
        description: "Add two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" }
          },
          required: ["a", "b"],
          additionalProperties: false
        }
      },
      {
        name: "subtract",
        description: "Subtract two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number to subtract from first" }
          },
          required: ["a", "b"],
          additionalProperties: false
        }
      },
      {
        name: "buy_stock",
        description: "Place a buy order for stocks",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { 
              type: "string", 
              description: "Stock symbol (e.g., RELIANCE, TCS)" 
            },
            quantity: { 
              type: "number", 
              minimum: 1,
              description: "Number of shares to buy" 
            },
          },
          required: ["symbol", "quantity"],
          additionalProperties: false
        }
      },
      {
        name: "sell_stock",
        description: "Place a sell order for stocks",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { 
              type: "string", 
              description: "Stock symbol (e.g., RELIANCE, TCS)" 
            },
            quantity: { 
              type: "number", 
              minimum: 1,
              description: "Number of shares to sell" 
            },
          },
          required: ["symbol", "quantity"],
          additionalProperties: false
        }
      },
      // {
      //   name: "show_portfolio",
      //   description: "Shows complete portfolio of stocks",
      // }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  console.error(`Tool called: ${name} with args:`, args);
  
  switch (name) {
    case "hello": {
      const { name } = args as { name: string };
      return {
        content: [{ type: "text", text: `Hello, ${name}!` }]
      };
    }
    
    case "add": {
      const { a, b } = args as { a: number; b: number };
      return {
        content: [{ type: "text", text: String(a + b) }]
      };
    }
    
    case "subtract": {
      const { a, b } = args as { a: number; b: number };
      return {
        content: [{ type: "text", text: String(a - b) }]
      };
    }

    // case "show_portfolio": {
    //   const holdings = await getAllHoldings();
    //   return {
    //     content: [{ type: "text", text: String(holdings) }]
    //   };
    // }

    case "buy_stock": {
      const { symbol, quantity, price } = args as { symbol: string; quantity: number; price?: number };
      
      try {
        // For now, we'll simulate the order since placeOrder is commented out
        // Uncomment and modify this section when you have your trading module ready
        const response = await placeOrder(symbol, "BUY", quantity)
        
        // Simulated response for testing
        // const orderType = price ? 'LIMIT' : 'MARKET';
        // const priceText = price ? ` at ₹${price}` : '';
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(response)
          }]
        };
        
      } catch (error) {
        console.error(`Error placing order: ${error}`);
        return {
          content: [{ 
            type: "text", 
            text: `Failed to place order: ${error}` 
          }],
          isError: true
        };
      }
    }
    
    case "sell_stock": {
      const { symbol, quantity, price } = args as { symbol: string; quantity: number; price?: number };
      
      try {
        // For now, we'll simulate the order since placeOrder is commented out
        // Uncomment and modify this section when you have your trading module ready
        const response = await placeOrder(symbol, "SELL", quantity)
        
        // Simulated response for testing
        // const orderType = price ? 'LIMIT' : 'MARKET';
        // const priceText = price ? ` at ₹${price}` : '';
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(response)
          }]
        };
        
      } catch (error) {
        console.error(`Error placing order: ${error}`);
        return {
          content: [{ 
            type: "text", 
            text: `Failed to place order: ${error}` 
          }],
          isError: true
        };
      }
    }
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Handle prompts list - return empty array
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: []
  };
});

// Handle resources list - return empty array
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: []
  };
});

console.error("Server configured, connecting transport...");

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("MCP server connected and ready!");
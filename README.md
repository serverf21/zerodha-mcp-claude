# Zerodha-Claude AI Integration

A Model Context Protocol (MCP) server that enables Claude AI to interact with your Zerodha trading account. This integration allows Claude to execute trades and analyze your portfolio through natural language commands.

## Features

- 🚀 Execute market orders (buy/sell stocks)
- 📊 View portfolio holdings and analysis
- 🔐 Secure API integration with Zerodha
- 🤖 Natural language trading commands through Claude AI

## Prerequisites

- [Bun](https://bun.sh) runtime
- Zerodha Kite account with:
  - API Key
  - API Secret
  - Access Token

## Setup

1. Install dependencies:

```bash
bun install
```

2. Configure environment variables in Claude Desktop config:

```json
{
  "mcpServers": {
    "trade": {
      "command": "/path/to/bun",
      "args": ["index.ts"],
      "env": {
        "ZERODHA_API_KEY": "your_api_key",
        "ZERODHA_API_SECRET": "your_api_secret",
        "ZERODHA_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

3. Run the server:

```bash
bun run index.ts
```

## Available Commands in Claude

- `Buy stocks`: Execute buy orders
  ```
  Buy 10 shares of RELIANCE
  ```
- `Sell stocks`: Execute sell orders
  ```
  Sell 5 shares of TCS
  ```
- `View portfolio`: Check your holdings
  ```
  Show my portfolio
  ```

## Security Note

- Keep your API credentials secure
- Never share your access tokens
- Monitor your trades regularly

## Tech Stack

- TypeScript
- Bun Runtime
- Model Context Protocol (MCP)
- Zerodha Kite API
- Claude AI Integration

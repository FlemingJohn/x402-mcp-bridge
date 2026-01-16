# x402-MCP Bridge

An AI-first bridge for Cronos x402 payments. This server facilitates AI agent interactions with payments by normalizing on-chain data into structured, explainable formats.

## Quick Start for Developers

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **Tokens**: TCRO on Cronos Testnet (get some from the [Cronos Faucet](https://cronos.org/faucet)).
- **Private Key**: A developer wallet private key for signing transactions (optional for read-only tools).

### 2. Setup
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Configuration
Create a `.env` file based on the example:
```bash
cp .env.example .env
```
Fill in your `CRONOS_RPC_URL`, `X402_FACILITATOR_ADDRESS`, and `PRIVATE_KEY`.

### 4. Running the Server
Start the bridge in development mode:
```bash
npm run dev
```
The server will start on `http://localhost:4020`.

## Interacting with MCP Tools

The bridge exposes a unified MCP interface at `/api/mcp`. You can interact with it using standard HTTP POST requests.

### Tool: `get_agent_balance`
Checks the on-chain balance of a specific address.

**Request**:
```json
{
  "tool": "get_agent_balance",
  "params": {
    "address": "0xYourAddressHere"
  }
}
```

### Tool: `get_payment_history`
Retrieves indexed historical payments for an agent.

**Request**:
```json
{
  "tool": "get_payment_history",
  "params": {
    "agent_id": "agent_123"
  }
}
```

### Tool: `make_payment`
Orchestrates a full X402 payment flow (Authorization -> Settlement).

**Request**:
```json
{
  "tool": "make_payment",
  "params": {
    "to": "0xRecipientAddress",
    "amount": "1000000",
    "description": "Payment for services"
  }
}
```
*Note: Amount is in base units (e.g., 1 USDCe = 1,000,000).*

## AI Agent Client (Gemini-Powered)

The bridge includes a native **"Cronos Agent"** client that uses **Google Gemini** with tool-calling to interact with the x402-MCP bridge.

### 1. Configuration
Add your Gemini API key and Wallet Private Key to `.env`:
```env
GEMINI_API_KEY=AIza...
PRIVATE_KEY=0x...
```

### 2. Run the Agent
The agent automatically detects your wallet address from the private key, so you can speak naturally:
```bash
npm run agent "What is my balance?"
```
*(Note for Windows: `node_modules\.bin\ts-node.cmd src\agent\agent.ts "What is my balance?"`)*

### Key Features
- **Auto-Context**: Knows your wallet address and the Faucet URL (`https://cronos.org/faucet`).
- **Dynamic Model Resolution**: Automatically finds the best Gemini model (Flash/Pro/Lite) for your API key.
- **Rate Limit Handling**: Robust exponential backoff prevents `429` errors on free tier accounts.

## Project Structure
- `src/blockchain/`: Ethers.js and Facilitator SDK integration.
- `src/db/`: SQLite persistence for local data indexing.
- `src/indexer/`: On-chain event monitoring logic.
- `src/mcp/`: MCP endpoint and tool routing.
- `src/agent/`: **Modular AI Agent Client**
    - `agent.ts`: Main orchestrator and entry point.
    - `tools.ts`: Tool (function) definitions for Gemini.
    - `utils.ts`: Helper logic (retries, model resolution).
    - `mcp.ts`: Bridge client for MCP server communication.
- `data/`: Local storage for the SQLite database (auto-created).

Alright. Let’s do a **clean, zero-noise initial setup** for
**Project name: `x402-MCP Bridge`**
This is the kind of repo judges like opening.

---

## 1. Create the project

```bash
mkdir x402-mcp-bridge
cd x402-mcp-bridge
npm init -y
```

This gives you a basic `package.json`.

---

## 2. Install core dependencies

### Runtime + blockchain

```bash
npm install typescript ts-node dotenv
npm install ethers
npm install @crypto.com/facilitator-client
```

### Server (MCP-friendly)

```bash
npm install express body-parser
```

### Database (start simple)

```bash
npm install sqlite3
```

### Dev tools

```bash
npm install -D nodemon @types/node @types/express
```

---

## 3. Initialize TypeScript

```bash
npx tsc --init
```

Edit `tsconfig.json` (keep only what matters):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## 4. Project structure (important)

Create this structure:

```text
x402-mcp-bridge/
│
├── src/
│   ├── index.ts              # entry point
│   ├── mcp/
│   │   └── server.ts         # MCP endpoints
│   ├── blockchain/
│   │   └── cronos.ts         # Cronos + x402 logic
│   ├── indexer/
│   │   └── paymentIndexer.ts # listens & stores x402 events
│   ├── db/
│   │   └── database.ts       # SQLite setup
│   └── utils/
│       └── logger.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

This separation screams **“Dev Tooling”**.

---

## 5. Environment config

Create `.env`:

```env
PORT=4020
CRONOS_RPC_URL=https://evm-t3.cronos.org
X402_FACILITATOR_ADDRESS=0xYOUR_ADDRESS
```

---

## 6. Database setup (SQLite)

`src/db/database.ts`

```ts
import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("x402.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS x402_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_hash TEXT,
      agent_id TEXT,
      amount TEXT,
      status TEXT,
      reason TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});
```

This table alone already supports:

* indexing
* debugging
* explainability

---

## 7. Cronos + x402 connection

`src/blockchain/cronos.ts`

```ts
import { JsonRpcProvider } from "ethers";

export const provider = new JsonRpcProvider(
  process.env.CRONOS_RPC_URL
);
```

Later, you’ll:

* listen to x402 events
* decode them
* store them

---

## 8. MCP server skeleton

`src/mcp/server.ts`

```ts
import express from "express";

const router = express.Router();

router.post("/mcp", async (req, res) => {
  const { tool, params } = req.body;

  if (tool === "get_last_x402_payment") {
    return res.json({
      status: "ok",
      message: "Stub response from x402-MCP Bridge"
    });
  }

  res.status(400).json({ error: "Unknown tool" });
});

export default router;
```

This is where AI agents will talk.

---

## 9. App entry point

`src/index.ts`

```ts
import express from "express";
import dotenv from "dotenv";
import mcpRouter from "./mcp/server";
import "./db/database";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", mcpRouter);

const PORT = process.env.PORT || 4020;

app.listen(PORT, () => {
  console.log(`x402-MCP Bridge running on port ${PORT}`);
});
```

---

## 10. Scripts in `package.json`

Update scripts:

```json
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

Run it:

```bash
npm run dev
```

Visit:

```
http://localhost:4020/api/mcp
```

---

## What you have now (important)

At this stage, **x402-MCP Bridge** already:

* boots cleanly
* exposes an MCP-style endpoint
* has a database
* is Cronos-ready
* is structured like real infrastructure

Next logical expansions:

* event listener for x402
* payment explainability
* MCP tools for debugging

This is a solid foundation.
Not flashy. Not fragile. Exactly what infra should be.

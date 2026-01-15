import express from "express";
import { db } from "../db/database";
import { getAgentBalance } from "../blockchain/cronos";

const router = express.Router();

router.post("/mcp", async (req, res) => {
    const { tool, params } = req.body;

    try {
        switch (tool) {
            case "get_payment_history": {
                const { agent_id } = params;
                db.all("SELECT * FROM x402_payments WHERE agent_id = ? ORDER BY timestamp DESC", [agent_id], (err: any, rows: any[]) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ status: "ok", data: rows });
                });
                break;
            }

            case "get_agent_balance": {
                const { address } = params;
                const balance = await getAgentBalance(address);
                res.json({ status: "ok", balance });
                break;
            }

            case "explain_failure": {
                const { tx_hash } = params;
                db.get("SELECT reason FROM x402_payments WHERE tx_hash = ? AND status = 'failed'", [tx_hash], (err: any, row: any) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({
                        status: "ok",
                        explanation: row ? `Reason: ${row.reason}` : "No failed transaction found with this hash."
                    });
                });
                break;
            }

            default:
                res.status(400).json({ error: "Unknown tool" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

import express from "express";
import { db } from "../db/database";
import { getAgentBalance, verifyPayment, executePayment } from "../blockchain/cronos";

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
                const balanceData = await getAgentBalance(address);
                res.json({ status: "ok", ...balanceData });
                break;
            }

            case "explain_failure": {
                const { tx_hash } = params;
                db.get("SELECT reason FROM x402_payments WHERE tx_hash = ? AND status = 'failed'", [tx_hash], async (err: any, row: any) => {
                    if (err) return res.status(500).json({ error: err.message });

                    if (row) {
                        return res.json({ status: "ok", explanation: `Reason: ${row.reason}` });
                    }

                    // Fallback: Check on-chain for verification
                    const verification = await verifyPayment(tx_hash);
                    if (verification.status === "failed") {
                        res.json({
                            status: "ok",
                            explanation: "Transaction failed on Cronos. This often happens due to insufficient allowance or gas. Check explorer for details."
                        });
                    } else if (verification.status === "success") {
                        res.json({ status: "ok", explanation: "Transaction actually succeeded on-chain. Database may be out of sync." });
                    } else {
                        res.json({ status: "ok", explanation: "Transaction not found or error checking on-chain." });
                    }
                });
                break;
            }

            case "make_payment": {
                const { to, amount, description } = params;
                const result = await executePayment(to, amount, description);
                res.json({ status: "ok", data: result });
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

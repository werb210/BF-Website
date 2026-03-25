import { Router } from "express";
const router = Router();

router.post("/start", (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "phone required" });
  return res.json({ success: true });
});

router.post("/verify", (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "invalid" });
  return res.json({ token: "dev-token" });
});

export default router;

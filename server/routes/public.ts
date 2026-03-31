import { Router } from "express";
import { storage } from "../storage";
import { publicLeadIntakeSchema } from "../validation";
import { getTraceId, logger } from "../logger";
import { createRateLimiter } from "../security";

const router = Router();
const publicLeadLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10 });

router.post("/lead", publicLeadLimiter, async (req, res) => {
  if (!req.is("application/json")) {
    return res.status(400).json({ error: "INVALID_CONTENT_TYPE" });
  }

  const parsed = publicLeadIntakeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_PAYLOAD" });
  }

  const { email, phone, requestedAmount, productType, businessName } = parsed.data;

  try {
    const result = await storage.createOrGetWebLead({
      companyName: businessName || "Website Lead",
      firstName: "Website",
      lastName: "Lead",
      email,
      phone,
    });

    if (!result) {
      return res.status(500).json({ error: "EMPTY_RESPONSE" });
    }

    const { lead } = result;
    if (!lead || !lead.id) {
      throw new Error("LEAD_CREATION_FAILED");
    }

    logger.info({
      msg: "[PUBLIC LEAD]",
      traceId: getTraceId(req),
      email,
      ip: req.ip,
      timestamp: Date.now(),
    });

    logger.info({
      msg: "Public website lead created",
      traceId: getTraceId(req),
      leadId: lead.id,
      source: "website",
      requestedAmount: requestedAmount ?? null,
      productType: productType ?? null,
    });

    return res.json({ leadId: lead.id });
  } catch (error) {
    logger.error({
      msg: "Public lead intake failed",
      traceId: getTraceId(req),
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

export default router;

import { Router } from "express";
import { storage } from "../storage";
import { publicLeadIntakeSchema } from "../validation";
import { getTraceId, logger } from "../logger";

const router = Router();

router.post("/lead", async (req, res) => {
  const parsed = publicLeadIntakeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "missing_fields" });
  }

  const { email, phone, requestedAmount, productType, businessName } = parsed.data;

  try {
    const { lead } = await storage.createOrGetWebLead({
      companyName: businessName || "Website Lead",
      firstName: "Website",
      lastName: "Lead",
      email,
      phone,
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
    return res.status(500).json({ error: "internal_error" });
  }
});

export default router;

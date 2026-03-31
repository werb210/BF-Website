import crypto from "node:crypto";
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { calculateReadinessScore, tierFromScore } from "./scoring";
import { storage } from "./storage";
import { applyRequestSchema, capitalReadinessIntakeSchema, chatMessageSchema, creditReadinessSchema, leadIngestionSchema, supportEventSchema } from "./validation";
import { logger, getTraceId } from "./logger";

function recommendedProductsForTier(tier: "green" | "yellow" | "red") {
  if (tier === "green") return ["Term Loan", "Equipment Financing", "Line of Credit"];
  if (tier === "yellow") return ["Line of Credit", "Factoring", "Purchase Order Financing"];
  return ["Factoring", "Line of Credit"];
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  app.post("/api/maya/website-chat", (req, res) => {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const startupUnavailable = /startup|new business|pre-revenue/i.test(message);
    const includeRates = /rate|interest|pricing/i.test(message);

    return res.status(200).json({
      reply: startupUnavailable
        ? "Startup financing inventory is currently limited. You can join the startup waitlist for updates."
        : "Thanks for your question — Maya can help with qualification guidance and next steps.",
      startup_unavailable: startupUnavailable,
      ...(includeRates ? { min_rate: 8.5, max_rate: 29.9 } : {}),
    });
  });

  app.post("/api/maya/escalate", (req, res) => {
    logger.info({ msg: "Maya escalation requested", traceId: getTraceId(req), source: "website" });
    res.status(202).json({ ok: true });
  });

  app.post("/api/marketing/track-lead", (req, res) => {
    logger.info({
      msg: "Website lead attribution tracked",
      traceId: getTraceId(req),
      attribution: req.body?.utm,
      channel: req.body?.channel ?? "website",
      timestamp: req.body?.timestamp,
    });
    res.status(202).json({ ok: true });
  });

  app.post("/api/crm/startup-waitlist", (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    logger.info({
      msg: "Startup waitlist submission",
      traceId: getTraceId(req),
      email,
      companyName: req.body?.companyName ?? null,
      startup_interest: true,
      channel: req.body?.channel ?? "website",
      utm_source: req.body?.utm_source ?? null,
    });
    res.status(202).json({ ok: true });
  });

  app.get("/api/maya/faq", (_req, res) => {
    res.json({
      faqs: [
        {
          question: "What can Maya help with?",
          answer: "Maya can share qualification guidance, product ranges, and route you to a specialist.",
        },
        {
          question: "Can I speak to a person?",
          answer: "Yes, you can escalate to a funding specialist anytime from the widget.",
        },
      ],
    });
  });

  app.get("/api/public/lender-count", (_req, res) => {
    const count = Number(process.env.PUBLIC_LENDER_COUNT || "40");
    res.set("Cache-Control", "public, max-age=300, s-maxage=300");
    res.json({ count: Number.isFinite(count) ? count : 40 });
  });

  const handleReadinessSubmit = async (req: Request, res: Response) => {
    try {
      const normalizedPayload = {
        ...(req.body as Record<string, unknown>),
        arBalance: (req.body as Record<string, unknown>).arBalance ?? (req.body as Record<string, unknown>).accountsReceivable,
        collateral: (req.body as Record<string, unknown>).collateral ?? (req.body as Record<string, unknown>).availableCollateral,
      };

      const parsed = creditReadinessSchema.safeParse(normalizedPayload);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request payload" });
      }

      const { companyName, fullName, phone, email, industry, yearsInBusiness, monthlyRevenue, annualRevenue, arBalance, collateral } = parsed.data;

      const existingLead = await storage.findCapitalReadinessLeadByContact(email, phone);
      if (existingLead) {
        res.status(200).json({
          leadId: existingLead.id,
          sessionId: existingLead.sessionToken,
          sessionToken: existingLead.sessionToken,
          score: existingLead.score,
          tier: existingLead.tier,
          deduped: true,
        });
        return;
      }

      const score = calculateReadinessScore({
        yearsInBusiness,
        annualRevenue,
        monthlyRevenue,
        arBalance,
        collateral,
      });
      const tier = tierFromScore(score);

      const lead = await storage.createCapitalReadinessLead({
        name: fullName,
        email,
        phone,
        industry,
        revenue: annualRevenue,
        yearsInBusiness,
        existingDebt: "unknown",
        score,
        tier,
        tag: "capital_readiness",
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("Public Readiness Lead:", {
          leadId: lead.id,
          companyName,
          fullName,
          phone,
          email,
          industry,
          yearsInBusiness,
          monthlyRevenue,
          annualRevenue,
          arBalance,
          collateral,
        });
      }

      res.status(201).json({
        leadId: lead.id,
        sessionId: lead.sessionToken,
        sessionToken: lead.sessionToken,
        score: lead.score,
        tier: lead.tier,
        deduped: false,
      });
    } catch (error) {
      logger.error({ msg: "Readiness submission failed", traceId: getTraceId(req), error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ error: "Internal server error" });
    }
  };

  app.post("/api/public/readiness", handleReadinessSubmit);
  app.post("/api/readiness/submit", handleReadinessSubmit);

  app.post("/api/capital-readiness", async (req, res) => {
    try {
      const parsed = capitalReadinessIntakeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request payload" });
      }

      const { name, email, phone, industry, revenue, yearsInBusiness } = parsed.data;

      const score = calculateReadinessScore({
        yearsInBusiness: yearsInBusiness === "0" ? "Zero" : yearsInBusiness,
        annualRevenue: revenue,
        monthlyRevenue: "Under $10,000",
        arBalance: "No Account Receivables",
        collateral: "No Collateral Available",
      });
      const tier = tierFromScore(score);
      const recommendedProducts = recommendedProductsForTier(tier);

      const lead = await storage.createCapitalReadinessLead({
        name,
        email,
        phone,
        industry,
        revenue,
        yearsInBusiness,
        existingDebt: "unknown",
        score,
        tier,
        tag: "capital_readiness",
      });

      res.status(201).json({ score, tier, recommendedProducts, leadId: lead.id });
    } catch (error) {
      logger.error({ msg: "Capital readiness failed", traceId: getTraceId(req), error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const handleSupportEvent = (req: Request, res: Response) => {
    const parsed = supportEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request payload" });
      return;
    }

    const { event, source } = parsed.data;
    logger.info({ msg: "Support event", traceId: getTraceId(req), event, source: source ?? "website" });
    res.status(202).json({ ok: true });
  };

  app.post("/api/support/event", handleSupportEvent);
  app.post("/api/support/track", handleSupportEvent);

  app.post("/api/crm/web-leads", async (req, res) => {
    try {
      const parsed = leadIngestionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request payload" });
      }

      const { companyName, firstName, lastName, email, phone } = parsed.data;
      const { deduped } = await storage.createOrGetWebLead({ companyName, firstName, lastName, email, phone });

      if (process.env.NODE_ENV !== "production" && !deduped) {
        console.log("CRM Web Lead:", { companyName, firstName, lastName, email, phone, channel: "website" });
        console.log("SMS Dispatch:", { to: "+15878881837", message: `New lead from ${companyName} (${firstName} ${lastName})` });
      }
      res.status(202).json({ ok: true, deduped });
    } catch (error) {
      logger.error({ msg: "Lead submission failed", traceId: getTraceId(req), error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/apply", (req, res) => {
    const parsed = applyRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const requestId = crypto.randomUUID();
    logger.info({ msg: "Apply request received", traceId: getTraceId(req), requestId, product: parsed.data.product ?? "unknown" });

    res.status(202).json({
      status: "received",
      requestId,
    });
  });

  app.get("/api/application/from-lead", async (req, res) => {
    const leadId = typeof req.query.leadId === "string" ? req.query.leadId.trim() : "";
    if (!leadId) {
      return res.status(400).json({ error: "[INVALID LEAD]" });
    }

    const lead = await storage.findWebLeadById(leadId);
    if (!lead) {
      return res.status(404).json({ error: "[INVALID LEAD]" });
    }

    return res.status(200).json({ leadId: lead.id });
  });

  app.post("/api/chat", (req, res) => {
    const parsed = chatMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    return res.status(202).json({ accepted: true });
  });

  return createServer(app);
}

import { Router, type Request, type Response } from "express";
import { storage } from "../storage";
import { contactFormSchema } from "../validation";
import { getTraceId, logger } from "../logger";

const router = Router();

async function sendTwilioSms(messageBody: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE;

  if (!accountSid || !authToken || !fromPhone) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Skipping Twilio SMS: Twilio environment variables are not configured");
      return;
    }
    throw new Error("Twilio environment variables are not configured");
  }

  // BF_WEBSITE_NO_PERSONAL_NUMBER_v163 - the alert number comes from the LEAD_ALERT_SMS_TO setting, never from code.
  const leadAlertTo = String(process.env.LEAD_ALERT_SMS_TO ?? "").trim();
  if (!leadAlertTo) {
    console.log("Skipping lead SMS: LEAD_ALERT_SMS_TO is not set");
    return;
  }
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      Body: messageBody,
      From: fromPhone,
      To: leadAlertTo, // BF_WEBSITE_NO_PERSONAL_NUMBER_v163
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Twilio request failed: ${response.status} ${errorBody}`);
  }
}

async function submitContact(req: Request, res: Response) {
  const parsed = contactFormSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const { company, firstName, lastName, email, phone, utm } = parsed.data;

  try {
    const { deduped } = await storage.createOrGetWebLead({
      companyName: company,
      firstName,
      lastName,
      email,
      phone,
    });

    if (!deduped) {
      await sendTwilioSms(`Website Lead:\nCompany: ${company}\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nUTM: ${JSON.stringify(utm ?? {})}`);
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Stored Web Lead:", {
        company,
        firstName,
        lastName,
        email,
        phone,
        utm,
        source: "Website Contact",
        deduped,
        createdAt: new Date().toISOString(),
      });
    }

    return res.json({ success: true, deduped });
  } catch (err) {
    logger.error({ msg: "Contact submission failed", traceId: getTraceId(req), error: err instanceof Error ? err.message : String(err) });
    return res.status(500).json({ error: "Internal server error" });
  }
}

router.post("/", submitContact);
router.post("/submit", submitContact);

export default router;

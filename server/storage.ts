import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export type CapitalReadinessLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  revenue: string;
  yearsInBusiness: string;
  existingDebt: string;
  score: number;
  tier: string;
  tag: "capital_readiness";
  sessionToken: string;
  createdAt: string;
};

export type WebLead = {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
};

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCapitalReadinessLead(lead: Omit<CapitalReadinessLead, "id" | "sessionToken" | "createdAt">): Promise<CapitalReadinessLead>;
  findCapitalReadinessLeadByContact(email: string, phone: string): Promise<CapitalReadinessLead | undefined>;
  createOrGetWebLead(lead: Omit<WebLead, "id" | "createdAt">): Promise<{ lead: WebLead; deduped: boolean }>;
  findWebLeadById(id: string): Promise<WebLead | undefined>;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private readinessLeads: Map<string, CapitalReadinessLead>;
  private webLeads: Map<string, WebLead>;

  constructor() {
    this.users = new Map();
    this.readinessLeads = new Map();
    this.webLeads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async findCapitalReadinessLeadByContact(email: string, phone: string): Promise<CapitalReadinessLead | undefined> {
    const normalizedEmail = normalize(email);
    const normalizedPhone = normalize(phone);
    return Array.from(this.readinessLeads.values()).find((lead) => normalize(lead.email) === normalizedEmail || normalize(lead.phone) === normalizedPhone);
  }

  async createCapitalReadinessLead(lead: Omit<CapitalReadinessLead, "id" | "sessionToken" | "createdAt">): Promise<CapitalReadinessLead> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const sessionToken = randomUUID();
    const record: CapitalReadinessLead = { ...lead, id, sessionToken, createdAt };
    this.readinessLeads.set(id, record);
    return record;
  }

  async createOrGetWebLead(lead: Omit<WebLead, "id" | "createdAt">): Promise<{ lead: WebLead; deduped: boolean }> {
    const normalizedEmail = normalize(lead.email);
    const normalizedPhone = normalize(lead.phone);
    const existing = Array.from(this.webLeads.values()).find((item) => normalize(item.email) === normalizedEmail || normalize(item.phone) === normalizedPhone);

    if (existing) {
      return { lead: existing, deduped: true };
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const record: WebLead = { ...lead, id, createdAt };
    this.webLeads.set(id, record);
    return { lead: record, deduped: false };
  }

  async findWebLeadById(id: string): Promise<WebLead | undefined> {
    return this.webLeads.get(id);
  }
}

export const storage = new MemStorage();

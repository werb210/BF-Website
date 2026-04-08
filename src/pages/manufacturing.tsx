import { VerticalPage } from "@/components/VerticalPage";

const solutions = [
  { name: "Inventory Line", when: "Fund raw material purchases ahead of production runs.", minimum: "A/R + inventory reporting and minimum gross margin stability.", size: "$300K to $6M" },
  { name: "Machinery Financing", when: "Modernize equipment while preserving operating liquidity.", minimum: "Equipment list, usage profile, and down payment capacity.", size: "$250K to $10M" },
  { name: "PO Financing", when: "Accept larger orders without supplier cash strain.", minimum: "Verifiable purchase orders and approved end buyer.", size: "$200K to $5M" },
  { name: "Working Capital Facility", when: "Balance payroll, production, and receivables lag.", minimum: "12+ months operations and positive contribution margins.", size: "$250K to $4M" },
];

export default function Manufacturing() {
  return <VerticalPage title="Manufacturing" headline="Capital structure that scales with production." subheadline="Inventory turns. Equipment modernization. PO-backed growth. Delivered through lender-calibrated packaging." image="https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=80" solutions={solutions} />;
}

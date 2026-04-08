import { VerticalPage } from "@/components/VerticalPage";

const solutions = [
  { name: "Progress Draw Financing", when: "Bridge labor and material spend between invoicing and draws.", minimum: "6+ months operating history and active contracts.", size: "$250K to $8M" },
  { name: "Equipment Leasing", when: "Acquire heavy equipment without upfront cash compression.", minimum: "Personal guarantee and equipment quotes.", size: "$100K to $5M" },
  { name: "AR Factoring", when: "Monetize receivables from approved general contractors.", minimum: "Creditworthy payors and clear invoices.", size: "$150K to $4M" },
  { name: "Working Capital Line", when: "Support payroll and mobilization costs across projects.", minimum: "Consistent monthly deposits and clean bank conduct.", size: "$200K to $3M" },
];

export default function Construction() {
  return <VerticalPage title="Construction" headline="Structured capital for project-driven cash flow." subheadline="Progress draws. Equipment financing. AR bridging. Delivered with lender-ready packaging." image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80" solutions={solutions} />;
}

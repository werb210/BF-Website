import { VerticalPage } from "@/components/VerticalPage";

const solutions = [
  { name: "Freight Factoring", when: "Convert delivered-load invoices into immediate liquidity.", minimum: "Approved broker list and clean BOL/invoice package.", size: "$100K to $7M" },
  { name: "Fleet Financing", when: "Expand tractors and trailers without balance-sheet shock.", minimum: "Asset list, maintenance records, and operating authority.", size: "$200K to $8M" },
  { name: "Fuel & Maintenance Line", when: "Handle variable fuel and repair costs across routes.", minimum: "6 months bank history and stable dispatch volume.", size: "$100K to $2.5M" },
  { name: "Working Capital Line", when: "Smooth payroll and receivables gaps from net-30/45 shippers.", minimum: "Contracted lanes or recurring customer base.", size: "$150K to $3M" },
];

export default function Logistics() {
  return <VerticalPage title="Logistics" headline="Capital built for speed, lanes, and margin discipline." subheadline="Freight factoring. Fleet facilities. Fuel liquidity. Structured to keep your operation moving." image="https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?auto=format&fit=crop&w=1200&q=80" solutions={solutions} />;
}

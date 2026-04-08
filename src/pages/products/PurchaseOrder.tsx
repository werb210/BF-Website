import ProductTemplate from "@/templates/ProductTemplate";

export default function PurchaseOrder() {
  return (
    <ProductTemplate
      title="Purchase Order Financing"
      description="Fulfill larger confirmed orders by funding supplier and production costs before end-customer payment."
      bestFor={[
        "Distributors with strong buyers and supplier prepayment needs",
        "Wholesalers scaling order volume beyond current liquidity",
        "Growth-stage operators managing fulfillment working capital",
      ]}
      howItWorks={[
        "Submit signed purchase orders and supplier terms",
        "Lenders evaluate buyer strength, margins, and delivery flow",
        "Funding supports procurement and fulfillment through completion",
      ]}
    />
  );
}

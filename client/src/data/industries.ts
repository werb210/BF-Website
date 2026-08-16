// BF_WEBSITE_INDUSTRIES_v4
export interface IndustryProduct { name: string; slug: string; note: string; }
export interface Industry {
  slug: string; title: string; name: string; image: string; heroImage: string;
  /** One-line meta description and card blurb. */ description: string;
  /** Card summary on the index. */ summary: string;
  lede: string; problem: string[]; products: IndustryProduct[];
  worthKnowing: string; haveReady: string;
}

export const industries: Industry[] = [
  {
    "slug": "construction",
    "title": "Construction",
    "name": "Construction",
    "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80",
    "description": "You've done the work. The holdback says you get paid for it in a year.",
    "summary": "You've done the work. The holdback says you get paid for it in a year.",
    "lede": "You've done the work. The holdback says you get paid for it in a year.",
    "problem": [
      "Construction pays late by design. Progress billing, holdbacks, and a general contractor whose own money hasn't landed either. Meanwhile mobilisation, labour and materials all come out of your account before anyone signs anything.",
      "Then the next job comes up, and taking it means funding the start of it while the last one is still owed to you."
    ],
    "products": [
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "on progress billings converts approved draws into cash now."
      },
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "covers mobilisation and payroll between draws."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for excavators, trucks and attachments, new or used."
      },
      {
        "name": "Sale and leaseback",
        "slug": "sale-leaseback",
        "note": "if you own equipment outright and need the cash more than the title."
      }
    ],
    "worthKnowing": "Some lenders won't touch construction receivables because of lien risk and holdbacks. Others specialise in exactly that. It's a good example of why the list of lenders you go to matters more than the number of them.",
    "haveReady": "Six months of bank statements, an accounts receivable ageing report, current contracts and draw schedules, and an equipment list if you're financing against assets."
  },
  {
    "slug": "manufacturing",
    "title": "Manufacturing",
    "name": "Manufacturing",
    "image": "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1581092921461-eab10380d6df?auto=format&fit=crop&w=1800&q=80",
    "description": "Your money sits in raw materials, then in work-in-progress, then in receivables. Rarely in the bank.",
    "summary": "Your money sits in raw materials, then in work-in-progress, then in receivables. Rarely in the bank.",
    "lede": "Your money sits in raw materials, then in work-in-progress, then in receivables. Rarely in the bank.",
    "problem": [
      "You buy materials, convert them, ship, and wait 60 days. The whole cycle is funded out of your pocket, and a large order — the good news — makes it worse before it makes it better.",
      "Add machinery that costs six figures and has a fifteen-year life, and conventional lending sized against last year's profit rarely covers it."
    ],
    "products": [
      {
        "name": "Asset-based lending",
        "slug": "asset-based-lending",
        "note": "sizes a facility against inventory and receivables together, which is the honest picture of a manufacturer's balance sheet."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for production machinery, new or used, with the equipment as security."
      },
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "turns shipped-and-invoiced into cash now."
      },
      {
        "name": "Sale and leaseback",
        "slug": "sale-leaseback",
        "note": "releases cash from machinery you already own."
      }
    ],
    "worthKnowing": "",
    "haveReady": "Financial statements, accounts receivable and payable ageing, inventory reports, an equipment list with ages, and six months of bank statements."
  },
  {
    "slug": "retail",
    "title": "Retail",
    "name": "Retail",
    "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1800&q=80",
    "description": "You buy the stock months before you sell it, and the busy season pays for the whole year.",
    "summary": "You buy the stock months before you sell it, and the busy season pays for the whole year.",
    "lede": "You buy the stock months before you sell it, and the busy season pays for the whole year.",
    "problem": [
      "Retail cash flow is a wave. Inventory has to be bought and paid for well before the season it's meant for, and a bad guess sits on your shelves as capital you can't touch.",
      "Then there's the quiet stretch, where rent and staff carry on regardless."
    ],
    "products": [
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "is the standard answer — draw to buy inventory, repay when it sells, draw again next season."
      },
      {
        "name": "Term loan",
        "slug": "term-loan",
        "note": "for a fit-out, a second location, or a real expansion."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for point-of-sale, refrigeration, fixtures."
      }
    ],
    "worthKnowing": "If your revenue is mostly card sales, lenders can see your daily volume and often lend against it, which can suit a business whose formal financials understate what it does.",
    "haveReady": "Six months of bank statements, card processing statements if a large share of sales, and a lease if you're financing premises or a fit-out."
  },
  {
    "slug": "restaurant-food-service",
    "title": "Restaurant / Food Service",
    "name": "Restaurant / Food Service",
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80",
    "description": "Thin margins, heavy equipment, and a bank that hears “restaurant” and stops listening.",
    "summary": "Thin margins, heavy equipment, and a bank that hears “restaurant” and stops listening.",
    "lede": "Thin margins, heavy equipment, and a bank that hears “restaurant” and stops listening.",
    "problem": [
      "Food service is capital-intensive and conventionally hard to finance. Kitchens cost a fortune, renovations close you while you pay for them, and margins leave little cushion for a slow month or a broken walk-in.",
      "Plenty of lenders decline the sector outright. Others fund it comfortably and understand its rhythms."
    ],
    "products": [
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for kitchen build-outs, refrigeration, hoods — new or used, and used commercial kitchen equipment is very financeable."
      },
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "for the seasonal stretches and the surprises."
      },
      {
        "name": "Term loan",
        "slug": "term-loan",
        "note": "for a renovation or a second location."
      }
    ],
    "worthKnowing": "Daily card volume matters here. A restaurant with steady receipts and modest formal financials often has better options than the financials alone suggest.",
    "haveReady": "Six months of bank statements, card processing statements, your lease, and equipment quotes if that's what you're financing."
  },
  {
    "slug": "technology",
    "title": "Technology",
    "name": "Technology",
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80",
    "description": "Growth capital that doesn't cost you a slice of the company.",
    "summary": "Growth capital that doesn't cost you a slice of the company.",
    "lede": "Growth capital that doesn't cost you a slice of the company.",
    "problem": [
      "Tech businesses are usually asset-light and often front-load spend — hiring, building, acquiring customers — well before the revenue matures. Traditional lending looks for hard security and finds none.",
      "The default answer is to raise equity, which is the most expensive money there is if the business is going to work."
    ],
    "products": [
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "against recurring revenue, for hiring and growth."
      },
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "if you sell to enterprise customers on long terms."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for hardware and infrastructure."
      },
      {
        "name": "Term loan",
        "slug": "term-loan",
        "note": "for an acquisition or a defined build."
      }
    ],
    "worthKnowing": "Contracted recurring revenue is an asset even though it doesn't appear as one. Lenders who understand the sector will lend against it; those who don't will ask what you can pledge and decline when the answer is laptops.",
    "haveReady": "Financial statements, a revenue breakdown separating recurring from one-off, your customer contracts, and six months of bank statements."
  },
  {
    "slug": "healthcare",
    "title": "Healthcare",
    "name": "Healthcare",
    "image": "/images/premium_photo-1661962673986-dcffa2a05e07.jpg",
    "heroImage": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=80",
    "description": "Practice equipment costs six figures and the insurers pay on their own schedule.",
    "summary": "Practice equipment costs six figures and the insurers pay on their own schedule.",
    "lede": "Practice equipment costs six figures and the insurers pay on their own schedule.",
    "problem": [
      "Clinical equipment is expensive and dates. Imaging, dental chairs, surgical and lab equipment all need replacing on a cycle that ignores your cash position.",
      "On the income side, third-party payers settle in their own time, so a busy practice can still be short."
    ],
    "products": [
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for clinical and diagnostic equipment, structured against its useful life."
      },
      {
        "name": "Term loan",
        "slug": "term-loan",
        "note": "for a build-out, a practice purchase, or a partner buy-in."
      },
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "to smooth reimbursement timing."
      },
      {
        "name": "Commercial real estate",
        "slug": "commercial-real-estate",
        "note": "if you're buying the premises rather than renting."
      }
    ],
    "worthKnowing": "Healthcare is a sector lenders generally like — stable demand, professional operators. That usually means better terms than a comparable business in a sector they're wary of.",
    "haveReady": "Financial statements, equipment quotes, professional credentials, and a purchase agreement if you're acquiring a practice."
  },
  {
    "slug": "transportation",
    "title": "Transportation",
    "name": "Transportation",
    "image": "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=1800&q=80",
    "description": "Fuel and drivers get paid this week. The freight bill gets paid in sixty days.",
    "summary": "Fuel and drivers get paid this week. The freight bill gets paid in sixty days.",
    "lede": "Fuel and drivers get paid this week. The freight bill gets paid in sixty days.",
    "problem": [
      "Carriers front everything. Fuel, drivers, maintenance, insurance — all out before the invoice is even raised, let alone settled. Growth makes it sharper, because more loads means more cash out before more cash in.",
      "Then a truck needs replacing, and that's a six-figure decision on top."
    ],
    "products": [
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "is close to standard in this industry, and for good reason — it converts freight bills to cash immediately and the decision leans on your shippers' credit."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for tractors, trailers and reefers, new or used."
      },
      {
        "name": "Sale and leaseback",
        "slug": "sale-leaseback",
        "note": "on owned units when you need working capital more than the titles."
      },
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "for fuel and payroll between settlements."
      }
    ],
    "worthKnowing": "",
    "haveReady": "Six months of bank statements, an accounts receivable ageing report, your customer list, and equipment details including units and mileage."
  },
  {
    "slug": "professional-services",
    "title": "Professional Services",
    "name": "Professional Services",
    "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80",
    "description": "Your assets walk out of the door every evening, which conventional lenders find hard to price.",
    "summary": "Your assets walk out of the door every evening, which conventional lenders find hard to price.",
    "lede": "Your assets walk out of the door every evening, which conventional lenders find hard to price.",
    "problem": [
      "Service firms carry payroll as their largest cost and hold work-in-progress that isn't yet billable. Clients pay on their own terms. There's little to pledge beyond receivables and a reputation.",
      "Partner buy-ins and acquisitions are common and rarely fundable from cash."
    ],
    "products": [
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "against receivables and work-in-progress, for payroll smoothing."
      },
      {
        "name": "Term loan",
        "slug": "term-loan",
        "note": "for a partner buy-in, a merger, or a lateral hire."
      },
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "if your clients are large and slow."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for technology and fit-out."
      }
    ],
    "worthKnowing": "",
    "haveReady": "Financial statements, accounts receivable ageing, a work-in-progress summary, partnership agreements for buy-in financing, and six months of bank statements."
  },
  {
    "slug": "agriculture",
    "title": "Agriculture",
    "name": "Agriculture",
    "image": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1592982537447-6f2a6a0ce8b4?auto=format&fit=crop&w=1800&q=80",
    "description": "You spend in spring and get paid after harvest, and the weather isn't consulted.",
    "summary": "You spend in spring and get paid after harvest, and the weather isn't consulted.",
    "lede": "You spend in spring and get paid after harvest, and the weather isn't consulted.",
    "problem": [
      "Agriculture has the longest, least forgiving cash cycle of any sector here. Seed, fertiliser, fuel and labour all go out months before anything is sold, and the size of the cheque at the end depends on things nobody controls.",
      "Machinery is enormous, specialised, and needs replacing on its own schedule."
    ],
    "products": [
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "for inputs, drawn in spring and repaid after harvest."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for tractors, combines and implements, new or used, structured around seasonal cash flow where the lender allows it."
      },
      {
        "name": "Sale and leaseback",
        "slug": "sale-leaseback",
        "note": "on owned machinery."
      },
      {
        "name": "Commercial real estate",
        "slug": "commercial-real-estate",
        "note": "for land and buildings."
      }
    ],
    "worthKnowing": "Some lenders will structure repayment around your harvest rather than the calendar. Not all will, and it's worth asking for.",
    "haveReady": "Financial statements, crop or production plans, an equipment list, land details, and six months of bank statements."
  },
  {
    "slug": "energy",
    "title": "Energy",
    "name": "Energy",
    "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1800&q=80",
    "description": "Long projects, heavy equipment, and customers who pay on their timetable rather than yours.",
    "summary": "Long projects, heavy equipment, and customers who pay on their timetable rather than yours.",
    "lede": "Long projects, heavy equipment, and customers who pay on their timetable rather than yours.",
    "problem": [
      "Energy and oilfield services businesses carry expensive specialised equipment and work for large counterparties who settle slowly. Activity swings with commodity prices, so a strong year and a hard one can sit back to back.",
      "Lenders who don't know the sector read that volatility as risk and decline."
    ],
    "products": [
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for specialised and heavy equipment."
      },
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "against receivables from large operators."
      },
      {
        "name": "Asset-based lending",
        "slug": "asset-based-lending",
        "note": "where equipment and receivables together support a larger facility than either alone."
      },
      {
        "name": "Sale and leaseback",
        "slug": "sale-leaseback",
        "note": "to release cash from owned equipment between cycles."
      }
    ],
    "worthKnowing": "",
    "haveReady": "Financial statements, accounts receivable ageing, an equipment list with ages and serial numbers, current contracts, and six months of bank statements."
  },
  {
    "slug": "distribution",
    "title": "Distribution",
    "name": "Distribution",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1800&q=80",
    "description": "You pay your suppliers on thirty days and your customers pay you on sixty.",
    "summary": "You pay your suppliers on thirty days and your customers pay you on sixty.",
    "lede": "You pay your suppliers on thirty days and your customers pay you on sixty.",
    "problem": [
      "Distribution is a working capital business. Success means holding more inventory, and holding more inventory means more of your money sitting in a warehouse.",
      "The gap between what you owe suppliers and what customers owe you has to be funded by somebody, and by default that's you."
    ],
    "products": [
      {
        "name": "Asset-based lending",
        "slug": "asset-based-lending",
        "note": "against inventory and receivables together — the natural fit for this model."
      },
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "for seasonal inventory builds."
      },
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "to close the terms gap directly."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for warehouse equipment and delivery vehicles."
      }
    ],
    "worthKnowing": "",
    "haveReady": "Financial statements, inventory reports, accounts receivable and payable ageing, supplier terms, and six months of bank statements."
  },
  {
    "slug": "media",
    "title": "Media",
    "name": "Media",
    "image": "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=80",
    "heroImage": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1800&q=80",
    "description": "Production costs land up front, and the money arrives when the project delivers.",
    "summary": "Production costs land up front, and the money arrives when the project delivers.",
    "lede": "Production costs land up front, and the money arrives when the project delivers.",
    "problem": [
      "Media and production work project to project. Crew, equipment and location costs are incurred before delivery, and payment often arrives in stages tied to milestones — or after broadcast.",
      "Between projects, overhead carries on. Lenders looking for steady monthly revenue see a lumpy line and hesitate."
    ],
    "products": [
      {
        "name": "Invoice factoring",
        "slug": "factoring",
        "note": "against contracted milestone billings."
      },
      {
        "name": "Equipment financing",
        "slug": "equipment-financing",
        "note": "for cameras, lighting, audio and post-production kit."
      },
      {
        "name": "Line of credit",
        "slug": "loc",
        "note": "to carry overhead between projects."
      },
      {
        "name": "Sale and leaseback",
        "slug": "sale-leaseback",
        "note": "on owned equipment."
      }
    ],
    "worthKnowing": "",
    "haveReady": "Signed contracts and delivery schedules, an accounts receivable ageing report, an equipment list, and six months of bank statements."
  },
];

// ===========================================================================
//  TAKEAWAY DEMO CONFIG — "Northgate Chinese Takeaway".
//
//  A fully generic, invented Chinese-takeaway brand used as the live ordering
//  demo. Address, menu items and prices are all made up. Same data shapes as
//  before, so the cart, Stripe checkout and kitchen dashboard work unchanged.
//  (Design tokens are global now — no per-brand theme block here.)
// ===========================================================================

export type Variant = { label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  desc?: string;
  price?: number; // single price
  variants?: Variant[]; // OR a set of size / portion options
  veg?: boolean;
  spicy?: boolean;
  popular?: boolean;
};

export type MenuGroup = "Starters" | "Mains" | "Sides" | "Drinks";

export const MENU_GROUP_ORDER: MenuGroup[] = ["Starters", "Mains", "Sides", "Drinks"];

export type MenuCategory = {
  id: string;
  name: string;
  group: MenuGroup;
  note?: string;
  blurb?: string;
  image: string;
  items: MenuItem[];
};

export type SetMeal = {
  id: string;
  name: string;
  serves: string;
  price: number;
  image: string;
  items: string[];
};

export type Hour = { day: string; time: string };
export type ReviewTheme = { title: string; body: string; tag: string };
export type Highlight = { icon: string; title: string; body: string };
export type FeaturedDish = {
  key: string;
  name: string;
  blurb: string;
  price: number;
  priceLabel?: string;
  image: string;
};

// ---------------------------------------------------------------------------
// IDENTITY & CONTACT (all invented)
// ---------------------------------------------------------------------------

export const identity = {
  name: "Northgate",
  legalName: "Northgate Chinese Takeaway",
  monogram: "北",
  cuisine: "Chinese Takeaway",
  tagline: "Chinese Kitchen · High Street",
  blurb:
    "A neighbourhood Chinese takeaway on the High Street, cooking fresh, generous plates to order — from crispy starters and sizzling salt & pepper dishes to noodles, curries and rice.",
};

export const contact = {
  line1: "High Street",
  city: "UK",
  postcode: "",
  area: "",
  phone: "01234 567 890",
  phoneHref: "tel:01234567890",
  email: "hello@northgatetakeaway.example",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Chinese+Takeaway+High+Street",
  mapsEmbed: "https://www.google.com/maps?q=High+Street+UK&output=embed",
};

export const hours: Hour[] = [
  { day: "Monday", time: "Closed" },
  { day: "Tuesday", time: "5:00pm – 10:00pm" },
  { day: "Wednesday", time: "5:00pm – 10:00pm" },
  { day: "Thursday", time: "5:00pm – 10:00pm" },
  { day: "Friday", time: "12:00pm – 2:00pm · 5:00pm – 10:30pm" },
  { day: "Saturday", time: "5:00pm – 10:30pm" },
  { day: "Sunday", time: "5:00pm – 10:00pm" },
];

export const delivery = {
  fee: 2.5,
  freeOver: 25,
  minimum: 12,
  radiusNote: "Free delivery on orders over £25 within 3 miles of the High Street.",
};

export const ratings = { rating: 4.6, count: 128 };

export const shopfront = {
  image: "/images/oyt/takeaway-shopfront.jpg",
  caption: "Order-ahead and delivery across the High Street",
  alt: "A food-delivery rider heading down a high street",
};

// ---------------------------------------------------------------------------
// PAGE COPY
// ---------------------------------------------------------------------------

export const home = {
  hero: {
    image: "/images/hero.jpg",
    imageAlt: "A spread of freshly cooked Chinese dishes",
    eyebrow: identity.tagline,
    title: "Fresh Chinese cooking, made to order on the High Street.",
    subtitle:
      "Crispy starters, sizzling salt & pepper dishes and generous noodle and rice plates — cooked fresh when you order, for collection or delivery.",
    note: "Collection & delivery · Kitchen open until 10pm",
  },
  highlights: [
    { icon: "🥡", title: "Cooked to order", body: "Every dish leaves the wok fresh — never sitting under a lamp." },
    { icon: "🍜", title: "Generous portions", body: "Big, shareable plates our regulars come back for." },
    { icon: "⚡", title: "Fast & friendly", body: "Freshly cooked and ready quickly, every time." },
  ] as Highlight[],
  featured: [
    {
      key: "aromatic-duck::Quarter",
      name: "Crispy Aromatic Duck",
      blurb: "Hand-shredded and served with warm pancakes, cucumber and hoisin.",
      price: 8.9,
      priceLabel: "from £8.90",
      image: "/images/duck.jpg",
    },
    {
      key: "salt-pepper-squid",
      name: "Salt & Pepper Squid",
      blurb: "Lightly battered and tossed with chilli, garlic and spring onion until crisp.",
      price: 5.9,
      image: "/images/saltpepper.jpg",
    },
    {
      key: "special-chow-mein",
      name: "Special Chow Mein",
      blurb: "Springy egg noodles wok-tossed with prawn, chicken and roast pork.",
      price: 7.8,
      image: "/images/chowmein.jpg",
    },
    {
      key: "crispy-chilli-beef",
      name: "Crispy Chilli Beef",
      blurb: "Golden shredded beef glazed in a sweet chilli and garlic sauce.",
      price: 6.2,
      image: "/images/beef.jpg",
    },
    {
      key: "salt-pepper-chicken",
      name: "Salt & Pepper Chicken",
      blurb: "Crisp, fragrant and tossed with chilli and spring onion — a house favourite.",
      price: 5.5,
      image: "/images/chicken.jpg",
    },
    {
      key: "king-prawn-black-bean",
      name: "King Prawns in Black Bean",
      blurb: "Plump king prawns with green pepper in a savoury black bean sauce.",
      price: 6.4,
      image: "/images/prawns.jpg",
    },
  ] as FeaturedDish[],
  findUs: {
    eyebrow: "Find us",
    title: "Right on the High Street",
    body: "You'll find us on the High Street — pop in to collect, or order ahead for delivery across the neighbourhood.",
  },
};

export const about = {
  hero: {
    eyebrow: "Our story",
    title: "A High Street favourite",
    image: "/images/banquet.jpg",
  },
  story: [
    "Northgate is a neighbourhood Chinese takeaway on the High Street, cooking honest, generous food for the families and regulars around it.",
    "Everything is cooked to order in a hot wok — from sizzling salt & pepper dishes and crispy chilli beef to slow-cooked aromatic duck. It's simple, fresh cooking done properly.",
    "Come in to collect, or order online for delivery across the neighbourhood.",
  ],
  values: [
    { icon: "🔥", title: "Cooked to order", body: "Every dish leaves the wok fresh — never sitting under a heat lamp." },
    { icon: "🥢", title: "Done properly", body: "Simple, generous cooking with good ingredients." },
    { icon: "🏠", title: "Local & friendly", body: "A genuine neighbourhood welcome, every visit." },
  ] as Highlight[],
};

export const reviews = {
  eyebrow: "What people say",
  title: "Loved locally",
  intro:
    "The notes below are a summary of the themes that come up most often in reviews of a good neighbourhood takeaway like this one.",
  themes: [
    {
      title: "Portions worth writing home about",
      body: "The servings are genuinely generous — plenty to share, with leftovers for the next day.",
      tag: "Value & portions",
    },
    {
      title: "Friendly, quick service",
      body: "A warm welcome and a fast, no-fuss collection experience, with happy recommendations for anyone new.",
      tag: "Service",
    },
    {
      title: "Consistently good food",
      body: "People return again and again for cooking that's fresh, well-seasoned and reliable.",
      tag: "Food quality",
    },
    {
      title: "Easy to order",
      body: "Ordering ahead online and turning up to collect is quick and painless — no phone queue.",
      tag: "Ordering",
    },
    {
      title: "Quick and dependable",
      body: "Whether collecting or ordering in, guests highlight how promptly food is ready on a busy evening.",
      tag: "Speed",
    },
  ] as ReviewTheme[],
};

// ---------------------------------------------------------------------------
// MENU — generic Chinese takeaway, invented items & prices.
// ---------------------------------------------------------------------------

export const menu: MenuCategory[] = [
  {
    id: "appetisers",
    name: "Appetisers",
    group: "Starters",
    blurb: "Crisp, golden starters — perfect for sharing while the wok gets going.",
    image: "/images/combo.jpg",
    items: [
      {
        id: "combo-platter",
        name: "Starter Platter for 2",
        desc: "Spring rolls, sesame prawn toast, crispy wonton, spare ribs & chicken wings.",
        price: 6.2,
        popular: true,
      },
      {
        id: "aromatic-duck",
        name: "Crispy Aromatic Duck",
        desc: "Slow-cooked and hand-shredded, with pancakes, cucumber, spring onion & hoisin.",
        variants: [
          { label: "Quarter", price: 8.9 },
          { label: "Half", price: 16.5 },
          { label: "Whole", price: 29.0 },
        ],
        popular: true,
      },
      { id: "veg-spring-rolls", name: "Vegetable Spring Rolls (4)", price: 3.6, veg: true },
      { id: "crispy-wonton", name: "Crispy Wonton (6)", desc: "Pork & prawn.", price: 3.9 },
      { id: "sesame-prawn-toast", name: "Sesame Prawn Toast (4)", price: 4.6 },
      { id: "chicken-satay", name: "Chicken Satay Skewers (4)", price: 4.9 },
      { id: "prawn-crackers", name: "Prawn Crackers", price: 1.8, veg: true },
    ],
  },
  {
    id: "soups",
    name: "Soups",
    group: "Starters",
    image: "/images/soup.jpg",
    items: [
      { id: "soup-hot-sour", name: "Hot & Sour Soup", price: 3.2, spicy: true },
      { id: "soup-chicken-sweetcorn", name: "Chicken & Sweetcorn Soup", price: 3.2 },
      { id: "soup-wonton", name: "Wonton Soup", price: 3.4 },
      { id: "soup-veg", name: "Mixed Vegetable Soup", price: 2.9, veg: true },
    ],
  },
  {
    id: "spare-ribs",
    name: "Spare Ribs",
    group: "Starters",
    blurb: "Meaty pork ribs, wok-tossed in your choice of sauce.",
    image: "/images/ribs.jpg",
    items: [
      { id: "ribs-salt-pepper", name: "Salt & Pepper Spare Ribs", price: 5.8, popular: true },
      { id: "ribs-bbq", name: "Barbecue Spare Ribs", price: 5.6 },
      { id: "ribs-honey", name: "Honey Spare Ribs", price: 5.6 },
    ],
  },
  {
    id: "salt-pepper",
    name: "Salt & Pepper",
    group: "Starters",
    blurb: "Light, crisp coating tossed with chilli, garlic & spring onion.",
    image: "/images/saltpepper.jpg",
    items: [
      { id: "salt-pepper-squid", name: "Salt & Pepper Squid", price: 5.9, popular: true },
      { id: "salt-pepper-king-prawns", name: "Salt & Pepper King Prawns", price: 6.2 },
      { id: "salt-pepper-chicken", name: "Salt & Pepper Chicken", price: 5.5 },
      { id: "salt-pepper-tofu", name: "Salt & Pepper Tofu", price: 4.8, veg: true },
    ],
  },
  {
    id: "dim-sum",
    name: "Dim Sum",
    group: "Starters",
    note: "Steamed fresh",
    blurb: "Steamed dumplings and buns, freshly cooked to order.",
    image: "/images/dimsum.jpg",
    items: [
      { id: "ds-bbq-buns", name: "Barbecue Pork Buns (3)", price: 3.9, popular: true },
      { id: "ds-har-gau", name: "Prawn Har Gau (4)", price: 3.9 },
      { id: "ds-siu-mai", name: "Pork Siu Mai (5)", price: 3.9 },
      { id: "ds-gyoza", name: "Pan-Fried Gyoza (5)", price: 4.8 },
    ],
  },
  {
    id: "house-specials",
    name: "House Specials",
    group: "Mains",
    note: "Dried chilli & Szechuan pepper",
    blurb: "Fiery, fragrant dishes tossed with whole dried chillies.",
    image: "/images/housespecial.jpg",
    items: [
      { id: "hs-chilli-chicken", name: "Szechuan Chilli Chicken", price: 5.9, spicy: true, popular: true },
      { id: "hs-chilli-king-prawns", name: "Szechuan Chilli King Prawns", price: 6.4, spicy: true },
      { id: "hs-chilli-squid", name: "Szechuan Chilli Squid", price: 6.2, spicy: true },
    ],
  },
  {
    id: "sweet-sour",
    name: "Sweet & Sour",
    group: "Mains",
    image: "/images/sweetsour.jpg",
    items: [
      { id: "ss-chicken-balls", name: "Sweet & Sour Chicken Balls", price: 5.2, popular: true },
      { id: "ss-chicken", name: "Sweet & Sour Chicken", price: 5.2 },
      { id: "ss-king-prawns", name: "Sweet & Sour King Prawns", price: 6.2 },
    ],
  },
  {
    id: "curry",
    name: "Curry",
    group: "Mains",
    blurb: "Mild, aromatic Chinese-style curry sauce.",
    image: "/images/curry.jpg",
    items: [
      { id: "curry-chicken", name: "Chicken Curry", price: 5.2, popular: true },
      { id: "curry-king-prawn", name: "King Prawn Curry", price: 6.2 },
      { id: "curry-beef", name: "Beef Curry", price: 5.4 },
      { id: "curry-veg", name: "Mixed Vegetable Curry", price: 4.8, veg: true },
    ],
  },
  {
    id: "king-prawn",
    name: "King Prawn",
    group: "Mains",
    blurb: "Plump king prawns, your choice of sauce.",
    image: "/images/prawns.jpg",
    items: [
      { id: "king-prawn-black-bean", name: "King Prawns in Black Bean Sauce", price: 6.4 },
      { id: "king-prawn-ginger", name: "King Prawns with Ginger & Spring Onion", price: 6.4 },
      { id: "king-prawn-kung-po", name: "King Prawns in Kung Po Sauce", price: 6.4, spicy: true },
    ],
  },
  {
    id: "beef",
    name: "Beef",
    group: "Mains",
    blurb: "Tender beef, stir-fried to order.",
    image: "/images/beef.jpg",
    items: [
      { id: "crispy-chilli-beef", name: "Crispy Chilli Beef", price: 6.2, spicy: true, popular: true },
      { id: "beef-black-bean", name: "Beef in Black Bean Sauce", price: 5.4 },
      { id: "beef-oyster", name: "Beef with Mixed Veg in Oyster Sauce", price: 5.4 },
      { id: "beef-black-pepper", name: "Beef in Black Pepper Sauce", price: 5.4 },
    ],
  },
  {
    id: "chicken",
    name: "Chicken",
    group: "Mains",
    blurb: "Our most-loved section — pick your favourite sauce.",
    image: "/images/chicken.jpg",
    items: [
      { id: "chicken-black-bean", name: "Chicken in Black Bean Sauce", price: 5.2 },
      { id: "chicken-lemon", name: "Chicken in Lemon Sauce", price: 5.2 },
      { id: "chicken-kung-po", name: "Chicken in Kung Po Sauce", price: 5.2, spicy: true },
      { id: "chicken-cashew", name: "Chicken with Cashew Nuts", price: 5.4 },
      { id: "chicken-oyster", name: "Chicken with Mixed Veg in Oyster Sauce", price: 5.2 },
    ],
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    group: "Mains",
    blurb: "Meat-free dishes cooked with the same care — tofu & fresh vegetables.",
    image: "/images/tofu.jpg",
    items: [
      { id: "veg-tofu-black-bean", name: "Tofu in Black Bean Sauce", price: 4.8, veg: true },
      { id: "veg-tofu-kung-po", name: "Tofu in Kung Po Sauce", price: 4.8, veg: true, spicy: true },
      { id: "veg-mixed", name: "Stir-Fried Mixed Vegetables", price: 4.6, veg: true },
      { id: "veg-aubergine", name: "Aubergine in Black Bean Sauce", price: 4.8, veg: true },
    ],
  },
  {
    id: "chow-mein",
    name: "Chow Mein",
    group: "Mains",
    blurb: "Springy egg noodles wok-fried with beansprouts & spring onion.",
    image: "/images/chowmein.jpg",
    items: [
      { id: "special-chow-mein", name: "Special Chow Mein", desc: "Prawn, chicken & roast pork.", price: 7.8, popular: true },
      { id: "chicken-chow-mein", name: "Chicken Chow Mein", price: 6.8 },
      { id: "king-prawn-chow-mein", name: "King Prawn Chow Mein", price: 7.6 },
      { id: "veg-chow-mein", name: "Vegetable Chow Mein", price: 6.4, veg: true },
    ],
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    group: "Mains",
    blurb: "Wok-fried rice, light and full of flavour.",
    image: "/images/friedrice.jpg",
    items: [
      { id: "special-fried-rice", name: "Special Fried Rice", desc: "Prawn, roast pork, chicken & peas.", price: 7.6, popular: true },
      { id: "chicken-fried-rice", name: "Chicken Fried Rice", price: 6.8 },
      { id: "king-prawn-fried-rice", name: "King Prawn Fried Rice", price: 7.4 },
      { id: "egg-fried-rice-main", name: "Egg Fried Rice", price: 4.2, veg: true },
    ],
  },
  {
    id: "side-orders",
    name: "Side Orders",
    group: "Sides",
    image: "/images/sides.jpg",
    items: [
      {
        id: "side-egg-fried-rice",
        name: "Egg Fried Rice",
        variants: [
          { label: "Small", price: 3.0 },
          { label: "Large", price: 3.9 },
        ],
        veg: true,
      },
      {
        id: "side-boiled-rice",
        name: "Boiled Rice",
        variants: [
          { label: "Small", price: 2.7 },
          { label: "Large", price: 3.4 },
        ],
        veg: true,
      },
      { id: "side-chips", name: "Chips", price: 3.0, veg: true },
      { id: "side-sp-chips", name: "Salt & Pepper Chips", price: 4.4, veg: true, popular: true },
      { id: "side-beansprouts", name: "Stir-Fried Beansprouts", price: 4.6, veg: true },
      { id: "side-prawn-crackers", name: "Prawn Crackers", price: 1.8, veg: true },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    group: "Drinks",
    image: "/images/sides.jpg",
    items: [
      { id: "drink-coke", name: "Coca-Cola (can)", price: 1.4 },
      { id: "drink-diet-coke", name: "Diet Coke (can)", price: 1.4 },
      { id: "drink-lemonade", name: "Lemonade (can)", price: 1.4 },
      { id: "drink-water", name: "Still Water (bottle)", price: 1.2 },
    ],
  },
];

export const setMeals: SetMeal[] = [
  {
    id: "set-two",
    name: "Set Meal for Two",
    serves: "Serves 2",
    price: 30.0,
    image: "/images/spread.jpg",
    items: [
      "Vegetable Spring Rolls (x4)",
      "Sweet & Sour Chicken",
      "Beef in Black Bean Sauce",
      "Chicken Curry",
      "Egg Fried Rice",
      "Prawn Crackers",
    ],
  },
  {
    id: "set-three",
    name: "Set Meal for Three",
    serves: "Serves 3",
    price: 43.0,
    image: "/images/banquet.jpg",
    items: [
      "Starter Platter",
      "Salt & Pepper Spare Ribs",
      "Sweet & Sour Chicken",
      "Crispy Chilli Beef",
      "Szechuan Chilli Chicken",
      "Special Fried Rice",
      "Prawn Crackers",
    ],
  },
  {
    id: "set-four",
    name: "Set Meal for Four",
    serves: "Serves 4",
    price: 64.0,
    image: "/images/hero.jpg",
    items: [
      "Half Crispy Aromatic Duck",
      "Salt & Pepper Chicken",
      "Sweet & Sour King Prawns",
      "Beef in Oyster Sauce",
      "King Prawns in Black Bean Sauce",
      "Crispy Chilli Beef",
      "Special Fried Rice",
      "Prawn Crackers",
    ],
  },
];

export const brand = {
  identity,
  contact,
  hours,
  delivery,
  ratings,
  shopfront,
  home,
  about,
  reviews,
  menu,
  setMeals,
};

export default brand;

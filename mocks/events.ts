export type TicketType = {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
};

export type Event = {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: string;
  category: string;
  image: string;
  description: string;
  lineup?: string[];
  isFeatured?: boolean;
  ticketTypes: TicketType[];
};

export const CATEGORIES = [
  "All",
  "Music",
  "Nightlife",
  "Arts & Culture",
  "Food & Drink",
  "Sports",
  "Comedy",
];

export const CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "Warehouse Nights",
    artist: "DJ Shadow Dubai",
    date: "2025-11-02",
    time: "10:00 PM",
    venue: "The District",
    location: "Mumbai",
    price: "₹1,499",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
    description: "Experience the ultimate nightlife with DJ Shadow Dubai spinning the hottest tracks. Get ready for an unforgettable night of music, energy, and electrifying vibes.",
    lineup: ["DJ Shadow Dubai", "DJ Ankit", "MC Rahul"],
    isFeatured: true,
    ticketTypes: [
      { id: "1-1", name: "General Admission", price: 1499, description: "Access to main floor", available: 200 },
      { id: "1-2", name: "VIP Pass", price: 2999, description: "VIP lounge + priority entry", available: 50 },
      { id: "1-3", name: "Couple Pass", price: 2699, description: "Entry for 2 people", available: 100 },
    ],
  },
  {
    id: "2",
    title: "Indie Sundays",
    artist: "The Local Train",
    date: "2025-11-03",
    time: "8:00 PM",
    venue: "Bluefrog",
    location: "Mumbai",
    price: "₹999",
    category: "Music",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    description: "Join us for an intimate evening with The Local Train, one of India's most beloved indie rock bands. Sing along to your favorite tracks in a cozy setting.",
    lineup: ["The Local Train", "Opening Act: Parvaaz"],
    isFeatured: true,
    ticketTypes: [
      { id: "2-1", name: "General Entry", price: 999, description: "Standing zone", available: 150 },
      { id: "2-2", name: "Premium Seating", price: 1999, description: "Reserved seating near stage", available: 30 },
    ],
  },
  {
    id: "3",
    title: "Techno Tuesdays",
    artist: "Arjun Vagale",
    date: "2025-11-05",
    time: "9:00 PM",
    venue: "Kitty Su",
    location: "Delhi",
    price: "₹1,299",
    category: "Music",
    image: "https://images.unsplash.com/photo-1571266028243-d220c6c1b0af?w=800",
    description: "Dive into the underground techno scene with Arjun Vagale. A night of pulsating beats and hypnotic rhythms awaits.",
    lineup: ["Arjun Vagale", "Support: DJ Kohra"],
    ticketTypes: [
      { id: "3-1", name: "Entry Pass", price: 1299, description: "Full night access", available: 180 },
      { id: "3-2", name: "VIP Table", price: 8999, description: "Table for 4 + bottle service", available: 15 },
    ],
  },
  {
    id: "4",
    title: "Comedy Central Live",
    artist: "Zakir Khan",
    date: "2025-11-08",
    time: "7:30 PM",
    venue: "NCPA",
    location: "Mumbai",
    price: "₹799",
    category: "Comedy",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
    description: "Get ready to laugh till your sides hurt! Zakir Khan brings his signature storytelling style and observational humor.",
    lineup: ["Zakir Khan"],
    ticketTypes: [
      { id: "4-1", name: "Regular Seat", price: 799, description: "Standard seating", available: 250 },
      { id: "4-2", name: "Premium Seat", price: 1299, description: "Front row seating", available: 50 },
    ],
  },
  {
    id: "5",
    title: "Jazz & Wine Evening",
    artist: "Radha Thomas Ensemble",
    date: "2025-11-10",
    time: "7:00 PM",
    venue: "The Quarter",
    location: "Mumbai",
    price: "₹1,899",
    category: "Music",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800",
    description: "An elegant evening of smooth jazz paired with fine wines. Perfect for a sophisticated night out with the Radha Thomas Ensemble.",
    lineup: ["Radha Thomas Ensemble"],
    isFeatured: true,
    ticketTypes: [
      { id: "5-1", name: "Standard Entry", price: 1899, description: "Includes one glass of wine", available: 100 },
      { id: "5-2", name: "Premium Package", price: 3499, description: "Table + wine pairing", available: 25 },
    ],
  },
  {
    id: "6",
    title: "Bollywood Retro Night",
    artist: "DJ Aqeel",
    date: "2025-11-12",
    time: "9:30 PM",
    venue: "Trilogy",
    location: "Mumbai",
    price: "₹899",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    description: "Dance to the golden hits of Bollywood with DJ Aqeel. A nostalgic journey through the best retro tracks.",
    lineup: ["DJ Aqeel"],
    ticketTypes: [
      { id: "6-1", name: "Entry Ticket", price: 899, description: "Dance floor access", available: 300 },
      { id: "6-2", name: "Stag Entry", price: 1499, description: "Entry for single males", available: 100 },
    ],
  },
  {
    id: "7",
    title: "Art Exhibition Opening",
    artist: "Contemporary Artists Collective",
    date: "2025-11-15",
    time: "6:00 PM",
    venue: "Jehangir Art Gallery",
    location: "Mumbai",
    price: "Free",
    category: "Arts & Culture",
    image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800",
    description: "Explore cutting-edge contemporary art from emerging Indian artists. Wine and canapés will be served.",
    lineup: ["Featured Artists: Riya Sharma, Amit Patel, Neha Reddy"],
    ticketTypes: [
      { id: "7-1", name: "Free Entry", price: 0, description: "Open to all", available: 500 },
    ],
  },
  {
    id: "8",
    title: "Rooftop Sundowner",
    artist: "House Music Special",
    date: "2025-11-16",
    time: "6:00 PM",
    venue: "AER",
    location: "Mumbai",
    price: "₹1,599",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    description: "Catch the sunset with spectacular city views and groovy house music. An upscale experience you won't forget.",
    lineup: ["Resident DJs"],
    ticketTypes: [
      { id: "8-1", name: "Entry Pass", price: 1599, description: "Access to rooftop", available: 120 },
      { id: "8-2", name: "Couple Entry", price: 2799, description: "Entry for 2 people", available: 60 },
    ],
  },
  {
    id: "9",
    title: "Fusion Food Festival",
    artist: "Celebrity Chefs Live",
    date: "2025-11-18",
    time: "12:00 PM",
    venue: "Mahalaxmi Racecourse",
    location: "Mumbai",
    price: "₹599",
    category: "Food & Drink",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    description: "A gastronomic journey featuring live cooking demos, food stalls, and tastings from Mumbai's top chefs.",
    lineup: ["Chef Ranveer Brar", "Chef Pooja Dhingra", "Chef Kelvin Cheung"],
    ticketTypes: [
      { id: "9-1", name: "General Entry", price: 599, description: "Festival access", available: 500 },
      { id: "9-2", name: "Tasting Pass", price: 1299, description: "All-access + 10 tastings", available: 200 },
    ],
  },
  {
    id: "10",
    title: "Electronic Music Festival",
    artist: "Nucleya & Ritviz",
    date: "2025-11-20",
    time: "4:00 PM",
    venue: "Mahalaxmi Racecourse",
    location: "Mumbai",
    price: "₹2,499",
    category: "Music",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800",
    description: "India's biggest electronic music stars come together for an explosive day festival. Bass, beats, and pure energy.",
    lineup: ["Nucleya", "Ritviz", "Satori", "Lifafa"],
    isFeatured: true,
    ticketTypes: [
      { id: "10-1", name: "General Access", price: 2499, description: "Full festival access", available: 1000 },
      { id: "10-2", name: "VIP Pass", price: 4999, description: "VIP area + lounges", available: 150 },
      { id: "10-3", name: "All-Access Pass", price: 7999, description: "Backstage + meet & greet", available: 50 },
    ],
  },
];

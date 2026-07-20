// ===========================================================================
//  BOOKING DEMO CONFIGS — the shared shape used by the driving, barber, tutor
//  and PT demos. One booking-template component (BookingDemo) + one dashboard
//  (BookingBoard) render any of these. Everything below is invented.
// ===========================================================================

export type BookingService = {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  desc?: string;
  popular?: boolean;
};

export type BookingStaff = { id: string; name: string; role: string };

export type SampleBooking = {
  service: string;
  customer: string;
  staff?: string;
  dayOffset: number; // 0 = today, 1 = tomorrow, ...
  time: string; // "14:00"
  status: "new" | "confirmed" | "completed";
};

export type BookingConfig = {
  slug: string;
  businessName: string;
  kind: string; // "Driving School"
  monogram: string;
  tagline: string;
  blurb: string;
  heroImage: string;

  customerNoun: string; // "learner", "client"
  bookVerb: string; // "Book a lesson"
  bookedNoun: string; // "lesson", "appointment"

  services: BookingService[];
  staff: BookingStaff[];
  staffLabel: string; // "Instructor", "Barber", "Tutor", "Trainer"

  days: number; // how many upcoming days to offer
  slots: string[]; // time slots offered each day
  openWeekdays: number[]; // 0=Sun ... 6=Sat

  contact: { phone: string; phoneHref: string; email: string; area: string };
  sampleBookings: SampleBooking[];
};

// ---------------------------------------------------------------------------

export const driving: BookingConfig = {
  slug: "driving",
  businessName: "Roadstart Driving School",
  kind: "Driving School",
  monogram: "R",
  tagline: "Manual & automatic lessons · Patient, DVSA-qualified instructors",
  blurb:
    "Learn to drive with Roadstart — friendly, structured lessons in dual-controlled cars, booked around your week. Block-book and save.",
  heroImage: "/images/oyt/driving-hero.jpg",
  customerNoun: "learner",
  bookVerb: "Book a lesson",
  bookedNoun: "lesson",
  services: [
    { id: "lesson-1h", name: "Standard Lesson", duration: 60, price: 34, desc: "One hour, one-to-one, dual-controlled car.", popular: true },
    { id: "lesson-2h", name: "Double Lesson", duration: 120, price: 66, desc: "Two hours — the fastest way to progress." },
    { id: "assessment", name: "Intro Assessment", duration: 60, price: 30, desc: "First lesson & honest assessment of where you're at." },
    { id: "test-package", name: "Test-Day Package", duration: 150, price: 120, desc: "Pre-test warm-up plus use of the car for your test." },
  ],
  staff: [
    { id: "sam", name: "Sam", role: "Manual & automatic" },
    { id: "priya", name: "Priya", role: "Manual · nervous learners" },
  ],
  staffLabel: "Instructor",
  days: 14,
  slots: ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"],
  openWeekdays: [1, 2, 3, 4, 5, 6],
  contact: { phone: "01234 567 001", phoneHref: "tel:01234567001", email: "hello@roadstart.example", area: "High Street & surrounding area" },
  sampleBookings: [
    { service: "Standard Lesson", customer: "Aisha K.", staff: "Sam", dayOffset: 0, time: "10:30", status: "confirmed" },
    { service: "Double Lesson", customer: "Tom B.", staff: "Priya", dayOffset: 0, time: "13:30", status: "new" },
    { service: "Test-Day Package", customer: "Chloe M.", staff: "Sam", dayOffset: 1, time: "09:00", status: "confirmed" },
    { service: "Standard Lesson", customer: "Marcus L.", staff: "Priya", dayOffset: 1, time: "16:30", status: "new" },
  ],
};

export const barber: BookingConfig = {
  slug: "barber",
  businessName: "Fade & Co Barbers",
  kind: "Barbershop",
  monogram: "F",
  tagline: "Skin fades · Beard work · Hot-towel finishes",
  blurb:
    "Walk-ins welcome, but book ahead to skip the wait. Pick your barber, pick your time — sorted in seconds.",
  heroImage: "/images/oyt/barber-hero.jpg",
  customerNoun: "client",
  bookVerb: "Book a chair",
  bookedNoun: "appointment",
  services: [
    { id: "skin-fade", name: "Skin Fade", duration: 45, price: 20, desc: "Sharp fade, finished with a line-up.", popular: true },
    { id: "cut-beard", name: "Cut & Beard", duration: 60, price: 28, desc: "Full cut plus beard shape and hot towel." },
    { id: "trim", name: "Tidy-Up Trim", duration: 30, price: 14, desc: "Quick clean-up between cuts." },
    { id: "kids", name: "Kids' Cut", duration: 30, price: 13, desc: "Under-12s." },
  ],
  staff: [
    { id: "deniz", name: "Deniz", role: "Fades & beard work" },
    { id: "jordan", name: "Jordan", role: "Classic cuts" },
    { id: "reece", name: "Reece", role: "Skin fades" },
  ],
  staffLabel: "Barber",
  days: 10,
  slots: ["09:30", "10:15", "11:00", "11:45", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45"],
  openWeekdays: [1, 2, 3, 4, 5, 6],
  contact: { phone: "01234 567 002", phoneHref: "tel:01234567002", email: "hello@fadeandco.example", area: "High Street" },
  sampleBookings: [
    { service: "Skin Fade", customer: "Leon", staff: "Reece", dayOffset: 0, time: "11:00", status: "confirmed" },
    { service: "Cut & Beard", customer: "Amir", staff: "Deniz", dayOffset: 0, time: "13:00", status: "new" },
    { service: "Kids' Cut", customer: "Ollie (7)", staff: "Jordan", dayOffset: 0, time: "14:30", status: "confirmed" },
    { service: "Skin Fade", customer: "Dan", staff: "Reece", dayOffset: 1, time: "10:15", status: "new" },
  ],
};

export const tutor: BookingConfig = {
  slug: "tutor",
  businessName: "Thornfield Tutoring",
  kind: "Private Tuition",
  monogram: "T",
  tagline: "Maths, English & Science · KS2 to GCSE · In-person & online",
  blurb:
    "One-to-one tuition that builds real confidence. Book a free intro call, then set up a regular weekly slot.",
  heroImage: "/images/oyt/tutor-hero.jpg",
  customerNoun: "family",
  bookVerb: "Book a session",
  bookedNoun: "session",
  services: [
    { id: "intro", name: "Free Intro Call", duration: 20, price: 0, desc: "A quick chat to understand what your child needs.", popular: true },
    { id: "session-1h", name: "1-Hour Session", duration: 60, price: 30, desc: "One-to-one, tailored to the syllabus." },
    { id: "gcse", name: "GCSE Focus Session", duration: 90, price: 45, desc: "Exam technique and past-paper work." },
    { id: "assessment", name: "Progress Assessment", duration: 60, price: 35, desc: "A full assessment with a written summary." },
  ],
  staff: [
    { id: "ms-hart", name: "Ms Hart", role: "Maths & Science" },
    { id: "mr-obi", name: "Mr Obi", role: "English & Humanities" },
  ],
  staffLabel: "Tutor",
  days: 14,
  slots: ["15:30", "16:30", "17:30", "18:30", "19:30"],
  openWeekdays: [1, 2, 3, 4, 5, 0],
  contact: { phone: "01234 567 003", phoneHref: "tel:01234567003", email: "hello@thornfieldtutoring.example", area: "In-person locally & online" },
  sampleBookings: [
    { service: "1-Hour Session", customer: "Bennett family", staff: "Ms Hart", dayOffset: 0, time: "16:30", status: "confirmed" },
    { service: "GCSE Focus Session", customer: "Aria P.", staff: "Ms Hart", dayOffset: 0, time: "18:30", status: "new" },
    { service: "Free Intro Call", customer: "Okafor family", staff: "Mr Obi", dayOffset: 1, time: "17:30", status: "new" },
    { service: "1-Hour Session", customer: "Jacob R.", staff: "Mr Obi", dayOffset: 2, time: "15:30", status: "confirmed" },
  ],
};

export const pt: BookingConfig = {
  slug: "pt",
  businessName: "Ironclad Personal Training",
  kind: "Personal Training",
  monogram: "I",
  tagline: "1-to-1 coaching · Small-group sessions · Strength & conditioning",
  blurb:
    "Train with a plan that actually fits your week. Book single sessions or lock in a regular slot.",
  heroImage: "/images/oyt/pt-hero.jpg",
  customerNoun: "member",
  bookVerb: "Book a session",
  bookedNoun: "session",
  services: [
    { id: "pt-1to1", name: "1-to-1 Session", duration: 60, price: 40, desc: "One hour, fully tailored coaching.", popular: true },
    { id: "consult", name: "Free Consultation", duration: 30, price: 0, desc: "Goals, movement screen and a plan." },
    { id: "small-group", name: "Small-Group Session", duration: 45, price: 15, desc: "Up to 4 people — the fun, affordable option." },
    { id: "block-6", name: "6-Session Block", duration: 60, price: 210, desc: "Six 1-to-1 sessions, booked in advance." },
  ],
  staff: [
    { id: "coach-max", name: "Coach Max", role: "Strength & conditioning" },
    { id: "coach-nadia", name: "Coach Nadia", role: "Fat loss & mobility" },
  ],
  staffLabel: "Trainer",
  days: 14,
  slots: ["06:30", "07:30", "09:00", "12:00", "17:00", "18:00", "19:00"],
  openWeekdays: [1, 2, 3, 4, 5, 6],
  contact: { phone: "01234 567 004", phoneHref: "tel:01234567004", email: "hello@ironcladpt.example", area: "High Street studio & local parks" },
  sampleBookings: [
    { service: "1-to-1 Session", customer: "Priya S.", staff: "Coach Max", dayOffset: 0, time: "07:30", status: "confirmed" },
    { service: "Small-Group Session", customer: "Weekday crew", staff: "Coach Nadia", dayOffset: 0, time: "09:00", status: "confirmed" },
    { service: "Free Consultation", customer: "Ryan T.", staff: "Coach Max", dayOffset: 0, time: "17:00", status: "new" },
    { service: "1-to-1 Session", customer: "Hannah W.", staff: "Coach Nadia", dayOffset: 1, time: "18:00", status: "new" },
  ],
};

export const bookingConfigs: Record<string, BookingConfig> = {
  driving,
  barber,
  tutor,
  pt,
};

export function getBookingConfig(slug: string): BookingConfig | undefined {
  return bookingConfigs[slug];
}

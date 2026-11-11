import {
  Users, Crown, Award, Briefcase, Target, Eye, Sparkles, Shield, ShieldCheck,
  Lightbulb, TrendingUp, HeartHandshake, Plane, PlaneTakeoff, Clock,
  Fuel, Flame, Ruler, FileText, Mail, Phone, Send, BadgeCheck, Car, Truck,
  Building, Building2, Globe, ScrollText, Stamp, Camera, KeyRound, Megaphone,
  Monitor, Flag, Store, LayoutGrid, Boxes, Warehouse, Snowflake, Package,
  Wifi, Accessibility, BriefcaseMedical, Stethoscope, Receipt, Coffee,
  Cigarette, Gift, Watch, Wine, Plug, Star, BedDouble, MapPin, Bus, Navigation,
  Bike, ParkingCircle, Luggage, Ban, Link2, ExternalLink, HeartPulse,
  GraduationCap, Landmark, ClipboardCheck, FileCheck,
  Mountain, Waves, Tent, Wind, Compass, Footprints, Bird, Trees, Umbrella,
  Gem, Home, Utensils, ShoppingBag,
} from 'lucide-react'
import { u, c, img } from './images.js'

export const pages = {
  /* ════════════════════════ RAS AL KHAIMAH AIRPORT HOME ════════════════════════ */

  /* ------------------------------ Management Team ------------------------------ */
  management: {
    hero: {
      image: img.careersHero,
      badge: 'Leadership',
      title: 'Management Team',
      subtitle: 'The Board of Directors and executive leadership guiding Ras Al Khaimah International Airport.',
    },
    sections: [
      {
        type: 'team',
        kicker: 'Governance',
        title: 'Board of',
        highlight: 'Directors',
        columns: 3,
        items: [
          { icon: Crown, image: '/Sheikh-Engr.-Salem-Bin-Sultan-Al-Qasimi.png', imageTop: true, imageTall: true, title: 'H.E. Sheikh Engr. Salem bin Sultan Al Qasimi', tag: 'Chairman', text: 'Member of the Ras Al Khaimah Executive Council and Chairman since 1997, overseeing management, business development, marketing and administration across a 350-strong workforce.' },
          { icon: Briefcase, image: '/Ciro_lorio.png', imageTop: true, imageTall: true, title: 'Ciro Iorio', tag: 'Board Member', text: 'Investment professional with 15+ years’ experience and a director on the IDO investment team. Former Senior Vice President at McKinsey & Co. MBA from MIT Sloan. Appointed November 2022.' },
          { icon: Award, image: '/aditya_ghosh.jpg', imageTop: true, imageTall: true, title: 'Aditya Ghosh', tag: 'Independent Director', text: 'Co-Founder of Akasa Air and former IndiGo President. Harvard Business School graduate, Young Global Leader and Fortune 40-Under-40 honouree.' },
        ],
      },
      {
        type: 'team',
        bg: 'mist',
        kicker: 'Executive Leadership',
        title: 'Chief Executive',
        highlight: 'Officer',
        columns: 3,
        items: [
          { icon: Users, image: '/Manish%20Seth.png', imageTop: true, imageTall: true, title: 'Manish Seth', tag: 'Chief Executive Officer', text: 'Aviation executive specialising in airport management and infrastructure development. Former Deputy CEO at Aéroport de Libreville, with previous roles at Mumbai International Airport.' },
        ],
      },
    ],
  },

  /* ------------------------------ Mission & Vision ------------------------------ */
  mission: {
    hero: {
      image: img.aboutHero,
      badge: 'Who we are',
      title: 'Mission & Vision',
      subtitle: 'Our purpose and the values that guide everything we do at RAK Airport.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Our purpose',
        title: 'Vision &',
        highlight: 'Mission',
        columns: 2,
        items: [
          { icon: Eye, title: 'Our Vision', text: 'To be a successful, world-class airport that serves its customers to the best of its abilities - contributing to the long-term growth and prosperity of our airport, our emirate and its people.' },
          { icon: Target, title: 'Our Mission', text: 'Through our professional service, we ensure every customer has a positive experience that does credit to our team, our airport and our emirate.' },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        title: 'Our core',
        highlight: 'values',
        columns: 3,
        items: [
          { icon: Shield, title: 'Individual', text: 'Safe, secure and proud to belong.' },
          { icon: Lightbulb, title: 'Resourceful', text: 'Believing the possibilities are endless.' },
          { icon: HeartHandshake, title: 'Welcoming', text: 'Approachable and collaborative.' },
          { icon: TrendingUp, title: 'Evolving', text: 'Continuously advancing.' },
          { icon: ShieldCheck, title: 'Integrity', text: 'Transparent and honest.' },
          { icon: Sparkles, title: 'Inspiring', text: 'Recognising the potential in people and situations.' },
        ],
      },
    ],
  },

  /* ---------------------------------- About Us ---------------------------------- */
  about: {
    hero: {
      image: img.aboutHero,
      badge: 'Our story',
      title: 'About RAK Airport',
      subtitle: 'An evolving boutique airport connecting Ras Al Khaimah to the Middle East and beyond.',
    },
    sections: [
      {
        type: 'intro',
        kicker: 'Who we are',
        title: 'An evolving',
        highlight: 'boutique airport',
        image: '/about-airport-apron.png',
        paragraphs: [
          'Inaugurated in 1976, Ras Al Khaimah (RAK) International Airport is an evolving boutique airport that connects to destinations around the Middle East region and beyond. Over the years the airport has run secure, safe and efficient operations, and has registered steady growth in passengers, cargo and aircraft movements.',
          'The Emirate of Ras Al Khaimah continues to see strong growth in both commercial and tourism sectors, and Ras Al Khaimah International Airport is experiencing increased activity in line with this growth.',
        ],
      },
      {
        type: 'stats',
        bg: 'brand',
        items: [
          { num: '1976', label: 'Inaugurated' },
          { num: '64 km', label: 'Of beaches' },
          { num: '7,000 yrs', label: 'Of history' },
          { num: '4 hrs', label: 'To ⅓ of the world' },
        ],
      },
      {
        type: 'intro',
        kicker: 'The emirate',
        title: 'Ras Al Khaimah',
        highlight: 'at a glance',
        image: '/Ras-Al-Khaimah-at-a-glance.jpg',
        paragraphs: [
          'Ras Al Khaimah is the northernmost of the seven emirates that make up the United Arab Emirates. It is known for its diverse landscape - from 64 km of beaches to deserts and imposing mountains - and a rich history dating back 7,000 years, with many archaeological sites, four of which are shortlisted on UNESCO’s tentative list of World Heritage Sites.',
          'Centrally located at the modern crossroads between Europe, Asia and Africa, one third of the world’s population is within four hours’ flying time - making it an ideal location for businesses to expand into the UAE, the Middle East, Africa and beyond.',
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Jebel Jais',
        title: 'Record-breaking',
        highlight: 'attractions',
        columns: 2,
        items: [
          { icon: Wind, image: '/Jebel-Jais-Flight.png', title: 'Jebel Jais Flight', text: 'The world’s longest zip line at almost 3 km, on Jebel Jais - the highest mountain in the UAE.' },
          { icon: Utensils, image: '/1484-by-Puro.png', title: '1484 by Puro', text: 'The UAE’s highest restaurant, perched high on Jebel Jais.' },
        ],
      },
      {
        type: 'cards',
        kicker: 'Why Ras Al Khaimah',
        title: 'A diverse, resilient',
        highlight: 'economy',
        columns: 3,
        items: [
          { icon: TrendingUp, title: 'Diversified Economy', text: 'One of the most diverse economies in the region - no single sector accounts for more than 30% of the Emirate’s GDP, a critical advantage for economic flexibility and strength.' },
          { icon: BadgeCheck, title: 'A-Rated for 15 Years', text: 'Rated in the ‘A’ range by Fitch and Standard & Poor’s international ratings agencies for 15 years.' },
          { icon: Users, title: 'Multicultural Society', text: 'A multicultural society of 0.4 million people (2023), with year-round sunshine and an affordable cost of living.' },
        ],
      },
    ],
  },

  /* ════════════════════════════ AIRPORT INFORMATION ════════════════════════════ */

  /* ----------------------- Operating Rules & Regulations ----------------------- */
  operations: {
    hero: {
      image: img.aviationHero,
      badge: 'Operations & Procedures',
      title: 'Operating Rules & Regulations',
      subtitle: 'Operational guidelines and infrastructure for a fully licensed UAE port of entry.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'The essentials',
        title: 'Operating',
        highlight: 'rules',
        columns: 3,
        items: [
          { icon: Clock, image: img.rakAirport, title: '24x7 Operations', text: 'RAK Airport and air traffic control operate 24x7, supporting continuous airport operations.' },
          { icon: ClipboardCheck, image: img.runway, title: 'Landing and Slot Permit', text: 'Landing and slot permits are required for applicable operations. Operators should arrange the required approval before arrival.' },
          { icon: FileText, image: img.flightHero, title: 'Flight Plans', text: 'All departing traffic must file a flight plan with the AIS / Met-Briefing Office before departure. Operational support is available 24x7.' },
        ],
      },
      {
        type: 'features',
        bg: 'mist',
        items: [
          { icon: Ruler, title: 'Runway & approach', text: 'A single runway 34/16 with Aerodrome Reference Code 4E. Runway 34 is equipped with an ILS Category I precision approach; runway 16 is a non-precision approach.', points: ['Length 3,760 m · Width 45 m', 'Asphalt surface', 'Handles aircraft up to Boeing 747 size'], image: img.runway },
          { icon: Plane, title: 'Air traffic & services', text: 'Air traffic control is managed by Global Aerospace Logistics, with procedural approach services and full ground handling for passenger, cargo and aircraft.', points: ['Jet A1 & Avtur fuel via bowser', 'Full passenger & cargo handling', 'Aerodrome Reference Code 4E'], image: '/Air-traffic-services.png' },
        ],
      },
      {
        type: 'cards',
        kicker: 'Safety first',
        title: 'Rescue and',
        highlight: 'Fire Fighting',
        columns: 3,
        items: [
          { icon: Flame, title: 'Category 9', text: 'Rescue and fire-fighting cover rated to Category 9, available 24 hours a day, with dedicated water-tanker support.' },
          { icon: Users, title: 'Firefighters', text: 'Trained firefighters operating four appliances.' },
          { icon: Stethoscope, title: 'Paramedic', text: 'Qualified paramedics provide first-response medical support during emergencies.' },
        ],
      },
    ],
  },

  /* --------------------- Landing Permissions & Procedures --------------------- */
  'landing-permissions': {
    hero: {
      image: img.flightHero,
      badge: 'Operations & Procedures',
      title: 'Landing Permissions & Procedures',
      subtitle: 'How aircraft operators request and obtain landing approval at RAK Airport.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Step by step',
        title: 'Request a',
        highlight: 'landing permit',
        subtitle: 'Submit requests to the Duty Officer via SITA, mail or fax with the details below.',
        columns: 3,
        items: [
          { icon: FileText, title: 'Operator & Aircraft', text: 'Operator name and nationality, aircraft type, registration and call sign, and crew information.', points: ['Flight schedule & ETA/ETD', 'Purpose of flight & receiving party'] },
          { icon: ShieldCheck, title: 'Compliance', text: 'Confirm TCAS/ACAS equipment, ban-free status for the UAE and the airport, and declare any arms, military cargo or photo equipment.', points: ['Payment method', 'No-ban verification'] },
          { icon: BadgeCheck, title: 'Approval', text: 'The Duty Officer forwards the request to RAK DCA. On approval, a Landing Permit Number is issued to the operator.' },
        ],
      },
      {
        type: 'features',
        bg: 'mist',
        items: [
          { icon: Shield, title: 'Insurance requirements', text: 'A minimum regulatory insurance requirement covers the liability of air carriers and aircraft operators for passengers, baggage, cargo and third parties - applicable to all civil aircraft operating in UAE territory.', points: ['Details on the GCAA website (www.gcaa.ae)', 'Required for all civil aircraft'], image: img.aviationHero },
        ],
      },
      {
        type: 'cards',
        kicker: 'Get in touch',
        title: 'Handling',
        highlight: 'contacts',
        columns: 3,
        items: [
          { icon: Mail, title: 'Email', text: 'handling@rakairport.com' },
          { icon: Phone, title: 'Telephone', text: '+971 7 207 5200' },
          { icon: Send, title: 'Duty Officer (mobile)', text: '+971 50 487 2704 · +971 7 207 5285 · +971 7 207 5275' },
        ],
      },
    ],
  },

  /* --------------------- Requirements of Crew - Immigration --------------------- */
  'crew-immigration': {
    hero: {
      image: img.airportCheckin,
      badge: 'Operations & Procedures',
      title: 'Requirements of Crew - Immigration',
      subtitle: 'Immigration procedures flight crews must follow when departing and arriving at RAK Airport.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Procedures',
        title: 'Departure &',
        highlight: 'arrival',
        columns: 2,
        items: [
          { icon: PlaneTakeoff, title: 'On Departure', text: 'All operating crew must be physically present. Crew submit their Identity Cards with flight details; Airport Ground Services prepares a General Declaration (GD), which is stamped and submitted to Immigration with the arrival GD.' },
          { icon: BadgeCheck, title: 'On Arrival', text: 'Flight crew present the arrival GD and Identity Cards to Immigration to obtain crew clearance.' },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Good to know',
        title: 'Important',
        highlight: 'notes',
        columns: 3,
        items: [
          { icon: FileCheck, title: 'No Alterations', text: 'No corrections, alterations or overwriting are allowed on the GD, which must show correct routing and dates.' },
          { icon: Stamp, title: 'Exit Stamps', text: 'Exit stamps from the origin station’s Immigration must appear on the GD. Military airport origins require an Operations Department stamp instead.' },
          { icon: ShieldCheck, title: 'Carry Valid ID', text: 'A valid company ID must be carried at all times. Crew complete immigration together unless prior notice is given for those staying back or arriving early.' },
        ],
      },
    ],
  },

  /* ----------------------------- Apron Driving License ----------------------------- */
  'apron-driving-license': {
    hero: {
      image: img.mroHangar,
      badge: 'Operations & Procedures',
      title: 'Airside Driving License',
      subtitle: 'Any vehicle operator in airside areas must hold a valid Airport Driving Permit (ADP) issued by the PRO.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'How to apply',
        title: 'ADP',
        highlight: 'requirements',
        subtitle: 'Submit the following to the Public Relations Office to obtain or renew an Airport Driving Permit.',
        columns: 3,
        items: [
          { icon: Camera, title: 'Photo & Licence', text: 'One passport-sized photograph and a copy of a valid UAE/GCC driving licence or police-issued airport driving licence.' },
          { icon: FileText, title: 'Forms', text: 'A completed ADP Application Form and a company letter stating the payment method.' },
          { icon: KeyRound, title: 'Renewals', text: 'For renewals, include a photocopy of the existing ADP. Renewing before expiry is the permit holder’s responsibility.' },
        ],
      },
      {
        type: 'features',
        bg: 'mist',
        items: [
          { icon: ShieldCheck, title: 'Rules for permit holders', text: 'Drivers must carry their current permit at all times in airside areas. Companies are responsible for ensuring staff hold valid public driving licences, and equipment-specific training must be certified to Apron Services in advance.', points: ['Carry your permit at all times airside', 'Return the ADP when no longer driving', 'Equipment training certified in advance'], image: '/Rules-for-permit-holders.png' },
        ],
      },
    ],
  },

  /* ------------------------------- RAK Airport PRO ------------------------------- */
  'airport-pro': {
    hero: {
      image: img.aboutHero,
      badge: 'Operations & Procedures',
      title: 'RAK Airport PRO',
      subtitle: 'The Public Relations Office - the central issuing point for airport access passes and permits.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Passes & permits',
        title: 'What the PRO',
        highlight: 'issues',
        columns: 4,
        items: [
          { icon: BadgeCheck, title: 'Entry Passes', text: 'Temporary and permanent entry passes for airport access.' },
          { icon: Users, title: 'Crew Passes', text: 'Require a General Declaration with entry stamp and a passport copy.' },
          { icon: Car, title: 'Vehicle Passes', text: 'Need vehicle registration, a UAE driving licence and driver documentation.' },
          { icon: Camera, title: 'Photography Permits', text: 'Require camera specifications and serial numbers.' },
          { icon: KeyRound, title: 'Airside Driving Permits', text: 'Issued for drivers operating in airside areas.' },
          { icon: ParkingCircle, title: 'Parking Passes', text: 'Airport parking access for authorised holders.' },
          { icon: Package, title: 'Gate Passes', text: 'For equipment and cargo movement through gates.' },
          { icon: FileText, title: 'Documentation', text: 'Company letters, passport/visa copies, Emirates ID and application forms - permanent passes require DCA, police and CID statements.' },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Get in touch',
        title: 'Contact &',
        highlight: 'hours',
        columns: 3,
        items: [
          { icon: Phone, title: 'Telephone', text: '+971 7 207 5273' },
          { icon: Mail, title: 'Email', text: 'pro@rakdca.gov.ae' },
          { icon: Clock, title: 'Opening Hours', text: 'Saturday 08:00–14:00 · Sunday–Thursday 08:00–23:00. Closed Fridays and public holidays.' },
        ],
      },
    ],
  },

  /* --------------------------------- Authorities --------------------------------- */
  authorities: {
    hero: {
      image: img.businessHero,
      badge: 'Operations & Procedures',
      title: 'Authorities',
      subtitle: 'The regulatory bodies overseeing operations and compliance at RAK Airport.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Regulators',
        title: 'Governing',
        highlight: 'authorities',
        columns: 2,
        items: [
          { icon: Landmark, image: '/RAK-Department-of-Civil-Aviation.png', title: 'RAK Department of Civil Aviation (DCA)', text: 'The regulatory authority for all civil air transport activities in the Emirate of Ras Al Khaimah, ensuring airport standards align with GCAA and other regulations.', points: ['www.rakdca.gov.ae', '+971 7 244 9111'] },
          { icon: Globe, image: '/General-Civil-Aviation-Authority.jpg', title: 'General Civil Aviation Authority (GCAA)', text: 'The sole authority for the control and regulation of civil aviation in the UAE, managing en-route air navigation services and flight safety oversight.', points: ['www.gcaa.gov.ae', '+971 4 211 1777'] },
        ],
      },
    ],
  },

  /* ----------------------------- Facilities & Services ----------------------------- */
  facilities: {
    hero: {
      image: img.facilitiesHero,
      badge: 'Airport Facilities',
      title: 'Facilities & Services',
      subtitle: 'A host of facilities and amenities are provided at Ras Al Khaimah International Airport to ensure a pleasant airport experience for each of our passengers.',
    },
    sections: [
      {
        type: 'cards',
        columns: 3,
        items: [
          { icon: Gift, image: '/RAK-Duty-Free-hero.jpg', title: 'Duty Free', text: 'Shop the world tax-free, open 24/7 in both the Departure and Arrival terminals.' },
          { icon: Gem, image: '/shamma-gold-jewellery.png', title: 'Jewellery', text: 'Shamma Gold & Diamonds offers fine gold, diamond and jewellery pieces at the terminal - perfect for a special gift or keepsake.' },
          { icon: Coffee, image: '/costa-coffee.jpg', title: 'Cafeterias', text: 'Coffee, quick bites and resto-bars before you fly.' },
          { icon: ShoppingBag, image: '/shops.jpg', title: 'Toy Shop', text: 'Toys, games and gifts for kids of all ages before you fly.' },
          { icon: Landmark, image: '/money-exchange.jpg', title: 'Money Exchange office', text: 'GCC Exchange offers currency exchange, remittance and bill payment services at the terminal.' },
          { icon: Luggage, image: '/baggage-wrapping.jpg', title: 'Baggage Wrapping Service', text: 'SpeedWings offers secure baggage wrapping at the terminal to protect your luggage before check-in.' },
        ],
      },
      {
        type: 'features',
        bg: 'mist',
        items: [
          { icon: Receipt, title: 'VAT Refund - Planet Tax Free', text: 'The UAE introduced a 5% Value Added Tax in 2018, but tourists can still enjoy tax-free shopping. Refunds apply to goods purchased during your stay that are exported when you leave. Planet Tax Free is the only operator of the Tourist Refund Scheme.', points: ['Validate at the Planet counters at Departures, before check-in', 'Scan your passport / GCC ID at the self-service kiosks', 'Export purchases within 90 days of the invoice date', 'Location: Departures, opposite the check-in counters', 'Planet: www.planetpayment.ae · +971 45 864 700'], image: '/VAT-Refund.jpeg' },
        ],
      },
      {
        type: 'cards',
        kicker: 'On-site',
        title: 'Passenger',
        highlight: 'services',
        columns: 3,
        items: [
          { icon: Luggage, title: 'Baggage Storage', text: 'A Lost and Found store is available at the airport.' },
          { icon: Accessibility, title: 'People with Difficulties', text: 'Wheelchairs, Ambu-lift and accessible toilets are available.' },
          { icon: MapPin, title: 'Baggage Support', text: 'For lost and found baggage assistance, please visit the Departure Terminal.' },
          { icon: Shield, title: 'Police Support', text: '24-hour airport police support is available at the airport.' },
          { icon: Cigarette, title: 'Smoking Areas', text: 'Smoking is not allowed inside the airport premises; special smoking rooms are allocated at both terminals.' },
          { icon: Landmark, title: 'Prayer Room', text: 'Prayer rooms are available in both the Arrival and Departure terminals, with a mosque near the Departure Parking.' },
        ],
      },
      {
        type: 'features',
        bg: 'mist',
        items: [
          { icon: Coffee, title: 'Business Lounge', text: 'A Business Lounge for Premiere class passengers is available, with a capacity to accommodate up to 30 passengers. It offers facilities such as a mosque, free Wi-Fi and TV.', points: ['For Premiere class passengers', 'Up to 30 passengers', 'Mosque, free Wi-Fi & TV'], image: '/Business_Lounge.jpg' },
          { icon: Stethoscope, title: 'Medical Services', text: 'A nurse is available on duty for any sick passengers, with ambulances and Ambu-lift available. In severe cases, nearby hospitals can be contacted via the emergency hotlines below.', points: ['SAQR Hospital: +971 7 2223666', 'RAK Hospital: +971 7 2225555', 'SAIF Hospital: +971 7 2223555', 'Al Zahrawi Hospital: +971 7 2288544'], image: '/medical-services.jpg' },
        ],
      },
      {
        type: 'cards',
        kicker: 'Stay connected',
        title: 'Wi-Fi &',
        highlight: 'connectivity',
        columns: 2,
        items: [
          { icon: Wifi, title: 'Free Wi-Fi Access', text: 'Both terminal buildings offer free Wi-Fi so visitors can stay connected to home or office. Devices need an 802.11 a/b/g-capable wireless network card.' },
          { icon: BriefcaseMedical, title: '4G Coverage', text: 'For mobile and smartphone users, 4G services from both Du and Etisalat are covered within the Arrival and Departure terminals.' },
        ],
      },
    ],
  },

  /* --------------------------------- Parking --------------------------------- */
  parking: {
    hero: {
      image: img.parkingHero,
      badge: 'Airport Facilities',
      title: 'Parking',
      subtitle: 'Convenient short and long-term parking for a smooth start to your journey.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Tariffs',
        title: 'Parking',
        highlight: 'options',
        subtitle: 'Smart long-term parking, steps from the terminal.',
        columns: 1,
        items: [
          { icon: ParkingCircle, image: '/Long-Term-Smart-Parking-v2.jpg', title: 'Long-Term - Smart Parking', text: 'Automated PARKONIC smart parking. Your licence plate is your ticket - no barriers, no waiting. Charges are applied to your SALIK account, or pay by QR code or the PARKONIC app.', points: ['Ticketless - plate is your ticket', 'Pay via SALIK, QR code or PARKONIC app'] },
        ],
      },
      {
        type: 'pricing',
        bg: 'mist',
        kicker: 'Long-term tariffs',
        title: 'Long-Term',
        highlight: 'parking rates',
        subtitle: 'PARKONIC smart parking · 24/7 · VAT inclusive.',
        ratesTitle: 'Long-Term Parking',
        rates: [
          { label: '1 to 5 days', value: 'AED 100' },
          { label: 'More than 5 up to 9 days', value: 'AED 200' },
          { label: 'From the 10th day onwards', value: 'AED 200 + AED 30 / extra day' },
        ],
        note: 'Charges apply 24 hours a day, 7 days a week, including public holidays, and are billed to your SALIK account by default. Prefer not to use SALIK? Pay before exiting via the QR code on the signage, or top up your PARKONIC app e-wallet. Support: 800-PARKONIC (72756642) · helpdesk@parkonic.com.',
      },
      {
        type: 'pricing',
        kicker: 'Short-term tariffs',
        title: 'Short-Term',
        highlight: 'parking rates',
        subtitle: 'Hourly parking tariffs and 24/7 membership rates at Ras Al Khaimah International Airport.',
        ratesTitle: 'Short-Term Parking',
        rates: [
          { label: 'First 10 minutes', value: 'Free', free: true },
          { label: 'Up to 30 minutes', value: 'AED 20' },
          { label: 'Up to 1 hour', value: 'AED 50' },
          { label: 'From 1 hour up to 5 hours (or part thereof)', value: 'AED 25 / hr' },
          { label: 'Beyond 5 hours (or part thereof)', value: 'AED 10 / hr' },
        ],
        membership: {
          title: 'Membership Rates',
          subtitle: '24/7 · VAT exclusive',
          rows: [
            { period: 'Monthly', price: 'AED 750' },
            { period: 'Quarterly', price: 'AED 2,200' },
            { period: 'Yearly', price: 'AED 8,500' },
          ],
          footnote: 'All membership rates are VAT exclusive.',
        },
        note: 'Short-term parking charges apply 24 hours a day, 7 days a week, including public holidays.',
      },
      {
        type: 'map',
        kicker: 'Find us',
        title: 'Parking',
        highlight: 'map',
        subtitle: 'Satellite view of the car park at Ras Al Khaimah International Airport.',
        query: '25.61766710852161,55.94288563843807',
        zoom: 18,
        satellite: true,
        label: 'Open in Maps',
      },
      {
        type: 'cta',
        title: 'Pay for parking online',
        text: 'For online payment, use the PARKONIC payment portal.',
        buttonLabel: 'Online Payment',
        to: 'https://www.parkonic.com/payment',
      },
      { type: 'cta', title: 'Driving to the airport?', text: 'A mosque sits beside the departure parking. Long-term parking now uses the PARKONIC smart-parking system - check the rates above before you travel.', buttonLabel: 'View Location Map', to: '/map' },
    ],
  },

  /* ------------------------------- Cargo Facilities ------------------------------- */
  cargo: {
    hero: {
      image: img.cargo,
      badge: 'Airport Facilities',
      title: 'Cargo Facilities',
      subtitle: 'A comprehensive freight centre for import, export, trucking and temperature-controlled storage.',
    },
    sections: [
      {
        type: 'features',
        items: [
          { icon: Boxes, title: 'A full-range freight centre', text: 'The freight centre provides a full range of services - import and export of cargo, customs clearance, free parking spaces for large trailers and cold storage. It also accepts Live Animal Cargo, Valuable Cargo and Dangerous Goods shipments.', points: ['Cargo Capacity 200 sq.mt', 'Chiller Available', 'IPTA and customs-bonded facility availability', 'Free parking spaces for large trailers', 'Live animal, valuable & dangerous goods accepted'], image: '/full-range-freight-centre.jpg' },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Integrated air & land network',
        title: 'Trusted',
        highlight: 'carriers',
        columns: 3,
        items: [
          { icon: Plane, title: 'Etihad', text: 'Cargo carrier serving RAK Airport.' },
          { icon: Truck, title: 'FlyVaayu', text: 'Cargo carrier serving RAK Airport.' },
          { icon: Boxes, title: 'SolitAir', text: 'Cargo carrier serving RAK Airport.' },
          { icon: PlaneTakeoff, title: 'Skyvision', text: 'Cargo carrier serving RAK Airport.' },
          { icon: Package, title: 'Air Master', text: 'Cargo carrier serving RAK Airport.' },
          { icon: Snowflake, title: 'Pradan Air', text: 'Cargo carrier serving RAK Airport.' },
        ],
      },
      {
        type: 'intro',
        kicker: 'Information',
        title: 'Meticulous',
        highlight: 'cargo care',
        image: '/Meticulous-cargo-care.jpg',
        paragraphs: [
          'Ras Al Khaimah International Airport is well known for elaborate and meticulous care in all its air cargo-related dealings.',
          'In this undertaking, the airport follows strict procedures of import and export to maximise speed and efficiency, and to minimise risks and inconvenience.',
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Exporting freight',
        title: 'Export',
        highlight: 'procedure',
        columns: 2,
        items: [
          { icon: Send, title: 'Steps for shippers', text: 'To export freight out of RAK International Airport, the shipper should:', points: ['Obtain an export code from RAK Customs office', 'Fill in the Shipper’s Letter of Instruction (provided by the export office)', 'Complete customs formalities - via an authorised clearing agent', 'Provide a copy of the invoice to prove the value to customs', 'The air waybill is held by the handling agent'] },
          { icon: FileText, title: 'Other requirements', text: 'Documents vary by cargo type:', points: ['General Cargo: invoice & packing list', 'Live Animal Cargo: import permit from MOCCAE', 'Perishable Cargo: Ministry of Agriculture certificate', 'Valuable Cargo: invoice & insurance policy', 'Unaccompanied Baggage: passport copy & declaration of value', 'Human Remains: death & embalming certificates, police & consulate clearance, cancelled passport, ticket details'] },
        ],
      },
      {
        type: 'cards',
        kicker: 'Importing freight',
        title: 'Import',
        highlight: 'procedure',
        columns: 2,
        items: [
          { icon: Package, title: 'Clearing imports', text: 'To clear an import freight at RAK International Airport:', points: ['Clear the shipment through an authorised agent', 'Obtain an Importer Code & Customs Clearance ID Card from RAK Customs Main Office'] },
          { icon: ClipboardCheck, title: 'Required documents', text: 'The Customs Department requires:', points: ['General Cargo: original invoice, packing list & certificate of origin', 'Live Animal Cargo: import permit from MOCCAE', 'Perishable Cargo: health certificate, certificate of origin, original invoice & packing list'] },
        ],
      },
      {
        type: 'links',
        bg: 'mist',
        kicker: 'Special documentation required',
        title: 'Restricted',
        highlight: 'cargo',
        centered: true,
        items: [
          { label: 'Arms & Ammunition', icon: Ban },
          { label: 'Radioactive Materials', icon: ShieldCheck },
        ],
      },
      { type: 'cta', title: 'Ship with RAK Airport', text: 'For more information on the cargo services provided by the airport, call +971 50 627 1310 or email cargo@rakairport.com or rak.cargo@rakairport.com.', buttonLabel: 'Contact Cargo', to: '/contact' },
    ],
  },

  /* ----------------------------- VIP Handling Services ----------------------------- */
  'vip-handling': {
    hero: {
      image: img.loungeInterior,
      badge: 'Airport Facilities',
      title: 'VIP Handling Services',
      subtitle: 'Unmatched VIP handling for a seamless, private airport experience.',
    },
    sections: [
      {
        type: 'features',
        items: [
          { icon: Star, title: 'Travel in comfort and privacy', text: 'Ras Al Khaimah International Airport provides unmatched VIP handling services - a dedicated, discreet experience from arrival to departure for distinguished guests and private travellers.', points: ['Dedicated VIP terminal & lounge', 'Discreet, personalised assistance', 'Fast, seamless processing'], image: img.hotelsHero },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Get in touch',
        title: 'VIP',
        highlight: 'contacts',
        columns: 1,
        items: [
          {
            icon: Phone,
            image: '/VIP-Handling-Contacts.png',
            imageAuto: true,
            title: 'VIP Handling Contacts',
            text: 'Reach our VIP handling team on any of the numbers below, or email viphandling@rakairport.com.',
            pointsCols: 2,
            points: [
              '+971 50 487 2704',
              '+971 7 207 5285',
              '+971 7 207 5275',
              '+971 7 207 5262',
            ],
          },
        ],
      },
    ],
  },

  /* ----------------------------- Public Transport ----------------------------- */
  'public-transport': {
    hero: {
      image: img.airportTransport,
      badge: 'Getting There',
      title: 'Public Transport',
      subtitle: 'Buses, the free shuttle and onward connections across Ras Al Khaimah and the UAE.',
    },
    sections: [
      {
        type: 'intro',
        kicker: 'About RAKTA',
        title: 'RAK Transport',
        highlight: 'Authority',
        image: '/rakta-bus-taxi.jpg',
        paragraphs: [
          'RAK Transport Authority connects the airport with the wider emirate, running the routes and fares that get you from the terminal to the city and back.',
          'Choose the option that suits your journey below.',
        ],
        links: [
          { label: 'Bus', url: 'https://www.rakta.gov.ae/public-transport/', icon: Bus },
          { label: 'Taxi', url: 'https://www.rakta.gov.ae/taxi-service/', icon: Car },
        ],
      },
      {
        type: 'cards',
        kicker: 'Ways to travel',
        title: 'Get around the',
        highlight: 'UAE',
        columns: 3,
        items: [
          { icon: Bus, title: 'Free Airport Shuttle', text: 'Complimentary transfers to Dubai, Sharjah, Ajman and Umm Al Quwain.' },
          { icon: Navigation, title: 'RAKTA Network', text: 'Ras Al Khaimah Transport Authority bus services - www.rakta.gov.ae.' },
          { icon: Bike, title: 'Taxis & Last-Mile', text: 'Metered taxis available 24/7 from the Arrivals hall.' },
        ],
      },
      { type: 'cta', title: 'Plan your onward journey', text: 'See the free airport bus service for routes, stops and schedules.', buttonLabel: 'Airport Free Bus Service', to: '/bus-service' },
    ],
  },

  /* --------------------------- Airport Free Bus Service --------------------------- */
  'bus-service': {
    hero: {
      image: img.shuttleHero,
      badge: 'Dedicated Shuttle Service',
      title: 'Airport Free Bus Service',
      subtitle: 'Complimentary transfers connecting the airport to key locations across four emirates.',
    },
    sections: [
      {
        type: 'features',
        items: [
          { icon: Bus, title: 'Travel comfortably, for free', text: 'A complimentary shuttle bus connects Ras Al Khaimah International Airport to major locations across the UAE - seamless, comfortable transit for passengers, with schedules aligned to flight times.', points: ['No cost to passengers', 'Air-conditioned coaches', 'Schedules aligned with flights'], image: img.cityBus },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Routes & stops',
        title: 'Where the shuttle',
        highlight: 'goes',
        subtitle: 'Six stops across four emirates.',
        columns: 4,
        items: [
          { icon: MapPin, image: c('Dubai skyline 2015.jpg', 800), title: 'Dubai', text: 'Three stops: Deira, Al Quoz and Muhaisnah.' },
          { icon: MapPin, image: c('Sharjah Corniche.jpg', 800), title: 'Sharjah', text: 'Muwaileh Bus Stand.' },
          { icon: MapPin, image: c('Ajman.jpg', 800), title: 'Ajman', text: 'Opposite Lucky Center.' },
          { icon: MapPin, image: c('Umm Al Quwain Fort.jpg', 800), title: 'Umm Al Quwain', text: 'Mall of UAQ.' },
        ],
      },
      {
        id: 'schedule-guide',
        type: 'image',
        bg: 'white',
        kicker: 'Schedule & routes',
        title: 'Shuttle Bus',
        highlight: 'Schedule Guide',
        subtitle: 'Passenger pick-up locations, departure timings, and return drop points across the UAE.',
        image: '/assets/aistudio/RAK_Shuttle_Bus.png',
        alt: 'Ras Al Khaimah Airport Free Shuttle Bus Service Guide & Schedule',
        caption: 'Free shuttle bus service is arranged for passengers holding valid flight tickets from/to RAK Airport. For assistance, call 800 1700.',
      },
      { type: 'cta', title: 'Explore RAK with Public Transport', buttonLabel: 'Public Transport', to: '/public-transport' },
    ],
  },

  /* ════════════════════════════ BUSINESS OPPORTUNITIES ════════════════════════════ */

  /* ----------------------------- Business Opportunities ----------------------------- */
  business: {
    hero: {
      image: img.businessHero,
      badge: 'Business Opportunities',
      title: 'Business Opportunities',
      subtitle: 'A commercially viable, competitive and market-led environment for our partners.',
    },
    sections: [
      {
        type: 'intro',
        kicker: 'Why partner with us',
        title: 'Flexible, competitive',
        highlight: '& market-led',
        image: '/Flexible-competitive-market-led.jpg',
        paragraphs: [
          'We aim to develop an environment that is commercially viable, creates a competitive proposition and is market-led - working flexibly with our partners on mutually beneficial arrangements.',
          'The airport offers competitive pricing on landing, parking, ground handling and fuel, backed by continuous investment in infrastructure.',
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Opportunities',
        title: 'Ways to grow with',
        highlight: 'RAK Airport',
        columns: 3,
        items: [
          { icon: Plane, image: img.runway, title: 'Passenger Operations', text: '1 million annual terminal capacity, 24-hour service, outstanding care and duty-free shopping for untapped airline markets.' },
          { icon: Boxes, image: img.cargo, title: 'Cargo Operations', text: 'State-of-the-art facilities including 3,000 m² of cargo terminals, bonded feeder services and perishable handling.' },
          { icon: Star, image: img.corporate, title: 'Corporate Aviation', text: 'Executive jet services, FBO facilities and VIP terminal options for private operators.' },
          { icon: Warehouse, image: img.opsWarehouse, title: 'Maintenance & MRO', text: 'Over 1 million m² with free-zone status for maintenance, training and aviation-related industry.' },
          { icon: Megaphone, image: '/Advertising-At-RAK-Airport-hero.jpg', title: 'Advertising', text: 'Indoor and outdoor media reaching a high-value, captive audience.' },
          { icon: Store, image: img.opsOffice, title: 'Retail & Office Space', text: 'Prime retail units and competitively priced office space, airside and landside.' },
        ],
      },
      { type: 'cta', title: 'Become a RAK Airport partner', text: 'Talk to our commercial team about a tailored opportunity. Email marketing@rakairport.com.', buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* ------------------------------ Advertising ------------------------------ */
  advertising: {
    hero: {
      image: img.advertHero,
      badge: 'Business Opportunities',
      title: 'Advertising At RAK Airport',
      subtitle: 'The ideal venue to reach leisure and business travellers - plus staff from hundreds of on-site companies.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Media opportunities',
        title: 'Advertising',
        highlight: 'formats',
        columns: 2,
        narrow: true,
        items: [
          { icon: Monitor, title: 'Indoor Advertising', text: 'Light boxes and tri-vision boxes, digital screens and LCD video walls in baggage claim, banners, door/window decals, wall wraps, leaflet displays and branded trolleys.' },
          { icon: Flag, title: 'Outdoor Advertising', text: 'Large-format banners, flags on lamp posts, car park and security-railing branding, outdoor tri-vision billboards, mesh one-way vision on terminal glass, boarding-pass backings and promotional stands.' },
        ],
      },
      { type: 'cta', title: 'Advertise with RAK Airport', text: 'Reach millions of travellers a year. Email marketing@rakairport.com for a tailored media package.', buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* ------------------------------- Retail Space ------------------------------- */
  'retail-space': {
    hero: {
      image: img.shopHero,
      badge: 'Business Opportunities',
      title: 'Retail Space',
      subtitle: 'Prime retail spaces available for long or short-term lease across the terminals.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Leasing',
        title: 'Retail',
        highlight: 'options',
        subtitle: 'Following the new Arrival Terminal and Departures renovations, a number of prime spaces are available.',
        columns: 3,
        items: [
          { icon: Store, image: u('1604719312566-8912e9227c6a', 800), title: 'Shop Units', text: 'Pre-existing storefronts in high-footfall arrival and departure zones.' },
          { icon: LayoutGrid, image: u('1497366811353-6870744d04b2', 800), title: 'Kiosk Spaces', text: 'Flexible kiosk locations for compact retail and activations.' },
          { icon: Sparkles, image: u('1466978913421-dad2ebd01d17', 800), title: 'Custom Build', text: 'Sites ready for bespoke retail development, long or short term.' },
        ],
      },
      { type: 'cta', title: 'Lease a retail space', text: ['Contact our Marketing department', 'marketing@rakairport.com', '+971 7 207 5200'], buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* ------------------------------- Office Space ------------------------------- */
  'office-space': {
    hero: {
      image: img.spacesHero,
      badge: 'Business Opportunities',
      title: 'Office Space',
      subtitle: 'Competitively priced offices, airside and landside, within the airport business community.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Why lease here',
        title: 'Offices for every',
        highlight: 'business',
        columns: 3,
        items: [
          { icon: Building2, image: img.opsOffice, title: 'Airside & Landside', text: 'Offices available in both airside and landside locations to suit your operation.' },
          { icon: TrendingUp, image: img.businessHero, title: 'Competitive Rates', text: 'Very competitive lease rates for established firms and start-ups alike.' },
          { icon: FileCheck, image: img.opsDocs, title: 'Licensing Support', text: 'New enterprises can obtain activity licences through RAK DCA (www.rakdca.gov.ae).' },
        ],
      },
      { type: 'cta', title: 'Set up at RAK Airport', text: 'For availability and pricing, contact marketing@rakairport.com.', buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* ----------------------------- Corporate Aviation ----------------------------- */
  'corporate-aviation': {
    hero: {
      image: img.corporate,
      badge: 'Business Opportunities',
      title: 'Corporate Aviation',
      subtitle: 'An ideal location for corporate and executive aviation, with a dedicated precinct.',
    },
    sections: [
      {
        type: 'features',
        items: [
          { icon: Star, title: 'A dedicated corporate precinct', text: 'Ras Al Khaimah International Airport is an ideal location for corporate aviation, with excellent service providers and a newly developed precinct built for the executive market.', points: ['Over 500,000 m² with Code C taxiway access', 'Serviced by operators including Dana Executive Jets', 'Flexible, mutually beneficial partnerships'], image: img.corporate },
        ],
      },
      { type: 'cta', title: 'Base your operation here', text: 'Contact the Marketing department on +971 7 207 5205.', buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* -------------------------- Passenger Airline Operations -------------------------- */
  'passenger-operations': {
    hero: {
      image: img.passengerOps,
      badge: 'Business Opportunities',
      title: 'Passenger Airline Operations',
      subtitle: 'An emerging-market hub for start-up and established airlines seeking a competitive edge.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Why fly from RAK',
        title: 'Operational',
        highlight: 'advantages',
        columns: 3,
        items: [
          { icon: TrendingUp, title: 'Competitive Pricing', text: 'Competitive pricing that benefits operators’ financial performance, with immediate access to a dynamic tourism destination.' },
          { icon: Clock, title: 'Fast Turnarounds', text: 'Efficient ground handling with no congestion or slot constraints - quick turnarounds and personal service.' },
          { icon: Navigation, title: 'Strong Connections', text: 'Road access to the northern emirates within 30 minutes and Dubai in around 45 minutes.' },
        ],
      },
      {
        type: 'features',
        bg: 'mist',
        items: [
          { icon: Plane, title: 'A growing catchment', text: 'The four Northern Emirates generated 782,426 annual passengers (year ended June 2010), with Ras Al Khaimah holding over 44% market share and leading regional growth. Multiple promising international routes offer favourable passenger loads and revenue.', points: ['Excellent terminal & apron capacity', 'No slot constraints', 'Promising international route potential'], image: img.runway },
        ],
      },
      { type: 'cta', title: 'Launch a route from RAK', text: 'Contact the Marketing department on +971 7 207 5205.', buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* ---------------------------- Maintenance Facilities ---------------------------- */
  'maintenance-facilities': {
    hero: {
      image: img.mro,
      badge: 'Business Opportunities',
      title: 'Maintenance Facilities',
      subtitle: 'Over 1 million m² of land adjacent to aeronautical infrastructure - perfect for MRO development.',
    },
    sections: [
      {
        type: 'features',
        items: [
          { icon: Warehouse, title: 'Room to build', text: 'Ras Al Khaimah International Airport has over 1 million m² of land adjacent to its aeronautical infrastructure, perfect for the development of maintenance facilities and related ventures.', points: ['Accommodates aircraft of all sizes', 'Suitable for MRO and similar ventures', 'Flexible, commercially viable arrangements'], image: '/Room-to-build.jpg' },
        ],
      },
      { type: 'cta', title: 'Develop an MRO here', text: 'Contact the Marketing department - marketing@rakairport.com · +971 7 207 5205.', buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* ---------------------------- Operators in RAK Airport ---------------------------- */
  operators: {
    hero: {
      image: img.runway,
      badge: 'Business Opportunities',
      title: 'Operators in RAK Airport',
      subtitle: 'Diverse aviation operations across passenger, charter, corporate and freight segments.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Who operates here',
        title: 'Airline',
        highlight: 'Partners',
        columns: 2,
        items: [
          { icon: Plane, image: img.runway, title: 'Scheduled Commercial Airlines', text: 'Air Arabia, Air India Express and IndiGo Airlines.' },
          { icon: Star, image: img.corporate, title: 'Aviation Training Airlines', text: 'Emirates, Etihad Airways, flydubai, Fujairah Aviation Academy and Air Arabia.' },
          { icon: PlaneTakeoff, image: img.flightHero, title: 'Charter Airlines', text: 'Ural Air, Enter Air, Smartwings, HiSky and SkyWings.' },
          { icon: Boxes, image: img.cargo, title: 'Cargo Airlines', text: 'Fly Vaaya, Solit Air and Sky Vision.' },
        ],
      },
    ],
  },

  /* ════════════════════════════════ DUTY FREE ════════════════════════════════ */

  /* -------------------------------- RAK Duty Free -------------------------------- */
  'duty-free': {
    hero: {
      image: img.dutyHero,
      badge: 'Airport Duty Free',
      title: 'RAK Duty Free',
      subtitle: 'Shop the world tax-free - open 24/7 in both the Departure and Arrival terminals.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Categories',
        title: 'Shop',
        highlight: 'tax-free',
        subtitle: 'An international range at competitive prices for incoming, outgoing and transit passengers.',
        columns: 4,
        items: [
          { icon: Sparkles, image: u('1541643600914-78b084683601', 800), title: 'Perfumes & Cosmetics', text: 'Signature fragrances, beauty, toiletries and cosmetics.' },
          { icon: Watch, image: u('1523275335684-37898b6baf30', 800), title: 'Watches & Sunglasses', text: 'Timepieces, sunglasses and fashion accessories.' },
          { icon: Plug, image: u('1498049794561-7780e7231661', 800), title: 'Electronics & Gifts', text: 'Gadgets, souvenirs, confectionery and gift items.' },
          { icon: Wine, image: u('1510812431401-41d2bd2722f3', 800), title: 'Liquor & Tobacco', text: 'Fine spirits, wines, cigarettes and tobacco.' },
        ],
      },
    ],
  },

  /* -------------------------------- Cafés & Bars -------------------------------- */
  'cafes-bars': {
    hero: {
      image: '/cafes_shops_hero.jpg',
      badge: 'Airport Duty Free',
      title: 'Cafés & Bars',
      subtitle: 'Relax, recharge and refuel before your flight - from freshly brewed coffee to laid-back resto-bars across the terminals.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Eat, sip & relax',
        title: 'Where to',
        highlight: 'unwind',
        columns: 2,
        narrow: true,
        items: [
          { icon: Coffee, image: '/costa-coffee.jpg', title: 'Costa Coffee', text: 'Freshly brewed coffee, signature blends, teas, pastries and quick bites - served through the day.' },
          { icon: Wine, image: '/restobar.jpg', title: 'Resto Bars', text: 'Laid-back resto-bars serving hearty food, refreshments and a relaxed atmosphere before departure.' },
        ],
      },
      { type: 'cta', title: 'Savour the moment', text: 'Find cafés and resto-bars in both the Departure and Arrival terminals.', buttonLabel: 'RAK Duty Free', to: '/duty-free' },
    ],
  },

  /* --------------------------------- Wi-Fi & Internet --------------------------------- */
  'wifi': {
    hero: {
      image: '/free-wifi-internet-hero.png',
      badge: 'At RAK',
      title: 'Free Wi-Fi & Internet',
      subtitle: 'Stay connected across Ras Al Khaimah International Airport with free wireless internet.',
    },
    sections: [
      {
        type: 'intro',
        kicker: 'Stay connected',
        title: 'Free Wi-Fi &',
        highlight: 'Internet Connection',
        subtitle: 'Complimentary wireless internet throughout the airport.',
        image: '/Free-Wi-Fi.png',
        paragraphs: [
          'Enjoy free Wi-Fi in both the public and transit areas of Ras Al Khaimah International Airport.',
          { highlight: true, text: 'Wi-Fi Name: RAK International Airport' },
          'With complimentary Wi-Fi at the airport, it’s easy to stay connected - catch up on email, plan your onward journey or stream while you wait for your flight.',
        ],
      },
      {
        type: 'cards',
        kicker: 'RAK International Airport',
        title: 'How to',
        highlight: 'connect',
        columns: 3,
        items: [
          { icon: Wifi, title: '1. Select the network', text: 'Open your device’s Wi-Fi settings and select RAK International Airport.' },
          { icon: Globe, title: '2. Open your browser', text: 'Launch your internet browser (Safari, Chrome, Firefox or Edge) and enter any valid website address to open the login page.' },
          { icon: BadgeCheck, title: '3. Connect & surf', text: 'Click the Wi-Fi logo and enjoy free internet access across the airport.' },
        ],
      },
    ],
  },

  /* ════════════════════════════ VISITOR INFORMATION ════════════════════════════ */

  /* ----------------------------- Luggage & Check-In ----------------------------- */
  'luggage-checkin': {
    hero: {
      image: img.baggageHero,
      badge: 'Visitor Information',
      title: 'Luggage & Check-In',
      subtitle: 'Know what you can carry so you can pack smart and breeze through security.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Pack smart',
        title: 'Baggage',
        highlight: 'guidelines',
        columns: 3,
        items: [
          { icon: Luggage, title: 'Liquids in cabin bags', text: 'Place liquids, aerosols and gels in one transparent, resealable bag. Individual containers must be 100 ml or less, with a total capacity of no more than one litre.', points: ['Medication and baby food may be exempt', 'Keep the bag easy to remove at security'] },
          { icon: Boxes, title: 'Checked Baggage', text: 'Baggage allowances and restrictions vary by airline and destination. Passengers are advised to check with their airline before travelling to confirm baggage allowance, fees, and restrictions.', points: ['Check excess-baggage fees with your airline', 'Allow extra time for oversized bags'] },
          { icon: ShieldCheck, title: 'Electronics & batteries', text: 'Keep laptops, tablets and power banks in your hand luggage, where they are easy to reach. At security, place larger electronics in a separate tray.', points: ['Power banks belong in cabin baggage', 'Do not pack restricted batteries in checked bags'] },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Before check-in',
        title: 'Prepare your',
        highlight: 'bag',
        subtitle: 'A well-prepared bag helps it move safely through the baggage system.',
        columns: 4,
        items: [
          { icon: ClipboardCheck, title: 'Remove old tags', text: 'Take off labels and tags from previous trips so baggage scanners can read the current journey correctly.' },
          { icon: Link2, title: 'Secure loose straps', text: 'Fasten or tuck away straps and handles so they do not catch in the baggage-handling system.' },
          { icon: Luggage, title: 'Prepare backpacks', text: 'Zip backpacks securely and tuck in every strap before check-in to keep them compact and protected.' },
          { icon: Package, title: 'Choose the right shape', text: 'Avoid overfilled or irregularly shaped bags. Structured baggage with at least one flat surface is easier to process.' },
        ],
      },
      {
        type: 'features',
        items: [
          {
            icon: ShieldCheck,
            title: 'Baggage rules to remember',
            text: 'Oversized baggage, including bags longer than 90 cm, higher than 75 cm or wider than 60 cm, should be checked at your airline counter and then taken to the oversized-baggage counter. Security may inspect checked bags and remove prohibited or suspicious items when required.',
            points: [
              'Keep e-cigarettes, fuel cells and motorised devices out of checked baggage',
              'Strong, good-quality cardboard boxes can be accepted as checked baggage',
              'Travel insurance is recommended for extra peace of mind',
            ],
            image: '/security-screening.jpg',
          },
        ],
      },
      {
        type: 'cards',
        kicker: 'At the terminal',
        title: 'Baggage',
        highlight: 'services',
        columns: 1,
        narrow: true,
        items: [
          { icon: Boxes, image: '/baggage-wrapping.jpg', title: 'Baggage wrapping', text: 'Secure wrapping is available in the check-in area. Weigh your bags before wrapping to help avoid unnecessary delays.' },
        ],
      },
    ],
  },

  /* ════════════════════════════ EXPERIENCE AT RAK ════════════════════════════ */

  /* -------------------------------- Things to Do -------------------------------- */
  'things-to-do': {
    hero: {
      image: '/things-to-do-hero.jpg',
      badge: 'Experience at RAK',
      title: 'Things to Do',
      subtitle: 'From the UAE’s highest peak to golden beaches and living heritage. Discover the very best of Ras Al Khaimah, all within easy reach of the airport.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Top picks',
        title: 'Must-see',
        highlight: 'experiences',
        columns: 2,
        items: [
          { icon: Mountain, image: '/jebel-jais.jpg', title: 'Jebel Jais', text: 'The UAE’s highest peak with record-breaking adventures.' },
          { icon: Wind, image: '/Jais-Flight-Zipline.png', title: 'Jais Flight Zipline', text: 'The world’s longest zipline on Jebel Jais.' },
        ],
      },
    ],
  },

  /* ---------------------------- Adventure & Mountains ---------------------------- */
  'adventure-mountains': {
    hero: {
      image: '/Adventure-Mountains-hero.png',
      badge: 'Experience at RAK',
      title: 'Adventure & Mountains',
      subtitle: 'Jebel Jais is the heart of adventure in the UAE. Zip, hike, bike and climb across the dramatic peaks of the Hajar Mountains.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Get the adrenaline going',
        title: 'Mountain',
        highlight: 'thrills',
        columns: 4,
        items: [
          { icon: Snowflake, image: '/Jais-Sledder.jpg', title: 'Jais Sledder', text: 'The region’s longest mountain toboggan ride.' },
          { icon: Compass, image: '/skytour.jpg', title: 'Jais Sky Tour', text: 'Guided via ferrata across the cliff faces.' },
          { icon: Footprints, image: '/Hiking-Trails.png', title: 'Hiking Trails', text: 'Marked mountain trails for every level.' },
          { icon: Bike, image: img.expMtb, title: 'Mountain Biking', text: 'Rugged trails through the Hajar range.' },
          { icon: Tent, image: img.expCamping, title: 'Camping Spots', text: 'Camp under the stars at altitude.' },
        ],
      },
    ],
  },

  /* ----------------------------- Beaches & Islands ----------------------------- */
  'beaches-islands': {
    hero: {
      image: img.expIsland,
      badge: 'Experience at RAK',
      title: 'Beaches & Islands',
      subtitle: 'Miles of golden coastline, calm turquoise waters and island escapes. Ras Al Khaimah is the perfect place to relax by the sea.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Sun, sand & sea',
        title: 'Coastal',
        highlight: 'escapes',
        columns: 4,
        items: [
          { icon: Waves, image: '/GKGUPS-al-marjan-island.png', title: 'Al Marjan Island', text: 'Four coral-shaped islands of resorts and beaches.' },
          { icon: Bird, image: img.expFlamingo, title: 'Flamingo Beach', text: 'Calm shores and birdlife around Al Rams.' },
          { icon: Waves, image: img.expBeach, title: 'Al Hamra Beach', text: 'Golden sands by the marina and golf course.' },
          { icon: Trees, image: img.expMangrove, title: 'Mina Al Arab', text: 'Mangrove-fringed beaches and wetlands.' },
          { icon: Umbrella, image: img.expBeach, title: 'Public Beaches', text: 'Free, family-friendly stretches of coast.' },
          { icon: Star, image: img.expBeachResort, title: 'Private Beach Resorts', text: 'Five-star waterfront escapes.' },
          { icon: Sparkles, image: img.expPool, title: 'Beach Clubs', text: 'Pools, loungers and sea views.' },
          { icon: Waves, image: img.expJetski, title: 'Water Sports', text: 'Jet ski, kayak, paddleboard and dive.' },
        ],
      },
    ],
  },

  /* ----------------------------- Culture & Heritage ----------------------------- */
  'culture-heritage': {
    hero: {
      image: img.rakFort,
      badge: 'Experience at RAK',
      title: 'Culture & Heritage',
      subtitle: 'Thousands of years of history await. Explore forts, museums, pearling villages and traditional souks across the emirate.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Step back in time',
        title: 'Living',
        highlight: 'heritage',
        columns: 3,
        items: [
          { icon: Building2, image: '/NATIONAL-MUSEUM-OF-RAK.jpg', title: 'National Museum of RAK', text: 'Housed in a historic fort, telling the emirate’s story.' },
          { icon: Landmark, image: img.rakFort, title: 'Dhayah Fort', text: 'RAK’s iconic 18th-century hilltop fort.' },
          { icon: Home, image: '/jazeerah-al-hamra.jpg', title: 'Al Jazeera Al Hamra', text: 'The Gulf’s best-preserved pearling village.' },
          { icon: Gem, image: '/Al-Suwaidi-Pearl-Farm.jpg', title: 'Suwaidi Pearls', text: 'A traditional pearl farming experience.' },
          { icon: Store, image: img.expSouk, title: 'Traditional Souks', text: 'Spices, gold and local handicrafts.' },
          { icon: Home, image: img.expHeritage, title: 'Heritage Villages', text: 'Step into old Emirati life and customs.' },
        ],
      },
    ],
  },

  /* ----------------------------- Desert Experiences ----------------------------- */
  'desert-experiences': {
    hero: {
      image: '/Desert-Experiences-hero.jpg',
      badge: 'Experience at RAK',
      title: 'Desert Experiences',
      subtitle: 'Golden dunes stretch to the horizon. Ride, drive and dine in the desert, then sleep beneath a blanket of stars.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Into the dunes',
        title: 'Desert',
        highlight: 'adventures',
        columns: 4,
        items: [
          { icon: Tent, image: '/desert_safari_in_rak.jpg', title: 'Desert Safari', text: 'Half- and full-day desert adventures.' },
          { icon: Car, image: img.expOffroad, title: 'Dune Bashing', text: 'Thrilling 4x4 rides over the dunes.' },
          { icon: Footprints, image: img.expCamel, title: 'Camel Riding', text: 'Traditional rides across the sands.' },
          { icon: Bike, image: img.expQuad, title: 'Quad Biking', text: 'Self-drive quads on desert tracks.' },
          { icon: Wind, image: '/Sandboarding.jpg', title: 'Sandboarding', text: 'Surf the dunes on a board.' },
          { icon: Flame, image: img.expBedouin, title: 'Bedouin Camp', text: 'Dinner, shisha and live entertainment.' },
          { icon: Sparkles, image: img.expStars, title: 'Stargazing', text: 'Clear desert skies far from the city lights.' },
        ],
      },
    ],
  },

  /* ------------------------------ Family Activities ------------------------------ */
  'family-activities': {
    hero: {
      image: '/Family-Activities-hero.jpg',
      badge: 'Experience at RAK',
      title: 'Family Activities',
      subtitle: 'Ras Al Khaimah is made for families. Beaches, nature, animal encounters and entertainment to keep everyone happy.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Fun for all ages',
        title: 'Family',
        highlight: 'favourites',
        columns: 4,
        items: [
          { icon: Waves, image: img.expBeach, title: 'Beaches', text: 'Safe, shallow shores for kids.' },
          { icon: Trees, image: img.expNature, title: 'Nature Parks', text: 'Mangroves, wildlife and easy walks.' },
          { icon: Bird, image: img.expWildlife, title: 'Animal Experiences', text: 'Meet wildlife up close.' },
          { icon: Sparkles, image: img.expIndoor, title: 'Indoor Entertainment', text: 'Arcades, play zones and malls.' },
          { icon: Star, image: '/family-resort.jpg', title: 'Family Resorts', text: 'Kids’ clubs and family pools.' },
        ],
      },
    ],
  },

  /* ------------------------------ Dining & Nightlife ------------------------------ */
  'dining-nightlife': {
    hero: {
      image: img.expFineDining,
      badge: 'Experience at RAK',
      title: 'Dining & Nightlife',
      subtitle: 'From authentic Emirati flavours to beachfront tables and rooftop lounges, Ras Al Khaimah serves up something for every taste.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Eat, drink & unwind',
        title: 'Where to',
        highlight: 'dine',
        columns: 3,
        items: [
          { icon: Utensils, image: img.expFineDining, title: 'Fine Dining Restaurants', text: 'Award-winning chefs and cuisine.' },
          { icon: Utensils, image: img.expArabicFood, title: 'Emirati Restaurants', text: 'Authentic local flavours and dishes.' },
          { icon: Waves, image: img.expBeachRest, title: 'Beachfront Restaurants', text: 'Dine with the sea at your side.' },
          { icon: Coffee, image: img.expCafe, title: 'Cafés', text: 'Specialty coffee and casual bites.' },
          { icon: Sparkles, image: img.expRooftop, title: 'Rooftop Lounges', text: 'Sunset views and cocktails.' },
          { icon: Wine, image: '/beach-bars.jpeg', title: 'Beach Bars', text: 'Relaxed drinks by the sea.' },
        ],
      },
    ],
  },

  /* -------------------------------- Hotels in RAK -------------------------------- */
  hotels: {
    hero: {
      image: img.expLuxuryHotel,
      badge: 'Experience at RAK',
      title: 'Hotels in RAK',
      subtitle: 'Stay your way in Ras Al Khaimah - from five-star beach resorts and mountain retreats to family hotels and private villas.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'Where to stay',
        title: 'Stays for every',
        highlight: 'traveller',
        columns: 4,
        items: [
          { icon: Star, image: img.expLuxuryHotel, title: 'Luxury Hotels', text: 'Five-star city and waterfront stays.' },
          { icon: Waves, image: img.expBeachResort, title: 'Beach Resorts', text: 'Private beaches, spas and pools.' },
          { icon: Mountain, image: img.expMountainResort, title: 'Mountain Resorts', text: 'Spectacular stays high on Jebel Jais.' },
          { icon: Tent, image: img.expDesertResort, title: 'Desert Resorts', text: 'Secluded escapes among the dunes.' },
          { icon: BedDouble, image: img.expCityHotel, title: 'Family Hotels', text: 'Kids’ clubs and spacious family suites.' },
          { icon: Building, image: img.expBudgetHotel, title: 'Budget Hotels', text: 'Comfortable, affordable stays.' },
          { icon: Home, image: img.expVilla, title: 'Villas & Holiday Homes', text: 'Private homes for longer stays.' },
        ],
      },
      { type: 'cta', title: 'Find your stay in Ras Al Khaimah', text: 'Browse hotels and resorts across the emirate at Visit Ras Al Khaimah.', buttonLabel: 'Contact Us', to: '/contact' },
    ],
  },

  /* ════════════════════════════════ CAREERS ════════════════════════════════ */
  careers: {
    hero: {
      image: img.careersHero,
      badge: 'Join us',
      title: 'Careers',
      subtitle: 'Build your future with one of the UAE’s fastest-growing airports.',
    },
    sections: [
      {
        type: 'intro',
        kicker: 'Join our team',
        title: 'Grow your career at',
        highlight: 'RAK Airport',
        image: img.opsOffice,
        paragraphs: [
          'Often there are opportunities for great people to join our team at Ras Al Khaimah International Airport. We offer a full benefits package to our employees and on-going training.',
          'To apply for a job, please email a cover letter and your CV to careers@rakairport.com. Kindly note that CVs sent to any other email address will not be considered.',
        ],
      },
      {
        type: 'actions',
        items: [
          { title: 'Current Openings', text: 'Browse our current vacancies and apply online.', buttonLabel: 'Apply Now', to: 'https://www.careers-page.com/rak-international-airport' },
          { title: 'Apply for an Internship', text: 'Send your CV to careers@rakairport.com with the subject “Internship application”.', buttonLabel: 'Download Programme (PDF)', to: '/Internship%20Program%20RAK%20Airport.pdf' },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Internship Programs',
        title: 'For students &',
        highlight: 'graduates',
        subtitle: 'Open to UAE citizens - we are committed to educating and nurturing the new working generation with the best learning experience in a real working environment.',
        columns: 2,
        items: [
          { icon: GraduationCap, title: 'Student Internship', text: 'A three-to-six-month training term to gain basic knowledge and experience in your field of study; it can count towards a university graduation requirement.', points: ['Request letter from the university', 'Must be enrolled in a college/university program', 'Minimum GPA of 3.00 from an accredited UAE institute', 'Able to commit to the full internship period'] },
          { icon: Briefcase, title: 'Graduate Internship', text: 'A six-month to one-year full-time on-the-job programme across departments such as IT, Procurement, Finance, HR, Electronics, Projects & Engineering, Commercial, Ground Handling, Operations, Safety, Security, Quality and Cargo.', points: ['Age group 18–30', 'Certificate, Diploma or Degree from an accredited institute', 'Fluency in verbal & written English', 'Willing to learn and adapt to new working situations'] },
        ],
      },
      {
        type: 'features',
        items: [
          { icon: ClipboardCheck, title: 'Performance & placement', text: 'An intern’s performance is monitored throughout the programme by section managers through written reports and presentations, and on their ability to work individually and as part of a team. On completion, interns are evaluated by managers and HR - those with high competence and outstanding performance are considered for placement opportunities with RAK Airport.', points: ['Monitored by section managers', 'Final evaluation by managers & HR', 'Top performers considered for placement'], image: img.spacesHero },
        ],
      },
      {
        type: 'cards',
        bg: 'mist',
        kicker: 'Stay safe',
        title: 'Warning on recruitment',
        highlight: 'fraud',
        subtitle: 'Ras Al Khaimah International Airport hires directly via the careers page on its website. Verify the authenticity of any recruitment activity before sharing information with a third party.',
        columns: 2,
        items: [
          { icon: Ban, title: 'We never ask for money', text: 'Ras Al Khaimah International Airport will never ask for money (in any form) from an applicant.' },
          { icon: Users, title: 'In-person interviews', text: 'We do not make job offers without conducting an in-person interview at our office at Ras Al Khaimah International Airport.' },
          { icon: ShieldCheck, title: 'No bank details', text: 'We never ask for any bank account details prior to employment.' },
          { icon: Mail, title: 'Official emails only', text: 'All authorised email communications come from a Ras Al Khaimah International Airport HR account.' },
        ],
      },
    ],
  },

  /* -------------------------------- Useful Links -------------------------------- */
  'useful-links': {
    hero: {
      image: img.tower,
      badge: 'Information',
      title: 'Useful Links',
      subtitle: 'A list of links for various governmental and aviation-related organizations located in Ras Al Khaimah.',
    },
    sections: [
      {
        type: 'linklist',
        kicker: 'Directory',
        title: 'Helpful',
        highlight: 'organisations',
        groups: [
          {
            heading: 'Government',
            links: [
              { label: 'RAK Government', url: 'www.rak.ae' },
              { label: 'RAK DCA', url: 'www.rakdca.gov.ae' },
              { label: 'GCAA U.A.E.', url: 'www.gcaa.ae' },
              { label: 'RAK Customs', url: 'www.rakcustoms.rak.ae' },
              { label: 'RAK Police', url: 'www.rakpolice.gov.ae' },
              { label: 'RAK Economic Department', url: 'www.economic.rak.ae' },
              { label: 'UAE Department of Naturalization & Residency', url: 'www.dnrd.ae' },
              { label: 'RAK Chamber of Commerce', url: 'www.rakchamber.ae' },
              { label: 'RAKTA', url: 'www.rakta.gov.ae' },
            ],
          },
          {
            sections: [
              {
                heading: 'Aviation & Travel Agency',
                links: [
                  { label: 'Air Arabia', url: 'www.airarabia.com' },
                  { label: 'Air India Express', url: 'www.airindiaexpress.in' },
                  { label: 'Indigo Airlines', url: 'www.goindigo.in' },
                ],
              },
              {
                heading: 'Semi Government',
                links: [
                  { label: 'RAK Exhibition Centre', url: 'www.rakexpo.ae' },
                  { label: 'RAK Investment Authority', url: 'www.stg.rak.ae' },
                  { label: 'RAK Properties', url: 'www.rakproperties.net' },
                  { label: 'RAK Tourism', url: 'www.rasalkhaimahtourism.com' },
                  { label: 'Saqr Port', url: 'www.rakports.ae' },
                ],
              },
            ],
          },
          {
            sections: [
              {
                heading: 'Hospitals',
                links: [{ label: 'RAK Hospital', url: 'www.rakhospital.com' }],
              },
              {
                heading: 'Banks',
                links: [{ label: 'RAK Bank', url: 'www.rakbank.ae' }],
              },
              {
                heading: 'Hotels & Resorts',
                links: [{ label: 'Visit Ras Al Khaimah', url: 'www.visitrasalkhaimah.com' }],
              },
              {
                heading: 'Weather, Meteorology & Seismology',
                links: [{ label: 'National Center of Meteorology & Seismology', url: 'www.ncm.gov.ae' }],
              },
            ],
          },
        ],
      },
    ],
  },
}

// Most content-page heroes use Ras Al Khaimah imagery (rotated for variety).
// Experience-at-RAK pages keep their own theme-appropriate heroes.
const rakHeroes = [
  img.rakCity, img.rakJais, img.rakFort, img.rakJais2, img.rakAirport, img.rakWadi, img.rakJais3,
]
const keepOwnHero = new Set([
  'things-to-do', 'adventure-mountains', 'beaches-islands', 'culture-heritage',
  'desert-experiences', 'family-activities', 'dining-nightlife', 'hotels',
  'cafes-bars',
])
Object.keys(pages).forEach((slug, i) => {
  if (keepOwnHero.has(slug)) return
  pages[slug].hero.image = rakHeroes[i % rakHeroes.length]
})

// Page-specific hero overrides
pages['retail-space'].hero.image = '/image3.png'
pages['operations'].hero.image = '/Operating-Rules-Regulations-hero.jpeg'
pages['landing-permissions'].hero.image = '/Landing-Permissions-Procedures-hero.jpg'
pages['crew-immigration'].hero.image = '/Requirements-of-Crew-Immigration-hero.jpg'
pages['apron-driving-license'].hero.image = '/Airside-Driving-License-hero.jpg'
pages['airport-pro'].hero.image = '/RAK-Airport-PRO-hero.jpg'
pages['authorities'].hero.image = '/Authorities-hero.jpg'
pages['luggage-checkin'].hero.image = '/luggage-checkin-hero.jpg'
pages['facilities'].hero.image = '/Facilities-Services-hero.jpg'
pages['parking'].hero.image = '/parking-hero-v2.jpeg'
pages['cargo'].hero.image = '/Cargo-Facilities-hero.jpg'
pages['vip-handling'].hero.image = '/VIP-Handling-Services-hero.webp'
pages['public-transport'].hero.image = '/Public-Transport-hero.jpg'
pages['bus-service'].hero.image = '/Airport-Free-Bus-Service-hero.jpg'
pages['duty-free'].hero.image = '/RAK-Duty-Free-hero.jpg'
pages['wifi'].hero.image = '/free-wifi-internet-hero.png'
pages['business'].hero.image = '/Business-Opportunities-hero.png'
pages['advertising'].hero.image = '/Advertising-At-RAK-Airport-hero.jpg'
pages['office-space'].hero.image = '/Office-Space-hero.jpg'
pages['corporate-aviation'].hero.image = '/Corporate-Aviation-hero.jpg'
pages['passenger-operations'].hero.image = '/Passenger-Airline-Operations-hero.jpg'
pages['maintenance-facilities'].hero.image = '/Maintenance-Facilities-hero.png'
pages['operators'].hero.image = '/Operators-in-RAK-Airport-hero.png'
pages['careers'].hero.image = '/RAK-airport-career.png'
pages['about'].hero.image = '/About-RAK-Airport-hero.jpg'
pages['management'].hero.image = '/Management-Team-hero.png'
pages['mission'].hero.image = '/Mission-Vision-hero.jpg'
pages['useful-links'].hero.image = '/Useful-Links-hero.jpg'

// Every Experience-at-RAK page gets a map with floating location cards
// (real-estate style). `query` centers the embed on real land; `link` is the
// category search the "Open in Google Maps" button opens.
const expMaps = {
  'things-to-do': {
    q: 'Ras Al Khaimah, UAE', link: 'Tourist attractions in Ras Al Khaimah, UAE', z: 11,
    title: 'Top spots in', highlight: 'Ras Al Khaimah',
    cards: [
      { image: '/jebel-jais.jpg', title: 'Jebel Jais', query: 'Jebel Jais, Ras Al Khaimah, UAE', zoom: 12, facts: [{ icon: Mountain, text: 'Peak' }, { icon: Footprints, text: 'Hiking' }] },
      { image: '/Jais-Flight-Zipline.png', title: 'Jais Flight Zipline', query: 'Jebel Jais, Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Wind, text: '2.83 km zipline' }] },
    ],
  },
  'adventure-mountains': {
    q: 'Jebel Jais, Ras Al Khaimah, UAE', link: 'Jebel Jais, Ras Al Khaimah', z: 12,
    title: 'Adventure on', highlight: 'Jebel Jais',
    cards: [
      { image: img.rakJais2, title: 'Jais Flight Zipline', query: 'Jebel Jais, Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Wind, text: '2.83 km' }, { icon: Mountain, text: 'Jebel Jais' }] },
      { image: '/Jais-Sledder.jpg', title: 'Jais Sledder', query: 'Jebel Jais, Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Snowflake, text: 'Toboggan' }] },
      { image: '/Hiking-Trails.png', title: 'Hiking Trails', query: 'Jebel Jais, Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Footprints, text: 'All levels' }] },
      { image: img.expMtb, title: 'Mountain Biking', query: 'Jebel Jais, Ras Al Khaimah, UAE', zoom: 12, facts: [{ icon: Bike, text: 'Hajar trails' }] },
    ],
  },
  'beaches-islands': {
    q: 'Al Marjan Island, Ras Al Khaimah, UAE', link: 'Beach resorts in Ras Al Khaimah, UAE', z: 13,
    title: 'Resorts in', highlight: 'Ras Al Khaimah',
    cards: [
      { image: img.expBeachResort, title: 'Al Marjan Island Resorts', query: 'Al Marjan Island, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Star, text: '5-Star' }, { icon: Waves, text: 'Beachfront' }, { icon: Utensils, text: 'Dining' }] },
      { image: img.expPool, title: 'Al Hamra Beach Resorts', query: 'Al Hamra Village, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Waves, text: 'Marina' }, { icon: Sparkles, text: 'Spa' }, { icon: Star, text: 'Golf' }] },
      { image: img.expMangrove, title: 'Mina Al Arab Resorts', query: 'Mina Al Arab, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Trees, text: 'Mangroves' }, { icon: Waves, text: 'Lagoon' }, { icon: Star, text: 'Wellness' }] },
      { image: img.expBeach, title: 'Beach Clubs', query: 'Al Marjan Island, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Sparkles, text: 'Pools' }, { icon: Waves, text: 'Sea views' }, { icon: Wine, text: 'Beach bar' }] },
    ],
  },
  'culture-heritage': {
    q: 'Dhayah Fort, Ras Al Khaimah, UAE', link: 'Heritage sites in Ras Al Khaimah, UAE', z: 12,
    title: 'Heritage in', highlight: 'Ras Al Khaimah',
    cards: [
      { image: img.rakFort, title: 'Dhayah Fort', query: 'Dhayah Fort, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Landmark, text: '18th c.' }, { icon: Eye, text: 'Hilltop' }] },
      { image: '/NATIONAL-MUSEUM-OF-RAK.jpg', title: 'National Museum', query: 'National Museum of Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Building2, text: 'Museum' }] },
      { image: '/jazeerah-al-hamra.jpg', title: 'Al Jazeera Al Hamra', query: 'Al Jazeera Al Hamra, Ras Al Khaimah, UAE', zoom: 15, facts: [{ icon: Home, text: 'Old village' }] },
      { image: '/Al-Suwaidi-Pearl-Farm.jpg', title: 'Suwaidi Pearls', query: 'Al Rams, Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Gem, text: 'Pearl farm' }] },
    ],
  },
  'desert-experiences': {
    q: 'Ras Al Khaimah, UAE', link: 'Desert safari in Ras Al Khaimah, UAE', z: 10,
    title: 'Desert in', highlight: 'Ras Al Khaimah',
    cards: [
      { image: '/desert_safari_in_rak.jpg', title: 'Desert Safari', query: 'Ras Al Khaimah, UAE', zoom: 12, facts: [{ icon: Tent, text: 'Half/full day' }] },
      { image: img.expOffroad, title: 'Dune Bashing', query: 'Ras Al Khaimah, UAE', zoom: 12, facts: [{ icon: Car, text: '4x4' }] },
      { image: img.expBedouin, title: 'Bedouin Camp', query: 'Ras Al Khaimah, UAE', zoom: 12, facts: [{ icon: Flame, text: 'Dinner' }, { icon: Sparkles, text: 'Shows' }] },
      { image: img.expStars, title: 'Stargazing', query: 'Ras Al Khaimah, UAE', zoom: 11, facts: [{ icon: Sparkles, text: 'Clear skies' }] },
    ],
  },
  'family-activities': {
    q: 'Ras Al Khaimah, UAE', link: 'Family attractions in Ras Al Khaimah, UAE', z: 11,
    title: 'Family fun in', highlight: 'Ras Al Khaimah',
    cards: [
      { image: img.expBeach, title: 'Beaches', query: 'Al Hamra Beach, Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Waves, text: 'Family-safe' }] },
      { image: img.expNature, title: 'Nature Parks', query: 'Mina Al Arab, Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Trees, text: 'Mangroves' }] },
      { image: '/family-resort.jpg', title: 'Family Resorts', query: 'Al Marjan Island, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Star, text: 'Kids clubs' }] },
    ],
  },
  'dining-nightlife': {
    q: 'Ras Al Khaimah, UAE', link: 'Restaurants in Ras Al Khaimah, UAE', z: 12,
    title: 'Dine across', highlight: 'Ras Al Khaimah',
    cards: [
      { image: img.expFineDining, title: 'Fine Dining', query: 'Al Marjan Island, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Utensils, text: 'Gourmet' }] },
      { image: img.expArabicFood, title: 'Emirati Cuisine', query: 'Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: Utensils, text: 'Local' }] },
      { image: img.expBeachRest, title: 'Beachfront Dining', query: 'Al Hamra Village, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Waves, text: 'Sea views' }] },
      { image: img.expRooftop, title: 'Rooftop Lounges', query: 'Al Marjan Island, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Sparkles, text: 'Sunset' }, { icon: Wine, text: 'Cocktails' }] },
    ],
  },
  'hotels': {
    q: 'Ras Al Khaimah, UAE', link: 'Hotels in Ras Al Khaimah, UAE', z: 11,
    title: 'Stay across', highlight: 'Ras Al Khaimah',
    cards: [
      { image: img.expLuxuryHotel, title: 'Luxury Hotels', query: 'Al Marjan Island, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Star, text: '5-Star' }] },
      { image: img.expBeachResort, title: 'Beach Resorts', query: 'Al Hamra Village, Ras Al Khaimah, UAE', zoom: 14, facts: [{ icon: Waves, text: 'Beachfront' }, { icon: Sparkles, text: 'Spa' }] },
      { image: img.expMountainResort, title: 'Mountain Resorts', query: 'Jebel Jais, Ras Al Khaimah, UAE', zoom: 12, facts: [{ icon: Mountain, text: 'Jebel Jais' }] },
      { image: img.expCityHotel, title: 'Family Hotels', query: 'Ras Al Khaimah, UAE', zoom: 13, facts: [{ icon: BedDouble, text: 'Suites' }] },
    ],
  },
}
Object.entries(expMaps).forEach(([slug, m]) => {
  const mapSection = {
    type: 'mapcards',
    bg: 'mist',
    kicker: 'On the map',
    title: m.title,
    highlight: m.highlight,
    subtitle: 'Explore these locations across the emirate.',
    query: m.q,
    linkQuery: m.link,
    zoom: m.z,
    label: 'Open in Google Maps',
    cards: m.cards,
  }
  const secs = pages[slug].sections
  const last = secs[secs.length - 1]
  if (last && last.type === 'cta') secs.splice(secs.length - 1, 0, mapSection)
  else secs.push(mapSection)
})

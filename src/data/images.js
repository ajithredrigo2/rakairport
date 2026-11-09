// Centralised image URLs (Unsplash). Swap these for official RAK assets later.
// `u(id, w)` builds an Unsplash URL; an onError fallback in <Img> guarantees a
// picture always renders even if a specific photo is unavailable.
export const u = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

// Wikimedia Commons direct (stable) URL for a file.
export const c = (file, w = 1100) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`

export const img = {
  // Home + core
  heroHome: u('1505228395891-9a51e7e86bf6', 1920),
  flightHero: u('1436491865332-7a61a109cc05', 1920),
  transportHero: c('WSI airport terminal 2025.jpg'),
  businessHero: u('1521791136064-7986c2920216', 1920),

  customs: u('1556742049-0cfed4f6a45d', 800),
  arrivalPrep: u('1488085061387-422e29b40080', 800),
  shuttle: u('1544620347-c4fd4a3d5957', 800),
  artCulture: c('Rhythms of Al Ayyala.jpg'), // Emirati Al Ayyala heritage dance (RAK culture)
  rakTourism: u('1469854523086-cc02fe5d8800', 800),
  experienceRak: c('Ras Al Khaimah.jpg', 800), // real Ras Al Khaimah city view
  arrivalCard: u('1542296332-2e4473faf563', 800), // wide-body on apron (arriving)
  departureCard: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brisbane%20Airport%20Domestic%20Terminal%20flights%20departures%20board%2C%20June%202022.jpg?width=900', // departures board
  bus: u('1570125909232-eb263c188f7e', 900),
  taxi: u('1549924231-f129b911e442', 900),
  parking: u('1506521781263-d8422e82f27a', 900),
  tower: c('Sea-Tac Airport International Terminal (South Satellite) aerial view, 2016.jpg'),
  passengerOps: c('Spring Airlines aircraft with passenger boarding stairs @ PVG.jpg'), // passengers boarding
  runway: u('1569154941061-e231b4725ef1', 1000), // airliner head-on on taxiway, centered
  // Air-cargo: freighter aircraft being loaded with cargo containers (Wikimedia Commons, stable URL)
  cargo: 'https://commons.wikimedia.org/wiki/Special:FilePath/UPS%20767-300F%20freighter%20unloading%20at%20Boston%20April%202025.jpg?width=1100',
  corporate: u('1540962351504-03099e0a754b', 1000),
  mro: c('Iberia Maintenance Hangar (5496611791).jpg'), // airline MRO hangar

  // New option heroes
  experienceHero: u('1493558103817-58b2924bce98', 1920), // mountains
  shopHero: c('Heathrow Terminal 1, seating and shopping area - geograph.org.uk - 375225.jpg'), // retail
  facilitiesHero: u('1517248135467-4c7edcad34c4', 1920), // lounge
  hotelsHero: u('1566073771259-6a8506099945', 1920), // hotel room
  dutyHero: c('Duty free shopping area in Melbourne Airport.jpg'), // shopping bags
  advertHero: u('1503095396549-807759245b35', 1920), // billboard
  aviationHero: u('1474302770737-173ee21bab63', 1920), // runway
  spacesHero: u('1497366216548-37526070297c', 1920), // modern interior
  shuttleHero: u('1556122071-e404eaedb77f', 1920), // bus interior
  taxiHero: u('1559030623-0226b1241edd', 1920), // taxi night
  parkingHero: u('1470224114660-3f6686c562eb', 1920), // car park
  baggageHero: c('Baggage claim carousel 2 at Terminal 3 of Toronto Pearson International Airport (YYZ).jpg'), // baggage claim
  careersHero: u('1521737604893-d14cc237f11d', 1920), // team
  aboutHero: u('1556388158-158ea5ccacbd', 1920), // airport interior
  faqHero: u('1454165804606-c3d57bc86b40', 1920), // desk planning
  carHero: u('1606152421802-db97b9c7a11b', 1920), // car rental sedan
  mapHero: u('1540339832862-474599807836', 1920), // terminal concourse
  contactHero: u('1604328698692-f76ea9498e76', 1920), // professional reception desk

  // --- Ras Al Khaimah hero imagery (used for all content-page heroes) ---
  rakCity: c('Ras Al Khaimah.jpg', 1600),
  rakJais: c('Jebel Jais Mountain.jpg', 1600),
  rakJais2: c('Jebel Jais, Ras Al Khaimah.jpg', 1600), // people-free Jebel Jais
  rakJais3: c('Jebel Jais, Ras Al Khaimah.jpg', 1600),
  rakFort: c('Dhayah Fort, Ras Al Khaimah.jpg', 1600),
  rakAirport: c('Ras Al Khaimah International Airport.jpg', 1600),
  rakWadi: c('Wadi Shawka.jpg', 1600),

  // --- Experience at RAK galleries (themed) ---
  expMountains: u('1571863533956-01c88e79957e', 900),
  expMountainAlt: u('1454496522488-7a8e488e8606', 900),
  expHiking: u('1465056836041-7f43ac27dcb5', 900),
  expCamping: u('1504280390367-361c6d9f38f4', 900),
  expMtb: u('1576435728678-68d0fbf94e91', 900),
  expBeach: u('1507525428034-b723cf961d3e', 900),
  expBeachResort: u('1571896349842-33c89424de2d', 900),
  expIsland: u('1559128010-7c1ad6e1b6a5', 900),
  expFlamingo: u('1497206365907-f5e630693df0', 900),
  expMangrove: u('1559825481-12a05cc00344', 900),
  expPool: u('1571902943202-507ec2618e8f', 900),
  expJetski: u('1623874514711-0f321325f318', 900),
  expHeritage: u('1591604129939-f1efa4d9f7fa', 900),
  expMuseum: u('1518756131217-31eb79b20e8f', 900),
  expSouk: u('1528702748617-c64d49f918af', 900),
  expPearls: u('1611591437281-460914d0ec85', 900),
  expDesert: u('1452457750107-cd084dce177d', 900),
  expDunes: u('1518684079-3c830dcef090', 900),
  expOffroad: u('1547234935-80c7145ec969', 900),
  expCamel: u('1545419913-775e3e82c7db', 900),
  expQuad: u('1558981403-c5f9899a28bc', 900),
  expBedouin: u('1473580044384-7ba9967e16a0', 900),
  expStars: u('1419242902214-272b3f66ee7a', 900),
  expNature: u('1441974231531-c6227db76b6e', 900),
  expWildlife: u('1534567153574-2b12153a87f0', 900),
  expIndoor: u('1511882150382-421056c89033', 900),
  expFamily: u('1602002418082-a4443e081dd1', 900),
  expFineDining: u('1504674900247-0877df9cc836', 900),
  expArabicFood: u('1541518763669-27fef04b14ea', 900),
  expBeachRest: u('1559339352-11d035aa65de', 900),
  expCafe: u('1554118811-1e0d58224f24', 900),
  expRooftop: u('1455587734955-081b22074882', 900),
  expBeachBar: u('1530053969600-caed2596d242', 900),
  expLuxuryHotel: u('1566073771259-6a8506099945', 900),
  expCityHotel: u('1542314831-068cd1dbfeeb', 900),
  expMountainResort: u('1469474968028-56623f02e42e', 900),
  expDesertResort: u('1582719508461-905c673771fd', 900),
  expBudgetHotel: u('1551882547-ff40c63fe5fa', 900),
  expVilla: u('1613490493576-7fde63acd811', 900),

  // --- Operations / business card imagery (people-free) ---
  opsDocs: u('1554224155-6726b3ff858f', 800),
  opsWarehouse: u('1586528116311-ad8dd3c8310d', 800),
  opsBoxes: u('1601598851547-4302969d0614', 800),
  opsOffice: u('1497366811353-6870744d04b2', 800),
  opsGov: u('1564507592333-c60657eea523', 800),
  opsAmbulance: u('1587745416684-47953f16f02f', 800),
  supportTeam: u('1556745757-8d76bdb6984b', 900),
  opsImmig: u('1502920514313-52581002a659', 800),
  opsCamera: u('1502920917128-1aa500764cbd', 800),
  opsWifi: u('1518770660439-4636190af475', 800),

  // --- Unique images added to remove cross-page repeats ---
  loungeInterior: c('The Club lounge interior BWI MD 2025-05-13 15-38-50 1.jpg'),
  restaurantInt: c('Terminal B LGA food court 2024 jeh.jpg'),
  retailStore: c('Tokyo International Airport International Terminal -05.jpg'),
  perfumeShop: c('Duty free shop at Vilnius airport.JPG'),
  parkingIndoor: c('Interior of Multi-storey car park at Skygate, Brisbane.jpg'),
  parkingOutdoor: c('Changi Airport, Budget Terminal Carpark.JPG'),
  billboard: c('Billboard, Airline Highway, Metairie, Louisiana, October 2021 - 03.jpg'),
  coachBus: c('Bus Bay 17 T4 Melbourne airport.jpg'),
  cityBus: '/free-shuttle-bus.jpg',
  airportTransport: c('Airport Ground Transportation Center Bus Terminus 2007.jpg'),
  airportAerial: c('Soekarno-Hatta Airport aerial view.jpg'),
  taxiCab: c('Taxi rank Domestic Terminal Brisbane Airport P1090007.jpg'),
  mroHangar: c('Female Engineer at Bristow Helicopters Hangar.jpg'),
  securityCheck: c('Screening Checkpoint Boston Logan.jpg'),
  airportCheckin: c('Mackay Airport departure hall check in counters.jpg'), // office desk
  airCargo: c('Toll 737 aircraft (11201124624).jpg'), // air cargo freighter hold
  accessibleParking: c('Handicap Parking Space (32283094777).jpg'), // accessible parking bay
}

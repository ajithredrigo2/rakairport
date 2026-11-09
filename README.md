# RAK — Ras Al Khaimah International Airport

A React (Vite + Tailwind CSS v4) website for Ras Al Khaimah International Airport.
Light, modern aviation theme.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Pages & navigation

The home hero has four buttons that route to:

| Button   | Route         | Page                                            |
| -------- | ------------- | ----------------------------------------------- |
| Flights  | `/flights`    | Flight Information (Arrival / Departure)         |
| Hotels   | `/`           | placeholder (no content provided yet)           |
| Bus      | `/transport`  | Transport (Free Shuttle / Taxi / Parking)       |
| Deals    | `/deals`      | Business Opportunities (Ops, Cargo, MRO, Deals)  |

## Structure

```
src/
  components/   Navbar, Footer, Logo, ui (PageHero, SectionHeading)
  pages/        Home, Flights, Transport, Deals
  data/         images.js  (centralised Unsplash URLs — swap for official assets)
  index.css     Tailwind v4 + brand theme tokens
```

## Customising

- **Logo:** edit `src/components/Logo.jsx`. Drop the official file in `public/`
  and replace the placeholder mark with `<img src="/logo.svg" .../>`.
- **Colors:** adjust the `@theme` brand tokens in `src/index.css`.
- **Images:** replace the URLs in `src/data/images.js` with official RAK photos.

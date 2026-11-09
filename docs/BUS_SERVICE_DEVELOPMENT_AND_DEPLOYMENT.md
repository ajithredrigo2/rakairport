# RAK Airport Shuttle Bus Management System

## Development and production deployment guide

This guide covers the shuttle bus timetable and administration feature within the existing RAK Airport website. It is not a separate website and it does not replace or change the existing FIDS `/getFlights` service.

The feature has three parts:

| Component | Purpose | Location |
| --- | --- | --- |
| Public timetable | Displays only active and published shuttle routes and trips | `/bus-service` |
| Administration panel | Allows authorised staff to manage shuttle information | `/admin/bus-service` |
| Same-origin API | Connects the React website to SQL Server | `/bus-service-api/*` |

The Shuttle Bus & Admin API runs as a dedicated Node process (`server/bus-service-server.mjs`) running locally on port `3002` (leaving port `3000` for the FIDS flight API and port `3001` for the Chatbot AI). IIS proxies the API to that local process. SQL Server credentials are only read by Node and are never shipped to the browser.

---

## 1. Project structure

Important files are below.

| File | Purpose |
| --- | --- |
| `src/pages/BusService.jsx` | Public shuttle information and timetable page |
| `src/pages/BusServiceAdmin.jsx` | Protected shuttle administration interface |
| `server/bus-service.mjs` | SQL Server API, validation, sessions, and audit logging |
| `server/rakia-server.mjs` | Existing Node server that mounts the bus API |
| `database/migrations/20261103_bus_service.sql` | Base SQL Server shuttle schema migration |
| `database/migrations/20261104_shuttle_operations_panel.sql` | Additive operations-panel roles, service status, return stops, and audit migration |
| `database/seeds/20261103_bus_service_seed.sql` | Initial timetable seed based on the supplied schedule PDF |
| `.env.example` | Safe environment-variable template; contains no secrets |
| `vite.config.js` | Local-development proxy configuration |
| `public/web.config` | IIS rewrite and production proxy configuration |

---

## 2. Requirements

### Development computer

- Node.js 20 or later (the currently installed version also works if it supports `--env-file`)
- npm
- SQL Server 2019 or later / SQL Server Express
- SQL Server Management Studio (SSMS), optional but recommended
- IIS URL Rewrite and Application Request Routing (ARR) are only needed for production IIS deployment

### SQL Server permissions

Create a dedicated SQL login for this feature. Do not use `sa`, a Windows administrator, or a personal user account in production.

The application login needs permission to read and update the bus tables only. A database administrator should create it and grant the minimum permissions required, for example:

```sql
USE [RAKAirport];
GO
CREATE LOGIN [rak_bus_service] WITH PASSWORD = 'Use-a-long-unique-password-here';
GO
CREATE USER [rak_bus_service] FOR LOGIN [rak_bus_service];
GO
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusRoutes TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusTrips TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusStops TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusTripStops TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusAnnouncements TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusServiceSettings TO [rak_bus_service];
GRANT SELECT, INSERT ON dbo.BusAuditLogs TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusServiceStatus TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.BusReturnStops TO [rak_bus_service];
GRANT SELECT ON dbo.BusRolePermissions TO [rak_bus_service];
GRANT SELECT, INSERT, UPDATE ON dbo.BusAdminUsers TO [rak_bus_service];
GO
```

Do not run this example unchanged on production. The password must be generated and stored securely by the infrastructure team.

---

## 3. First-time SQL Server setup

### 3.1 Create or select the database

In SSMS, connect to the intended SQL Server instance and select the RAK Airport application database. The examples assume its name is `RAKAirport`.

### 3.2 Apply the migration

1. Back up the database.
2. Open `database/migrations/20261104_shuttle_operations_panel.sql` in SSMS and execute it. This is self-contained and creates the base shuttle tables when they are missing.
3. The older `20261103_bus_service.sql` is retained for audit/history; do not run it first on a new database.
3. Confirm the selected database is correct.
4. Execute the script once.

The base migration creates:

- `BusRoutes`
- `BusTrips`
- `BusStops`
- `BusTripStops`
- `BusAnnouncements`
- `BusServiceSettings`
- `BusAuditLogs`

It also creates indexes and data-integrity constraints. The migration is safe to run again because it checks whether each table already exists.

The operations-panel migration is additive and safe to rerun. It preserves all existing route, trip, stop, and notice records while adding service-status history, return-stop support, Super Admin/Editor role permissions, soft-deleted team accounts, and audit indexes. It requires a database owner or a temporary deployment principal with `CREATE TABLE`, `ALTER`, and `CREATE INDEX`; the application login must not receive those permissions.

### 3.3 Seed the initial timetable

1. Review the approved operational timetable first.
2. Open `database/seeds/20261103_bus_service_seed.sql` in SSMS.
3. Execute it against the same database.

The seed uses the daily timetable supplied in the shuttle schedule PDF. It inserts two routes, their first and second daily trips, the pickup stops, ten-minute waits, departure times, and estimated RAK Airport arrival times.

The seed runs only when there are no bus routes. It will not overwrite an existing schedule.

### 3.4 Important schedule review

The supplied PDF contains multiple layouts and schedules. Operations must review the imported timetable before it is used publicly. The administration panel supports saving routes and trips as **Draft**, then changing them to **Published** only after confirmation.

---

## 4. Environment configuration

### 4.1 Create the local environment file

Copy `.env.example` to `.env` if `.env` does not already exist. The `.env` file is ignored by Git and must never be committed.

Add these server-only values:

```ini
# Development uses this value so cookies work over http://localhost.
NODE_ENV=development

# Use exactly one Server= prefix. For SQL Express, the value can be:
BUS_SERVICE_SQL_CONNECTION_STRING=Server=DESKTOP-8M7T8S0\SQLEXPRESS;Database=RAKAirport;User Id=rak_bus_service;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True

# Credentials for /admin/bus-service. These are never visible in the React app.
BUS_ADMIN_USERNAME=bus-admin
BUS_ADMIN_PASSWORD=USE_A_LONG_UNIQUE_PASSWORD

# Required for signed, HttpOnly administrator session cookies.
BUS_ADMIN_SESSION_SECRET=GENERATE_A_LONG_RANDOM_VALUE
```

Generate the session secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 4.2 Common SQL connection-string error

Do not use this invalid value:

```ini
Server=Server=DESKTOP-8M7T8S0\SQLEXPRESS
```

Use this instead:

```ini
Server=DESKTOP-8M7T8S0\SQLEXPRESS
```

The duplicated `Server=` makes the Node SQL driver try to resolve a server literally named `server=desktop-8m7t8s0`, which fails.

### 4.3 Production environment values

Production must set:

```ini
NODE_ENV=production
BUS_SERVICE_SQL_CONNECTION_STRING=Server=PRODUCTION_SQL_SERVER;Database=RAKAirport;User Id=rak_bus_service;Password=PRODUCTION_SECRET;Encrypt=True;TrustServerCertificate=False
BUS_ADMIN_USERNAME=production-bus-admin
BUS_ADMIN_PASSWORD=PRODUCTION_SECRET
BUS_ADMIN_SESSION_SECRET=LONG_RANDOM_PRODUCTION_SECRET
```

For production, use a certificate trusted by the server and keep `TrustServerCertificate=False`. The application sets `Secure` and `HttpOnly` session-cookie flags when `NODE_ENV=production`.

---

## 5. Local development

### 5.1 Install dependencies

From the repository root:

```powershell
npm install
```

### 5.2 Start the existing Node API process

In one PowerShell window:

```powershell
node --env-file=.env server/rakia-server.mjs
```

Expected message:

```text
Rakia AI server on 127.0.0.1:3001
```

The same process serves the existing AI route and the new shuttle route. Do not start a second bus-specific service.

### 5.3 Start the Vite frontend

In a second PowerShell window:

```powershell
npm run dev
```

Open the Vite address shown in the terminal, usually `http://localhost:5173`.

The proxy forwards these same-origin browser requests to the dedicated local services:

| Browser request | Local target | Description |
| --- | --- | --- |
| `/getFlights` | FIDS API on port 3000 | Existing Live Flight Data API |
| `/chat` | Rakia API on port 3001 | AI Chatbot Service |
| `/bus-service-api` | Shuttle API on port 3002 | Shuttle Bus & Admin Operations API |

In local frontend development, `npm run dev` starts Vite on port `5173` (not port 3000) so it does not collide with the flight API.

### 5.4 Local verification

Run these checks in PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3002/health
Invoke-RestMethod http://127.0.0.1:3002/bus-service-api/public
```

Then verify in the browser:

1. `/bus-service` displays the published route and trip timetable.
2. `/admin/bus-service` shows the administrator sign-in screen.
3. An incorrect password is rejected.
4. A valid administrator can create a draft announcement, publish it, and see it on the public page.
5. A route or trip marked Draft / inactive does not appear publicly.
6. The timetable works at a mobile width.

---

## 6. Using the administration panel

Open `/admin/bus-service` and sign in with `BUS_ADMIN_USERNAME` and `BUS_ADMIN_PASSWORD`.

### Routes

Routes describe a journey, direction, order, active state, and publication state. Keep a new or changed route as **Draft** until operations approves it.

### Trips

Each route may have multiple trips, such as First Trip and Second Trip. A public trip requires:

- A route
- A trip name
- At least one operating day
- An estimated airport arrival time
- Active enabled
- Published enabled

### Stops and timings

First add unique pickup locations in **Stops**. In **Trips**, select the map-pin action to manage that trip’s pickup sequence and stop timings.

For each stop, provide:

- Stop order
- Pickup location
- Arrival time
- Waiting minutes
- Departure time

The system permits an overnight trip, where a later stop occurs after midnight. Verify the chronological order carefully before publishing.

### Announcements

Active, date-valid announcements appear at the top of the public timetable. Select Information, Warning, or Service Suspension as appropriate. Expired announcements are automatically hidden from public users.

### Settings

Settings control whether the service is active, the displayed call-centre number, passenger eligibility message, and return-journey message.

### Administrator users

The **Admin users** screen creates named administrator accounts and removes accounts that no longer need access. New passwords must be at least 12 characters and are hashed with `scrypt` on the server; they are never returned to the browser or database list.

The `.env` administrator remains a recovery account and is not listed in the database users screen. Do not delete or share it.

Every create, update, and delete action is written to `BusAuditLogs` with the administrator name and timestamp.

---

## 7. Production deployment

### 7.1 Build the frontend

From the repository root:

```powershell
npm ci
npm run build
```

The production static site is generated in `dist/`. The build also pre-renders public pages.

### 7.2 Deploy the static website

Deploy the contents of `dist/` to the IIS website root. Ensure the deployment includes the current `public/web.config` as `web.config` in the IIS root.

Do not deploy the repository `.env`, `server/`, or `node_modules` into the public IIS document root.

### 7.3 Deploy the Node server files

Deploy these non-public files to a protected application folder outside the IIS web root, for example:

```text
C:\apps\rak-airport-api\
```

Required files include:

- `server/rakia-server.mjs`
- `server/bus-service.mjs`
- `server/site-knowledge.json`
- `package.json` and installed production dependencies
- The protected production `.env`

Run the Shuttle Bus & Admin Node process as a Windows service, scheduled task, IIS-compatible process manager, or your existing Jenkins/service-management method. It must bind only to:

```text
127.0.0.1:3002
```

Do not expose port `3002` to the public Internet.

### 7.4 IIS requirements

Install and enable:

- IIS URL Rewrite
- Application Request Routing (ARR)
- ARR proxy support at the server level

The deployed `web.config` includes a `Bus service API proxy` rewrite rule:

```xml
<match url="^bus-service-api(?:/(.*))?$" ignoreCase="true" />
<action type="Rewrite" url="http://127.0.0.1:3002/bus-service-api/{R:1}" appendQueryString="true" />
```

This rule keeps browser traffic same-origin:

```text
https://www.rakairport.com/bus-service-api/public
```

IIS then forwards it privately to the dedicated Node process on port 3002:

```text
http://127.0.0.1:3002/bus-service-api/public
```

The existing `/getFlights` proxy on port 3000 and `/chat` proxy on port 3001 are completely unchanged.

### 7.5 Restart sequence

After code or environment changes:

1. Apply any approved SQL migration.
2. Deploy the static build and `web.config`.
3. Deploy the Node server files.
4. Restart the Node service.
5. Confirm the local Node health endpoint.
6. Confirm the public website endpoints through IIS.

---

## 8. Production acceptance tests

Run after deployment from an authorised network:

```powershell
curl.exe -i https://www.rakairport.com/bus-service-api/public
curl.exe -i https://www.rakairport.com/bus-service-api/admin/overview
```

Expected results:

| Check | Expected result |
| --- | --- |
| Public API | `200` and timetable JSON, without credentials or SQL information |
| Admin overview without session | `401` with `administrator_access_required` |
| Public timetable | Shows published active trips only |
| Admin login | Sets an `HttpOnly`, `Secure`, `SameSite=Strict` cookie over HTTPS |
| FIDS API | `/getFlights` remains operational |
| Public Node port | Port `3002` is not reachable from outside the server |

Also test add/edit/delete confirmation, publish/unpublish behaviour, an announcement expiry date, and the mobile timetable layout.

---

## 9. Security operations

- Never put `BUS_SERVICE_SQL_CONNECTION_STRING`, administrator passwords, or session secrets in React source, `public/`, or a Git commit.
- Use a dedicated least-privilege SQL account.
- Use HTTPS in production. Secure administrator session cookies require it.
- Keep port `3002` private to the server; only IIS should proxy to it.
- Use a long random session secret and rotate it if it is exposed. Rotation invalidates existing admin sessions.
- Use a long, unique administrator password and change it when staff access changes.
- Review `BusAuditLogs` routinely.
- Keep Windows, IIS, Node.js, SQL Server, and npm dependencies patched.

---

## 10. Troubleshooting

### Public API returns `503 bus_service_not_configured`

`BUS_SERVICE_SQL_CONNECTION_STRING` is missing in the Node process environment. Add it to the protected `.env` and restart Node.

### Public API returns `500 server_error`

Check the Node service log and verify:

1. SQL Server is running.
2. The server and instance names are correct.
3. There is only one `Server=` prefix in the connection string.
4. The application login can access the `RAKAirport` database.
5. The migration has been applied.

### The public page says no timetable is available

At least one route and trip must both be active and published. The trip must contain pickup stops.

### The administration page cannot sign in

Check `BUS_ADMIN_USERNAME`, `BUS_ADMIN_PASSWORD`, and `BUS_ADMIN_SESSION_SECRET` in `.env`, then restart the Node process. In development, set `NODE_ENV=development`; in production, access the page through HTTPS.

### IIS returns `502.3` for `/bus-service-api/*`

The Node process is not running or ARR cannot reach `127.0.0.1:3002`. Verify:

```powershell
Invoke-RestMethod http://127.0.0.1:3002/health
```

Then confirm ARR proxy is enabled and the IIS rule is deployed.

### SQL Express cannot be found

Verify the instance name in SSMS. A common local value is:

```ini
Server=DESKTOP-8M7T8S0\SQLEXPRESS
```

Do not duplicate the `Server=` prefix.

### 4.4 Local administrator session issue

For local Vite development, use `NODE_ENV=development` or leave it unset. The server only adds the cookie `Secure` flag when `NODE_ENV=production`; HTTP localhost cannot store a `Secure` cookie. After changing this setting, restart the Node process and sign in again.

---

## 11. Rollback

If the new public timetable must be hidden quickly:

1. Sign into `/admin/bus-service`.
2. Open **Settings**.
3. Disable the service, or unpublish affected trips.
4. Publish a Service Suspension announcement if appropriate.

If application deployment must be rolled back:

1. Deploy the previous static site package.
2. Restore the previous `web.config` if required.
3. Restore the previous Node application files and restart its service.
4. Do not remove the new SQL tables unless a database administrator has approved a separate, tested database rollback plan.

---

## 12. Change-control checklist

Before every published schedule change:

- [ ] Operations approved the route, stops, operating days, and times.
- [ ] Stop order and overnight timing were reviewed.
- [ ] The trip was tested in Draft.
- [ ] Only the approved trip was marked Active and Published.
- [ ] Any service alert has correct wording and expiry dates.
- [ ] The public desktop and mobile timetable were reviewed.
- [ ] The change appears in `BusAuditLogs`.

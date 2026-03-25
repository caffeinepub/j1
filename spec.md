# J1 Market Results App

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Role-based authentication (admin / user) via Caffeine authorization component
- Results data model: id, market_name, time, result_value, date
- Admin panel: CRUD operations for market results (add, edit, delete)
- User panel: read-only live results view with auto-refresh
- Login/logout flow with session management

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select `authorization` Caffeine component for role-based access
2. Generate Motoko backend with:
   - Results store (stable var array of Result records)
   - Admin-only functions: addResult, updateResult, deleteResult
   - Public function: getResults (returns all results)
   - Seed a default admin principal on first deploy
3. Frontend:
   - Login page (Internet Identity or principal-based)
   - Admin dashboard: table of results with add/edit/delete modals
   - User dashboard: card grid of live results with 5-second polling auto-refresh
   - Black background, yellow accent (#FACC15) theme throughout
   - Mobile-responsive layout

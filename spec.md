# J1

## Current State
Separate AdminDashboard and UserPanel pages. Admins auto-routed to AdminDashboard.

## Requested Changes (Diff)

### Add
- Combined tabbed view for admins with Admin Panel and User Panel tabs

### Modify
- App.tsx: admins see tabs to switch between both panels
- Regular users still only see UserPanel

### Remove
- Nothing

## Implementation Plan
1. In App.tsx, when admin, render tabs (Admin Panel / User Panel)
2. Use shadcn Tabs to switch between AdminDashboard and UserPanel
3. Users see only UserPanel as before

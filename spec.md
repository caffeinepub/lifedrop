# LIFEDROP – Smart Blood Donor & Emergency Blood Request Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Multi-role authentication system (Donor, Patient/Requester, Hospital, Blood Bank, NGO, Volunteer, Admin)
- Donor module: registration, profile, blood group, city, availability, donation history, badge/gamification system, digital ID card, health eligibility check, donation reminders
- Blood request module: emergency request form (patient name, blood group, quantity in ml, hospital, city, urgency, contact), request status workflow (Pending → Accepted → Completed)
- Hospital dashboard: registration with license number, blood inventory management (per blood group in ml), donor appointment management, donation records, admin verification with Verified badge
- Blood Bank module: inventory tracking with expiry dates, expiry alerts, prevent expired blood usage
- NGO dashboard: create/manage blood donation camps (name, location, date, expected donors, organizer contact), volunteer coordination
- Volunteer system: registration, profile (name, city, role, availability), emergency assistance, camp coordination
- Appointment system: select hospital, date, time slot; cancel/reschedule
- Smart donor search: filter by blood group, city, availability, last donation date; recommend suitable donors
- Emergency request button on homepage
- Public awareness blog section (benefits, who can donate, myths, safety)
- Admin dashboard: analytics (total donors, active requests, completed donations, city-wise demand, blood group shortages), user/hospital/blood bank/NGO/volunteer management
- Donor badge system: New Donor (1), Silver (5), Gold (10), Life Saver (25); donor leaderboard
- Digital donor ID card with name, blood group, unique ID, total donations, QR-style visual
- Multi-language support: English, Tamil, Hindi
- Notifications system (in-dashboard donation eligibility reminders)

### Modify
N/A – new project

### Remove
N/A – new project

## Implementation Plan

### Backend (Motoko)
1. Define stable data models: User, Hospital, BloodBank, NGO, Volunteer, BloodRequest, Donation, BloodInventory, Appointment, BloodCamp, Notification, BlogPost
2. Principal-based authentication with role assignment
3. CRUD functions for all entities
4. Blood inventory management with ml quantities and expiry tracking
5. Analytics aggregation function
6. Donor eligibility calculation (56-day rule from last donation date)
7. Badge computation based on donation count
8. Search/filter donors function

### Frontend (React + Tailwind)
1. Homepage: hero, mission, how it works, emergency button, donor/hospital/NGO CTAs
2. Auth pages: role-based registration and login
3. Donor dashboard: profile, history, badge, digital ID card, appointments, search
4. Patient/Requester dashboard: submit blood request, track status
5. Hospital dashboard: inventory management, appointments, verified badge
6. Blood Bank dashboard: inventory + expiry management
7. NGO dashboard: camps management, volunteer coordination
8. Volunteer dashboard: profile, assignments
9. Admin dashboard: analytics, user management, approval flows
10. Public blog/awareness section
11. Language switcher (EN / Tamil / Hindi)
12. Neon red healthcare theme, fully mobile responsive

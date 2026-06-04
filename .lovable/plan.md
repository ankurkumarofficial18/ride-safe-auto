
# AutoLink Passenger — Web Prototype

Building a **clickable mobile-first web prototype** of all 9 screens with mock data. No backend yet — pure UI so you can see and click through the product.

## What's in this prototype

All 9 screens, fully styled, navigable:

1. **Splash + Onboarding** — logo animation, 3 swipeable slides
2. **Auth** — phone number entry + 6-digit OTP (any input accepted)
3. **Home** — mock map background, user pin, nearby auto stand pins, bottom sheet listing 4 mock autos (driver name, destination, seats, fare range, ETA, Book Now), SOS FAB
4. **Booking** — pickup/drop, fare breakdown, payment method selector, 60s countdown
5. **Active Ride** — map clamped to 500m radius (visual circle overlay), driver card with masked plate, Call/Chat/SOS buttons, live fare meter, status pill
6. **Payment** — UPI/Card/Cash selector, fare summary
7. **Rating** — 5-star tap + optional feedback
8. **Ride History** — list of past mock rides → tap for receipt detail
9. **Profile** — name, avatar, emergency contacts, language toggle (Hindi/English labels), dark mode toggle, logout

## Tech (what Lovable actually supports)

- React + TanStack Start, mobile-first responsive (looks like a phone app)
- Tailwind + Material-3-inspired tokens: primary `#1B8A5A`, secondary `#1565C0`, error `#D32F2F`
- Poppins (headings) + Nunito (body) via Google Fonts
- Dark mode toggle works
- All data mocked in-memory (no Firebase, no Lovable Cloud yet)
- Map screens use a styled placeholder background with SVG pins (no real Google Maps key needed for prototype)

## Out of scope for this prototype

- Real phone OTP, real maps, real payments, real masked calls, real SMS — these need Lovable Cloud + connectors which we can wire after you approve the prototype
- This is **not Flutter** and will not build an APK — it's a web app you open in a browser (installable to home screen as a PWA later)

Approve and I'll build all 9 screens in one pass.

# Eblendz Booking

A booking website for a local college barber. Clients see live services and prices, pick an open time, and book. Every booking goes straight into the barber's Square calendar. No more booking through DMs.

> 🚧 **In progress.** Following along as I build it step by step.

## Why I built this

My friend cuts hair while going to school and working another job, and he was booking every appointment through Instagram DMs and texts. Clients asked the same price questions over and over, and slots got double-booked. I interviewed him, wrote requirements, designed the system in UML, and I'm building a site that books straight into his Square calendar.

## Tech stack

- **Next.js** (App Router) + **React**
- **TypeScript**
- **Tailwind CSS**
- **Square APIs**: Catalog, Bookings, Customers *(planned)*
- **Vercel** for hosting *(planned)*

## Features

- [ ] Live services and prices from Square
- [ ] Pick a date and see open times
- [ ] Book an appointment (studio or travel cut)
- [ ] Handles a slot getting taken mid-booking
- [ ] Gallery, about, and contact sections

## Design docs

Planned before coding, like a real software project:

- [Requirements document](docs/BarberRequirements.docx)
- [Functional & non-functional requirements](docs/barber-site-requirements.xlsx)
- UML: use case, class, and sequence diagrams *(TODO: add images)*

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What I'm learning

- File-based routing: folders in src/app become URLs.
- Git basics: commit, push, and pull when GitHub is ahead.

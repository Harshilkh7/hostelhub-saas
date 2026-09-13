# HostelHub SaaS

A multi-tenant hostel operations SaaS for managing hostels, rooms, student leave requests and complaints. Organizations are isolated at the API/database layer and users are authorized by role.

## Architecture

React + Vite + Tailwind
→ Node.js + Express
→ PostgreSQL / Supabase

Realtime: Socket.IO
Billing: Stripe Subscriptions
Authentication: JWT + RBAC

## Implemented SaaS Features

- Multi-tenant organizations with tenant context in JWTs
- Tenant-isolated hostel, room, leave, complaint and dashboard queries
- RBAC: `SUPER_ADMIN`, `HOSTEL_ADMIN`, `WARDEN`, `STUDENT`
- Authenticated Socket.IO connections scoped to `org:<organizationId>` rooms
- Realtime leave and complaint events
- Stripe Checkout subscriptions with webhook synchronization
- Free/Pro/Enterprise plan model
- Subscription status and organization billing metadata
- Audit-log schema for future administrative observability
- PostgreSQL indexes for tenant and relationship lookups

## Live Demo

Frontend: https://hostelhub-saas.vercel.app

Backend: https://hostelhub-saas.onrender.com

## Core Features

### Authentication & Authorization

- JWT-based authentication
- Secure password hashing with bcrypt
- Role-Based Access Control (RBAC)
- Protected frontend and backend routes
- Organization-aware JWT claims

### Multi-Tenancy

Each signup creates an organization and its first `HOSTEL_ADMIN` account. Every tenant-owned query is scoped using `organization_id` or a relationship back to the tenant's users/hostels.

### Admin Features

- Dashboard statistics
- Create and manage hostels and rooms
- View and process organization leave requests
- View and update organization complaints
- Realtime operational notifications
- Subscription management

### Student Features

- Student dashboard
- Apply for leave
- Track leave status
- Submit complaints
- Track complaint resolution status

### Billing

- Stripe subscription checkout
- Pro and Enterprise price configuration
- Stripe webhook signature verification
- Subscription status synchronization into PostgreSQL

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Vite
- Socket.IO browser client

### Backend

- Node.js
- Express.js
- JWT
- bcrypt
- Socket.IO
- Stripe

### Database

- PostgreSQL
- Supabase

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Supabase

## Database Upgrade

Run the migration below against the existing PostgreSQL database before deploying the new backend:

```text
backend/database/migrations/001_saas_upgrade.sql
```

The migration creates organizations/subscriptions/audit logs, adds organization IDs to existing users and hostels, migrates existing records to a demo organization, and adds useful indexes.

## Environment Variables

Backend `.env`:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173,https://hostelhub-saas.vercel.app

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

Stripe webhook endpoint:

```text
POST /api/billing/webhook
```

Configure the following Stripe events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Local Setup

```bash
git clone https://github.com/Harshilkh7/hostelhub-saas.git
cd hostelhub-saas
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

Registration accepts `name`, `email`, `password`, and optional `organizationName`. A new organization is created for the signup.

### Hostels

- `GET /api/hostels`
- `POST /api/hostels`

### Rooms

- `GET /api/rooms`
- `POST /api/rooms`
- `DELETE /api/rooms/:id`

### Leaves

- `POST /api/leaves`
- `GET /api/leaves/my`
- `GET /api/leaves`
- `PATCH /api/leaves/:id`

### Complaints

- `POST /api/complaints`
- `GET /api/complaints/my`
- `GET /api/complaints`
- `PATCH /api/complaints/:id`

### Dashboard

- `GET /api/dashboard/stats`

### Billing

- `GET /api/billing/subscription`
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`

## Realtime Events

Authenticated Socket.IO clients are joined to an organization-specific room.

Events currently emitted:

- `leave:created`
- `leave:updated`
- `complaint:created`
- `complaint:updated`

## Security Notes

- Never commit `.env` files or Stripe secrets.
- Stripe webhook signatures are verified server-side.
- Tenant IDs come from verified JWT claims rather than client-supplied organization IDs.
- Room creation verifies that the referenced hostel belongs to the current organization.

## Author

Harshil Khandelwal

GitHub: https://github.com/Harshilkh7

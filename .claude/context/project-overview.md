# FieldPro — Project Overview

**FieldPro** is a web-based field service management (FSM) platform designed for home and commercial service businesses (e.g. cleaning, HVAC, plumbing, and similar trades). It centralizes the full service-business workflow — from lead capture and estimates through job dispatch, technician tracking, invoicing, and inventory — into a single admin dashboard. The design shows a multi-tenant/branded shell (e.g. "Graceful Cleaning" in the top nav), suggesting each customer organization gets its own branded instance of the platform.

## Table of Contents

| Section                         | Description                                                                |
| ------------------------------- | -------------------------------------------------------------------------- |
| [Problem](#problem)             | The operational pain points FieldPro is built to solve                     |
| [Target Users](#target-users)   | Who uses the platform and how                                              |
| [Features](#features)           | Core modules and dashboard capabilities observed in the design             |
| [Roadmap Notes](#roadmap-notes) | Open questions, gaps, and suggested next steps based on the current design |

---

## Problem

Service businesses (cleaning, HVAC, plumbing, contracting, etc.) typically juggle disconnected tools and manual processes to run daily operations — spreadsheets for scheduling, paper or SMS-based dispatch, separate invoicing software, and no unified view of technician availability, inventory, or the sales pipeline. This creates:

- **Fragmented visibility** — no single place to see today's work orders, technician status, outstanding invoices, and inventory alerts at once.
- **Dispatch inefficiency** — unassigned work orders and idle/overbooked technicians are hard to spot without a live utilization view.
- **Leaky sales pipeline** — leads, estimates, and follow-ups fall through the cracks without a structured queue and reminders.
- **Cash flow blind spots** — outstanding invoices (commercial vs. residential) and expiring contracts/estimates aren't proactively surfaced.
- **Inventory surprises** — low stock, reorder needs, and stockouts are discovered too late, delaying jobs.

FieldPro addresses this by consolidating these workflows into one operational dashboard so office staff and managers can run the day-to-day business from a single screen.

## Target Users

- **Business owners / office managers** at small-to-midsize field service companies (cleaning, HVAC, plumbing, and similar trades) who need a daily operational snapshot.
- **Dispatchers / schedulers** who assign work orders and monitor technician status (on duty, driving, waiting, on break, off duty).
- **Sales / customer service reps** managing leads, estimates, service agreements, and follow-up calls.
- **Accounts / billing staff** tracking outstanding invoices, payments, refunds, and purchase orders.
- **Field technicians** (implied, via the "Jobs / Work Orders" and dispatch modules) who receive and complete assigned work, though the reviewed screens focus on the admin/back-office view.

## Features

Based on the sidebar navigation and dashboard screen:

**Navigation structure (left sidebar)**

- **Home**: Today, Dashboard
- **Operations**: Jobs / Work Orders, Dispatch Board, Customers, Service Locations
- **Sales**: Lead, Invoice, Estimate, Service Agreements
- **Work**: Capacity Planning, Projects
- **Payments**: Payments, Schedule Payment, Refunds
- **Purchase**: Purchase Orders, Returns, Vendors
- **Reports**: Reports
- Utility actions: global "Create New" shortcut, collapsible sidebar

**Dashboard (Overview) modules**

- **Top-level stat cards**:
  - Awaiting PO vs. Schedule (PO required / awaiting schedule counts)
  - Unassigned Work Orders (today / overdue / upcoming)
  - Outstanding Invoices (amount due, split by Commercial / Residential)
  - Contracts & Estimates (expiring/expired counts for each)
  - Inventory Alerts (low stock / reorder needed / out of stock)
  - Customer Follow Ups (new leads / callbacks / recommendations)
- **Today's Work Order** donut chart — breakdown of work orders by status (Active, Assigned, Completed) with total count.
- **Technician Utilization** horizontal bar/timeline chart — technician time allocation across On Duty, Driving, Waiting, On Break, Off Duty, and Not Working states, with a running total.
- **Today's Opportunity and Follow Up** table — a searchable, filterable, paginated list of leads/customers with columns for Customer Name, Address, Contact (phone/email), Assign To, Type (Lead / Estimate / Service Agreement), Next Follow Up date, and row-level Actions.
- Global elements: top nav search, notifications, settings, and user profile menu; date selector on the dashboard header.

## Roadmap Notes

These are open questions and gaps worth clarifying before/during build, based purely on what's visible in the current design:

- **Tenant branding**: The top nav shows a tenant name ("Graceful Cleaning") — confirm whether this is a true multi-tenant SaaS model (white-label per customer) and how tenant switching/branding should work.
- **Technician/field mobile experience**: Only the admin/back-office dashboard has been designed so far; a technician-facing mobile view (job details, status updates, navigation) is likely needed but not yet covered.
- **Drill-down screens**: Dashboard "View details / View all / View invoices / View queue / View inventory / View utilization / View work orders" links imply dedicated detail pages for each module that haven't been reviewed yet.
- **Notification logic**: The bell icon with a badge count (5) suggests a notifications system — behavior and content not yet defined.
- **Role-based access**: No visible distinction yet between roles (owner, dispatcher, tech, billing) — worth defining permission scopes per sidebar section.
- **Data freshness**: Clarify whether dashboard stats (work orders, utilization, invoices) update in real time or on a polling/refresh cycle.
- **Pagination/search on other list views**: The Opportunity table shows search, filter, and pagination patterns — confirm these are the standard patterns to replicate across Jobs, Invoices, Estimates, etc.

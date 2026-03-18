# Admin Dashboard Documentation

## Project Overview
This project is a comprehensive Admin Dashboard built with React, designed to manage various aspects of a transportation or fleet management system. It includes modules for managing users, vehicles, insurances, medallions, tickets, and more.

## Technology Stack
- **Frontend Framework**: React (v18.2.0)
- **Language**: TypeScript (v4.9.5)
- **UI Component Library**: Ant Design (v5.23.0)
- **State Management**: Redux Toolkit (v1.9.7)
- **Routing**: React Router DOM (v6.16.0)
- **Form Handling**: React Hook Form (v7.46.1)
- **HTTP Client**: Axios (v1.5.0)
- **Build Tool**: CRACO (Create React App Configuration Override)
- **PDF Generation**: React-PDF / React-to-Print

> [!IMPORTANT]
> This project exclusively uses **Ant Design** for UI components. Do not use Tailwind CSS, Lucide-React, or other styling libraries unless explicitly authorized.

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd brta360-reactjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

## Folder Structure
- `src/app`: Contains the main application logic.
  - `atoms`: Basic UI components (buttons, inputs, etc.).
  - `molecules`: Composite components.
  - `modules`: Feature-specific modules (business logic + UI).
  - `pages`: Page-level components corresponding to routes.
- `src/routing`: Route definitions and configuration.
- `src/utils`: Utility functions and helpers.
- `src/redux`: Redux store configuration.

## Detailed Documentation
- [Routes and Permissions](docs/ROUTES.md)
- [UI Components & Design System](docs/UI_COMPONENTS.md)

### Module Documentation
- [Users Management](docs/modules/USERS.md)
- [Insurance Management](docs/modules/INSURANCE.md)
- [Medallions Management](docs/modules/MEDALLIONS.md)
- [Vehicles Management](docs/modules/VEHICLES.md)
- [Tickets Management](docs/modules/TICKETS.md)
- [Drivers Management](docs/modules/DRIVERS.md)
- [Corporations Management](docs/modules/CORPORATIONS.md)
- [Members Management](docs/modules/MEMBERS.md)
- [Roles Management](docs/modules/ROLES.md)
- [Affiliations Management](docs/modules/AFFILIATIONS.md)

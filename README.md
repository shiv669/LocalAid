# 🆘 LocalAid Connect# LocalAid Connect 



> **Connecting Communities in Times of Crisis**[![Appwrite Hacktoberfest 2025](https://img.shields.io/badge/Appwrite-Hacktoberfest%202025-FD366E)](https://apwr.dev/hf2025-hackathon)

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)

A real-time emergency response platform that connects people in need with local helpers during natural disasters, emergencies, and community crises. Built with Next.js 16 and Appwrite for Hacktoberfest 2025.[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FD366E)](https://appwrite.io/)

![LocalAid Connect](https://img.shields.io/badge/Built%20with-Appwrite-F02E65?style=for-the-badge&logo=appwrite)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)##  Overview

![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)**LocalAid Connect** is a real-time community emergency response platform that bridges the gap between people in need and those who can help during crises, natural disasters, and community emergencies. Built for the Appwrite Hacktoberfest 2025 Hackathon.



## 📋 Table of Contents### The Problem



- [Features](#-features)During emergencies and natural disasters, there's often chaos and confusion. People who need help can't easily find those who can provide it, and vice versa. Social media becomes cluttered, and critical information gets lost in the noise. LocalAid Connect provides a focused, organized, and verified way to coordinate community emergency response.

- [Quick Start](#-quick-start)

- [Project Structure](#-project-structure)### The Solution

- [Technology Stack](#-technology-stack)

- [Appwrite Setup](#-appwrite-setup)A modern web application that:

- [Environment Variables](#-environment-variables)-  Enables real-time emergency request posting

- [Deployment Guide](#-deployment-guide)-  Matches requests with available resources based on location and type

- [Database Schema](#-database-schema)-  Provides live updates and notifications

- [Components](#-components)-  Ensures verified and authentic help coordination

- [Contributing](#-contributing)-  Works seamlessly across all devices

- [License](#-license)

##  Features

## 🌟 Features

### Core Features

### For People in Need (Seekers)

- 🚨 **Emergency Request System** - Post urgent requests for help with priority levels (Low, Medium, High, Critical)1. **Emergency Request System**

- 📍 **GPS Location Detection** - Automatic location capture for accurate matching   - Post urgent help requests (Medical, Shelter, Food, Transport)

- ⚡ **Real-time Notifications** - Live updates when help is matched   - Priority-based categorization (High, Medium, Low)

- 🏥 **Multiple Categories** - Medical, Shelter, Food, Transport, and more   - Location-based tracking

- 🔔 **Status Tracking** - Track your request status in real-time   - Real-time status updates



### For Helpers (Resource Providers)2. **Resource Matching**

- ✨ **Resource Listing** - Offer available resources to help others   - Intelligent matching algorithm

- 🎯 **Smart Proximity Matching** - Get matched with nearby requests (25km radius)   - Distance-based filtering (within 10km radius)

- 📊 **Interactive Dashboard** - View all active requests and available resources   - Type-specific resource allocation

- 🔄 **Availability Toggle** - Control when you're available to help   - Availability tracking

- 📍 **Distance Calculation** - See how far away requests are from you

3. **Real-time Updates**

### Core Platform Features   - Live notification system

- 🔐 **Email/Password Authentication** - Secure and unlimited (recommended)   - Instant status changes

- ✉️ **Email Verification** - Verify accounts via email   - Real-time request tracking

- 👤 **User Profiles** - Role-based profiles (Helper/Seeker/Both)   - WebSocket-powered updates

- 🗺️ **Location-Based Matching** - Intelligent proximity algorithm

- 🔄 **Real-time WebSocket Updates** - Live sync using Appwrite Realtime4. **User Authentication**

- 🎨 **Glassmorphism UI** - Beautiful, modern design with smooth animations   - Secure authentication

- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop   - User profiles

- 🌙 **Dark Theme Optimized** - Eye-friendly dark mode   - Role-based access (Helper, Seeker, Admin)

   - Verification system

## 🚀 Quick Start

5. **Modern UI/UX**

### Prerequisites   - Glass morphism design

- Node.js 18 or higher   - Smooth animations

- An Appwrite account ([Sign up free](https://cloud.appwrite.io))   - Responsive layout

- npm or yarn package manager   - Dark mode optimized

   - Mobile-first approach

### Installation

##  Tech Stack

1. **Clone the repository**

```bash### Frontend

git clone https://github.com/shiv669/LocalAid.git- **Framework:** Next.js 16.0 (React 19.2)

cd LocalAid- **Language:** TypeScript 5.0

```- **Styling:** Tailwind CSS 4.0

- **UI Components:** 

2. **Install dependencies**  - Headless UI

```bash  - Heroicons

npm install  - Framer Motion (animations)

```  - Lucide Icons

- **Notifications:** React Hot Toast

3. **Configure environment variables**

### Backend (Appwrite Services)

Create a `.env.local` file in the root directory:- **Authentication:** Appwrite Auth

```env- **Database:** Appwrite Databases

NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id- **Storage:** Appwrite Storage

NEXT_PUBLIC_APPWRITE_DATABASE_ID=localaid_db- **Functions:** Appwrite Functions

NEXT_PUBLIC_APPWRITE_STORAGE_ID=localaid_storage- **Real-time:** Appwrite Realtime

NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1- **Messaging:** Appwrite Messaging

- **Deployment:** Appwrite Sites

NEXT_PUBLIC_COLLECTION_REQUESTS=requests

NEXT_PUBLIC_COLLECTION_RESOURCES=resources### Development Tools

NEXT_PUBLIC_COLLECTION_USERS=users- **Package Manager:** npm

NEXT_PUBLIC_COLLECTION_MATCHES=matches- **Linting:** ESLint

```- **Code Quality:** TypeScript strict mode



4. **Set up Appwrite** (see [Appwrite Setup](#-appwrite-setup) below)##  Getting Started



5. **Run the development server**### Prerequisites

```bash

npm run dev- Node.js 18.0 or higher

```- npm or yarn

- An Appwrite Cloud account

6. **Open your browser**

### Installation

Navigate to [http://localhost:3000](http://localhost:3000)

1. **Clone the repository**

## 🏗️ Project Structure   \\\ash

   git clone https://github.com/shiv669/LocalAid.git

```   cd localaid-connect

localaid-connect/   \\\

├── src/

│   ├── app/2. **Install dependencies**

│   │   ├── layout.tsx              # Root layout with metadata   \\\ash

│   │   ├── page.tsx                # Main dashboard & landing page   npm install

│   │   ├── globals.css             # Global styles & theme   \\\

│   │   ├── glass-styles.css        # Glassmorphism effects

│   │   └── verify/3. **Set up environment variables**

│   │       └── page.tsx            # Email verification page   

│   ├── components/   Create a \.env.local\ file in the root directory:

│   │   ├── UserProfile.tsx         # Profile management   \\\env

│   │   ├── EmergencyRequestForm.tsx # Create emergency requests   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

│   │   ├── ResourceForm.tsx        # List available resources   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id

│   │   ├── ResourceMatcher.tsx     # Match requests with resources   NEXT_PUBLIC_APPWRITE_STORAGE_ID=your_storage_bucket_id

│   │   ├── RealtimeUpdates.tsx     # Live notification panel   \\\

│   │   └── ui/

│   │       ├── glass-components.tsx # Reusable glass UI components4. **Set up Appwrite**

│   │       ├── blur-fade.tsx       # Animation component

│   │       └── gradient-background.tsx # Animated background   Create the following collections in your Appwrite database:

│   ├── lib/

│   │   ├── appwrite.ts             # Appwrite client initialization   **Collection: requests**

│   │   ├── database.ts             # Database service & operations   \\\

│   │   └── utils.ts                # Utility functions   - userId (string, required)

│   └── types/   - type (string, required) - enum: MEDICAL, SHELTER, FOOD, TRANSPORT

│       └── index.ts                # TypeScript type definitions   - description (string, required)

├── public/                         # Static assets   - location (string, required) - JSON object

├── out/                           # Production build output   - status (string, required) - enum: PENDING, MATCHED, COMPLETED

├── .env.local                     # Environment variables (create this)   - priority (string, required) - enum: HIGH, MEDIUM, LOW

├── next.config.ts                 # Next.js configuration   - createdAt (string, required)

├── tailwind.config.ts             # Tailwind CSS config   - updatedAt (string, required)

├── tsconfig.json                  # TypeScript config   \\\

└── package.json                   # Dependencies

```   **Collection: resources**

   \\\

## 🛠️ Technology Stack   - userId (string, required)

   - type (string, required) - enum: MEDICAL, SHELTER, FOOD, TRANSPORT

### Frontend   - description (string, required)

- **Framework:** Next.js 16 (React 19, App Router)   - location (string, required) - JSON object

- **Language:** TypeScript   - availability (boolean, required)

- **Styling:** Tailwind CSS 4   - createdAt (string, required)

- **Animations:** Framer Motion   - updatedAt (string, required)

- **Icons:** Lucide React   \\\

- **Notifications:** React Hot Toast

   **Collection: users**

### Backend (Appwrite BaaS)   \\\

- **Authentication:** Appwrite Auth (Email/Password)   - phone (string, required)

- **Database:** Appwrite Database (NoSQL)   - name (string, required)

- **Real-time:** Appwrite Realtime (WebSocket)   - isVerified (boolean, required)

- **Storage:** Appwrite Storage (for future features)   - role (string, required) - enum: HELPER, SEEKER, ADMIN

   - createdAt (string, required)

### UI/UX Libraries   - updatedAt (string, required)

- **Design System:** Custom Glassmorphism Components   \\\

- **Class Utilities:** clsx, tailwind-merge

- **Variants:** class-variance-authority   **Collection: matches**

- **Effects:** canvas-confetti   \\\

   - requestId (string, required)

## 🔧 Appwrite Setup   - resourceId (string, required)

   - status (string, required)

### Step 1: Create Appwrite Project   - createdAt (string, required)

   - updatedAt (string, required)

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) and sign up/login   \\\

2. Create a new project called "LocalAid Connect"

3. Copy your **Project ID** (you'll need this for `.env.local`)5. **Run the development server**

   \\\ash

### Step 2: Configure Authentication   npm run dev

   \\\

1. Go to **Auth** → **Settings**

2. Enable **Email/Password** authentication   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. Under **Security** → Add your domain to allowed origins:

   - For development: `http://localhost:3000`### Build for Production

   - For production: `https://yourdomain.com`

\\\ash

### Step 3: Create Databasenpm run build

npm start

1. Go to **Databases** → Create database\\\

2. Database ID: `localaid_db`

3. Database Name: `LocalAid Database`##  Deployment



### Step 4: Create Collections### Deploy to Appwrite Sites



Create 4 collections with the following schemas:1. **Build your application**

   \\\ash

#### Collection 1: `users` (User Profiles)   npm run build

- **Collection ID:** `users`   \\\

- **Attributes:**

  - `userId` (String, 255, Required) - Unique2. **Deploy to Appwrite Sites**

  - `name` (String, 255, Required)   

  - `phone` (String, 20, Required)   a. Go to your Appwrite Console

  - `role` (String, 50, Required) - "seeker", "helper", or "both"   

  - `isVerified` (Boolean, Required, Default: false)   b. Navigate to your project

  - `createdAt` (DateTime, Required)   

  - `updatedAt` (DateTime, Required)   c. Click on "Sites" in the left sidebar

   

**Indexes:**   d. Click "Add Site"

- Key: `userId_index`, Type: `key`, Attributes: `userId` (ASC)   

   e. Connect your GitHub repository

**Permissions:**   

- Create: Users   f. Configure build settings:

- Read: Users      - **Build Command:** \

- Update: Userspm run build\

- Delete: Users      - **Output Directory:** \out\ or \.next\

      - **Install Command:** \

#### Collection 2: `requests` (Emergency Requests)pm install\

- **Collection ID:** `requests`   

- **Attributes:**   g. Add environment variables in Appwrite Sites dashboard

  - `userId` (String, 255, Required)   

  - `type` (String, 50, Required) - "medical", "shelter", "food", "transport"   h. Deploy!

  - `description` (String, 1000, Required)

  - `priority` (String, 20, Required) - "low", "medium", "high", "critical"3. **Your site will be available at:**

  - `location` (String, 2000, Required) - JSON string   \\\

  - `status` (String, 20, Required, Default: "active")   https://your-project-name.appwrite.network

  - `createdAt` (DateTime, Required)   \\\

  - `updatedAt` (DateTime, Required)

### Alternative: Deploy to Vercel

**Indexes:**

- Key: `status_index`, Type: `key`, Attributes: `status` (ASC)\\\ash

- Key: `userId_index`, Type: `key`, Attributes: `userId` (ASC)npm i -g vercel

vercel

**Permissions:**\\\

- Create: Users

- Read: Any##  Project Structure

- Update: Users

- Delete: Users\\\

localaid-connect/

#### Collection 3: `resources` (Available Resources) src/

- **Collection ID:** `resources`    app/                    # Next.js app directory

- **Attributes:**       layout.tsx         # Root layout

  - `userId` (String, 255, Required)       page.tsx           # Home page

  - `type` (String, 50, Required)       globals.css        # Global styles

  - `description` (String, 1000, Required)    components/            # React components

  - `quantity` (String, 100, Required)       AuthButton.tsx     # Authentication component

  - `location` (String, 2000, Required) - JSON string       EmergencyRequestForm.tsx

  - `available` (Boolean, Required, Default: true)       ResourceForm.tsx

  - `createdAt` (DateTime, Required)       ResourceMatcher.tsx

  - `updatedAt` (DateTime, Required)       RealtimeUpdates.tsx

       UserProfile.tsx

**Indexes:**       ui/                # UI components

- Key: `available_index`, Type: `key`, Attributes: `available` (ASC)    lib/                   # Utility functions

- Key: `userId_index`, Type: `key`, Attributes: `userId` (ASC)       appwrite.ts        # Appwrite configuration

       database.ts        # Database services

**Permissions:**       utils.ts           # Helper functions

- Create: Users    types/                 # TypeScript types

- Read: Any        index.ts

- Update: Users public/                    # Static assets

- Delete: Users .env.local                 # Environment variables

 package.json              # Dependencies

#### Collection 4: `matches` (Request-Resource Matches) tsconfig.json             # TypeScript config

- **Collection ID:** `matches` tailwind.config.ts        # Tailwind config

- **Attributes:** README.md                 # This file

  - `requestId` (String, 255, Required)\\\

  - `resourceId` (String, 255, Required)

  - `status` (String, 20, Required, Default: "pending")##  Key Components

  - `distance` (Integer, Required)

  - `createdAt` (DateTime, Required)### Emergency Request Form

  - `updatedAt` (DateTime, Required)Allows users to create emergency requests with type, description, priority, and location.



**Indexes:**### Resource Matcher

- Key: `requestId_index`, Type: `key`, Attributes: `requestId` (ASC)Intelligently matches emergency requests with available resources based on:

- Key: `resourceId_index`, Type: `key`, Attributes: `resourceId` (ASC)- Type matching

- Geographic proximity (10km radius)

**Permissions:**- Availability status

- Create: Users

- Read: Users### Realtime Updates

- Update: UsersWebSocket-powered component that shows live updates for:

- Delete: Users- New emergency requests

- Status changes

### Step 5: Create Storage Bucket (Optional - for future use)- Matches created



1. Go to **Storage** → Create bucket### User Authentication

2. Bucket ID: `localaid_storage`Handles user sign-in, sign-up, and profile management.

3. Permissions: Same as collections

##  Configuration

## 🌍 Environment Variables

### Appwrite Setup

Create a `.env.local` file with these variables:

1. Create a new project in Appwrite Cloud

```env2. Enable Authentication (Email/Password or Phone)

# Appwrite Configuration3. Create a database with the collections mentioned above

NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here4. Create a storage bucket for verification documents

NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v15. Set up appropriate permissions for each collection

NEXT_PUBLIC_APPWRITE_DATABASE_ID=localaid_db6. Copy your Project ID, Database ID, and Storage ID to \.env.local\

NEXT_PUBLIC_APPWRITE_STORAGE_ID=localaid_storage

### Environment Variables

# Collection IDs

NEXT_PUBLIC_COLLECTION_REQUESTS=requests\\\env

NEXT_PUBLIC_COLLECTION_RESOURCES=resourcesNEXT_PUBLIC_APPWRITE_PROJECT_ID=    # Your Appwrite project ID

NEXT_PUBLIC_COLLECTION_USERS=usersNEXT_PUBLIC_APPWRITE_DATABASE_ID=   # Your database ID

NEXT_PUBLIC_COLLECTION_MATCHES=matchesNEXT_PUBLIC_APPWRITE_STORAGE_ID=    # Your storage bucket ID

```\\\



**Important:** Never commit `.env.local` to version control!##  Contributing



## 🚀 Deployment GuideContributions are welcome! Please feel free to submit a Pull Request.



### Option 1: Deploy to Vercel (Recommended)1. Fork the repository

2. Create your feature branch (\git checkout -b feature/AmazingFeature\)

1. **Push your code to GitHub**3. Commit your changes (\git commit -m 'Add some AmazingFeature'\)

```bash4. Push to the branch (\git push origin feature/AmazingFeature\)

git add .5. Open a Pull Request

git commit -m "Ready for deployment"

git push origin main##  Code of Conduct

```

### Our Pledge

2. **Deploy to Vercel**

   - Go to [vercel.com](https://vercel.com)We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

   - Import your GitHub repository

   - Add environment variables from `.env.local`### Our Standards

   - Deploy!

Examples of behavior that contributes to a positive environment:

3. **Update Appwrite Settings**

   - Add your Vercel domain to Appwrite's allowed origins- Using welcoming and inclusive language

   - Example: `https://yourapp.vercel.app`- Being respectful of differing viewpoints and experiences

- Gracefully accepting constructive criticism

### Option 2: Deploy to Netlify- Focusing on what is best for the community

- Showing empathy towards other community members

1. **Build the project**

```bashExamples of unacceptable behavior:

npm run build

```- The use of sexualized language or imagery

- Trolling, insulting or derogatory comments, and personal or political attacks

2. **Deploy to Netlify**- Public or private harassment

   - Go to [netlify.com](https://netlify.com)- Publishing others' private information without explicit permission

   - Drag and drop the `out` folder- Other conduct which could reasonably be considered inappropriate

   - Or connect your GitHub repo

   - Add environment variables### Enforcement

   - Deploy!

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team. All complaints will be reviewed and investigated promptly and fairly.

3. **Configure Netlify**

   - Build command: `npm run build`### Attribution

   - Publish directory: `out`

   - Add environment variablesThis Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.0.



### Option 3: Deploy Static Build to Any Host##  License



1. **Build the project**This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```bash

npm run build##  Hackathon Submission

```

This project was created for the **Appwrite Hacktoberfest 2025 Hackathon**.

2. **Upload the `out` folder** to any static hosting service:

   - GitHub Pages- **Event:** Appwrite Hacktoberfest 2025

   - Cloudflare Pages- **Category:** Open Source

   - AWS S3 + CloudFront- **Timeline:** October 1-31, 2025

   - Firebase Hosting- **Built with:** Appwrite, Next.js, TypeScript, Tailwind CSS

   - Any web server

##  Acknowledgments

3. **Configure your host**

   - Ensure all requests route to `index.html` for SPA routing- [Appwrite](https://appwrite.io/) for providing amazing backend services

   - The `_redirects` file handles this automatically on compatible hosts- [Next.js](https://nextjs.org/) for the powerful React framework

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

### Important Deployment Notes- [Hacktoberfest](https://hacktoberfest.com/) for promoting open source



⚠️ **After deployment:**##  Contact

1. Update Appwrite's allowed origins to include your production URL

2. Test email verification with your production domain**Shivam** - [@shiv669](https://github.com/shiv669)

3. Ensure all environment variables are set correctly

4. Test real-time features work on production**Project Link:** [https://github.com/shiv669/LocalAid](https://github.com/shiv669/LocalAid)



### Troubleshooting Deployment---



**Problem: "Page not found" error**<div align="center">

- Solution: Ensure `trailingSlash: true` is set in `next.config.ts`  <strong>Built with  for Appwrite Hacktoberfest 2025</strong>

- Check that your host supports SPA routing</div>

- Verify the `_redirects` file is included in deployment

**Problem: Environment variables not working**
- Solution: Ensure all variables start with `NEXT_PUBLIC_`
- Rebuild after adding environment variables
- Check your hosting platform's environment variable settings

**Problem: Real-time features not working**
- Solution: Add your production domain to Appwrite's allowed origins
- Check WebSocket connections in browser DevTools
- Verify Appwrite endpoint URL is correct

## 📊 Database Schema

### Users Collection
```typescript
{
  userId: string;      // Appwrite user ID
  name: string;        // User's full name
  phone: string;       // Phone number (max 20 chars)
  role: 'seeker' | 'helper' | 'both';
  isVerified: boolean; // Email verification status
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Requests Collection
```typescript
{
  userId: string;
  type: 'medical' | 'shelter' | 'food' | 'transport';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'active' | 'matched' | 'completed' | 'cancelled';
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Resources Collection
```typescript
{
  userId: string;
  type: string;
  description: string;
  quantity: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  available: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Matches Collection
```typescript
{
  requestId: string;
  resourceId: string;
  status: 'pending' | 'accepted' | 'completed';
  distance: number;    // Distance in km
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

## 🎯 Components

### Core Components

#### `page.tsx`
Main dashboard and landing page with integrated authentication modal.

#### `UserProfile.tsx`
- Display and edit user profiles
- Role selection (Seeker, Helper, Both)
- Phone number management
- Email verification status

#### `EmergencyRequestForm.tsx`
- Create emergency requests
- Type selection (Medical, Shelter, Food, Transport)
- Priority levels (Low, Medium, High, Critical)
- GPS location capture
- Beautiful glass card UI

#### `ResourceForm.tsx`
- List available resources
- Type and quantity input
- Availability toggle
- GPS location capture

#### `ResourceMatcher.tsx`
- Match emergency requests with resources
- Filter by type
- Distance calculation
- Color-coded priority badges
- Real-time updates

#### `RealtimeUpdates.tsx`
- Live WebSocket notifications
- Connection status indicator
- Color-coded update types
- Time ago display
- Auto-scroll functionality

### UI Components

#### `glass-components.tsx`
- `GlassButton` - 3D animated button with glass effect
- `GlassInput` - Input with icon support and animations
- `GlassCard` - Container with backdrop blur

#### `blur-fade.tsx`
- Smooth fade and blur in animations
- Configurable delay and duration

#### `gradient-background.tsx`
- Animated SVG gradient background
- Smooth color transitions

## 🎨 Use Cases

### During Natural Disasters
- 🌊 Request emergency shelter during floods
- 🔥 Find food and water during wildfires
- 🌪️ Get medical supplies after storms
- 🚑 Coordinate rescue and evacuation efforts

### Community Emergencies
- 👵 Help elderly neighbors with groceries
- 🚗 Share transportation during fuel shortages
- ⚡ Pool resources during power outages
- 🏥 Coordinate medical support

### Daily Community Support
- 🍲 Share extra food with those in need
- 🏠 Offer temporary shelter
- 🚗 Provide rides to medical appointments
- 🤝 Build stronger, more resilient communities

## 🤝 Contributing

We welcome contributions for Hacktoberfest 2025! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Ideas
- [ ] Add map visualization (Mapbox/Google Maps integration)
- [ ] Implement direct messaging between users
- [ ] Add photo upload for request verification
- [ ] Create admin dashboard for monitoring
- [ ] Add multi-language support (i18n)
- [ ] Implement push notifications
- [ ] Add SMS notifications via Twilio
- [ ] Create mobile app with React Native
- [ ] Add analytics dashboard
- [ ] Implement user ratings and reviews
- [ ] Add emergency contact management
- [ ] Create resource availability calendar

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for our list of amazing contributors!

## 📜 License

MIT License - feel free to use this project for learning, building, or helping your community!

## 🙏 Acknowledgments

- Built for **Hacktoberfest 2025** 🎃
- Powered by [Appwrite](https://appwrite.io) - Amazing open-source BaaS
- Styled with [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- Built with [Next.js](https://nextjs.org) - The React Framework
- Icons by [Lucide](https://lucide.dev) - Beautiful & consistent icons
- Animations by [Framer Motion](https://www.framer.com/motion) - Production-ready animations

## 🆘 Support & Community

- **Issues:** [GitHub Issues](https://github.com/shiv669/LocalAid/issues)
- **Discussions:** [GitHub Discussions](https://github.com/shiv669/LocalAid/discussions)

## 🌟 Show Your Support

If this project helps you or your community, please give it a ⭐ on GitHub!

---

**Built with ❤️ for communities in need during Hacktoberfest 2025**

*Together, we can make a difference when it matters most.*

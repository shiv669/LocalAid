# LocalAid Connect 

[![Appwrite Hacktoberfest 2025](https://img.shields.io/badge/Appwrite-Hacktoberfest%202025-FD366E)](https://apwr.dev/hf2025-hackathon)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FD366E)](https://appwrite.io/)

##  Overview

**LocalAid Connect** is a real-time community emergency response platform that bridges the gap between people in need and those who can help during crises, natural disasters, and community emergencies. Built for the Appwrite Hacktoberfest 2025 Hackathon.

### The Problem

During emergencies and natural disasters, there's often chaos and confusion. People who need help can't easily find those who can provide it, and vice versa. Social media becomes cluttered, and critical information gets lost in the noise. LocalAid Connect provides a focused, organized, and verified way to coordinate community emergency response.

### The Solution

A modern web application that:
-  Enables real-time emergency request posting
-  Matches requests with available resources based on location and type
-  Provides live updates and notifications
-  Ensures verified and authentic help coordination
-  Works seamlessly across all devices

##  Features

### Core Features

1. **Emergency Request System**
   - Post urgent help requests (Medical, Shelter, Food, Transport)
   - Priority-based categorization (High, Medium, Low)
   - Location-based tracking
   - Real-time status updates

2. **Resource Matching**
   - Intelligent matching algorithm
   - Distance-based filtering (within 10km radius)
   - Type-specific resource allocation
   - Availability tracking

3. **Real-time Updates**
   - Live notification system
   - Instant status changes
   - Real-time request tracking
   - WebSocket-powered updates

4. **User Authentication**
   - Secure authentication
   - User profiles
   - Role-based access (Helper, Seeker, Admin)
   - Verification system

5. **Modern UI/UX**
   - Glass morphism design
   - Smooth animations
   - Responsive layout
   - Dark mode optimized
   - Mobile-first approach

##  Tech Stack

### Frontend
- **Framework:** Next.js 16.0 (React 19.2)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0
- **UI Components:** 
  - Headless UI
  - Heroicons
  - Framer Motion (animations)
  - Lucide Icons
- **Notifications:** React Hot Toast

### Backend (Appwrite Services)
- **Authentication:** Appwrite Auth
- **Database:** Appwrite Databases
- **Storage:** Appwrite Storage
- **Functions:** Appwrite Functions
- **Real-time:** Appwrite Realtime
- **Messaging:** Appwrite Messaging
- **Deployment:** Appwrite Sites

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Code Quality:** TypeScript strict mode

##  Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- An Appwrite Cloud account

### Installation

1. **Clone the repository**
   \\\ash
   git clone https://github.com/shiv669/LocalAid.git
   cd localaid-connect
   \\\

2. **Install dependencies**
   \\\ash
   npm install
   \\\

3. **Set up environment variables**
   
   Create a \.env.local\ file in the root directory:
   \\\env
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_STORAGE_ID=your_storage_bucket_id
   \\\

4. **Set up Appwrite**

   Create the following collections in your Appwrite database:

   **Collection: requests**
   \\\
   - userId (string, required)
   - type (string, required) - enum: MEDICAL, SHELTER, FOOD, TRANSPORT
   - description (string, required)
   - location (string, required) - JSON object
   - status (string, required) - enum: PENDING, MATCHED, COMPLETED
   - priority (string, required) - enum: HIGH, MEDIUM, LOW
   - createdAt (string, required)
   - updatedAt (string, required)
   \\\

   **Collection: resources**
   \\\
   - userId (string, required)
   - type (string, required) - enum: MEDICAL, SHELTER, FOOD, TRANSPORT
   - description (string, required)
   - location (string, required) - JSON object
   - availability (boolean, required)
   - createdAt (string, required)
   - updatedAt (string, required)
   \\\

   **Collection: users**
   \\\
   - phone (string, required)
   - name (string, required)
   - isVerified (boolean, required)
   - role (string, required) - enum: HELPER, SEEKER, ADMIN
   - createdAt (string, required)
   - updatedAt (string, required)
   \\\

   **Collection: matches**
   \\\
   - requestId (string, required)
   - resourceId (string, required)
   - status (string, required)
   - createdAt (string, required)
   - updatedAt (string, required)
   \\\

5. **Run the development server**
   \\\ash
   npm run dev
   \\\

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

\\\ash
npm run build
npm start
\\\

##  Deployment

### Deploy to Appwrite Sites

1. **Build your application**
   \\\ash
   npm run build
   \\\

2. **Deploy to Appwrite Sites**
   
   a. Go to your Appwrite Console
   
   b. Navigate to your project
   
   c. Click on "Sites" in the left sidebar
   
   d. Click "Add Site"
   
   e. Connect your GitHub repository
   
   f. Configure build settings:
      - **Build Command:** \
pm run build\
      - **Output Directory:** \out\ or \.next\
      - **Install Command:** \
pm install\
   
   g. Add environment variables in Appwrite Sites dashboard
   
   h. Deploy!

3. **Your site will be available at:**
   \\\
   https://your-project-name.appwrite.network
   \\\

### Alternative: Deploy to Vercel

\\\ash
npm i -g vercel
vercel
\\\

##  Project Structure

\\\
localaid-connect/
 src/
    app/                    # Next.js app directory
       layout.tsx         # Root layout
       page.tsx           # Home page
       globals.css        # Global styles
    components/            # React components
       AuthButton.tsx     # Authentication component
       EmergencyRequestForm.tsx
       ResourceForm.tsx
       ResourceMatcher.tsx
       RealtimeUpdates.tsx
       UserProfile.tsx
       ui/                # UI components
    lib/                   # Utility functions
       appwrite.ts        # Appwrite configuration
       database.ts        # Database services
       utils.ts           # Helper functions
    types/                 # TypeScript types
        index.ts
 public/                    # Static assets
 .env.local                 # Environment variables
 package.json              # Dependencies
 tsconfig.json             # TypeScript config
 tailwind.config.ts        # Tailwind config
 README.md                 # This file
\\\

##  Key Components

### Emergency Request Form
Allows users to create emergency requests with type, description, priority, and location.

### Resource Matcher
Intelligently matches emergency requests with available resources based on:
- Type matching
- Geographic proximity (10km radius)
- Availability status

### Realtime Updates
WebSocket-powered component that shows live updates for:
- New emergency requests
- Status changes
- Matches created

### User Authentication
Handles user sign-in, sign-up, and profile management.

##  Configuration

### Appwrite Setup

1. Create a new project in Appwrite Cloud
2. Enable Authentication (Email/Password or Phone)
3. Create a database with the collections mentioned above
4. Create a storage bucket for verification documents
5. Set up appropriate permissions for each collection
6. Copy your Project ID, Database ID, and Storage ID to \.env.local\

### Environment Variables

\\\env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=    # Your Appwrite project ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID=   # Your database ID
NEXT_PUBLIC_APPWRITE_STORAGE_ID=    # Your storage bucket ID
\\\

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\git checkout -b feature/AmazingFeature\)
3. Commit your changes (\git commit -m 'Add some AmazingFeature'\)
4. Push to the branch (\git push origin feature/AmazingFeature\)
5. Open a Pull Request

##  Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior:

- The use of sexualized language or imagery
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team. All complaints will be reviewed and investigated promptly and fairly.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.0.

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Hackathon Submission

This project was created for the **Appwrite Hacktoberfest 2025 Hackathon**.

- **Event:** Appwrite Hacktoberfest 2025
- **Category:** Open Source
- **Timeline:** October 1-31, 2025
- **Built with:** Appwrite, Next.js, TypeScript, Tailwind CSS

##  Acknowledgments

- [Appwrite](https://appwrite.io/) for providing amazing backend services
- [Next.js](https://nextjs.org/) for the powerful React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Hacktoberfest](https://hacktoberfest.com/) for promoting open source

##  Contact

**Shivam** - [@shiv669](https://github.com/shiv669)

**Project Link:** [https://github.com/shiv669/LocalAid](https://github.com/shiv669/LocalAid)

---

<div align="center">
  <strong>Built with  for Appwrite Hacktoberfest 2025</strong>
</div>

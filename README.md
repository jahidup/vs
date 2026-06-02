# Sankalp Digital Pathshala - Digital Educational Ecosystem

An enterprise-grade dynamic web application combining academic excellence, future-skills education (AI, Robotics, Drones, IoT), local inquiry tracking, and a smart conversational AI chatbot.

## Core Features
1. **Interactive Educational Platform**: Immersive multi-page user journeys with high-performance CSS and GSAP animations.
2. **AI-Assistant Suite**: Complete helper API endpoints (`/api/chat`, `/api/solve-question`, `/api/study-plan`, `/api/lead-scoring`, `/api/image-question`) driven by Google Gemini.
3. **Advanced Admin Panel**: Complete CRM dashboard to manage leads, upload to gallery, manage events, update syllabus text, and view real-time analytical reports.
4. **Resilient Architecture**: Automatic database and AI service failovers. If MongoDB or Gemini credentials are not supplied, the system seamlessly boots with a local file-system JSON database and mock rule-based response triggers.
5. **Full SEO Integration**: Programmatic meta configuration, local business JSON-LD schemas, course structures, and automated sitemaps.

## Installation & Setup

1. **Prerequisites**: Ensure [Node.js](https://nodejs.org) (v18+) is installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Duplicate `.env.example` to `.env` and fill out your database cluster links and API keys:
   ```bash
   cp .env.example .env
   ```
4. **Run Locally**:
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your web browser.

5. **Admin Access**:
   Login page: `http://localhost:3000/admin`
   Default Credentials:
   - Email: `admin@sankalppathshala.com`
   - Password: `admin123` (Set in `.env`)

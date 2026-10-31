# 🌱 Agriculture Pipeline Survey & Friction Loss Report System

An engineering-grade web application designed for agricultural irrigation planning, pipeline surveying, friction loss calculation, and pump head requirement analysis. Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Supabase (PostgreSQL)**.

---

## 🚀 Key Features

- **Automated Hydraulic Friction Loss Calculation**: Pre-calibrated friction loss factors for standard agricultural irrigation piping (PVC, HDPE) and fittings (Bends, Foot Valves, Non-Return Valves, Gate Valves, Tees, and Reducers).
- **Total Dynamic Head (TDH) Sizing**: Accurately computes total operating pump head ($H_{\text{total}} = H_{\text{static}} + H_{\text{friction}}$) required for sizing submersible and centrifugal farm pumps.
- **Client & Field Survey Management**: Full CRUD interface for creating, viewing, updating, and managing surveys organized by customer, village/location, and discharge requirements.
- **Instant Client-Ready PDF Generation**: One-click generation of branded, structured survey reports using `jspdf` and `jspdf-autotable` suitable for farmers, field engineers, and irrigation contractors.
- **Native Mobile & Web Share**: Direct PDF sharing via Web Share API on mobile devices and laptops.
- **Authentication & Secure Cloud Persistence**: JWT-based session security integrated with Supabase PostgreSQL for cloud storage of surveys and user accounts.
- **High-Contrast, Accessible UI**: Crisp light-theme typography tailored for outdoor field tablets and workstations alike.

---

## 🧮 Engineering Formula & Principles

In agricultural pipeline sizing, the pump must overcome both elevation changes and pipe friction resistance:

$$\text{Total Pump Head } (H_{\text{total}}) = H_{\text{static}} + \sum (L \times f_{\text{pipe}}) + \sum (K_{\text{fitting}})$$

Where:
- $H_{\text{static}}$ = Static elevation difference between water source and discharge outlet (meters)
- $H_{\text{friction}}$ = Cumulative friction head loss through pipe runs and inline fittings (meters)
- $H_{\text{total}}$ = Minimum rated head required by the pump to deliver desired flow rate (LPS)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Architecture

```
agri-pipeline-survey/
├── app/
│   ├── api/
│   │   ├── createSurvey/     # POST: Create new survey record
│   │   ├── getSurveys/       # GET: Fetch surveys for logged-in user
│   │   ├── getSurveyByNo/    # GET: Retrieve single survey by ID
│   │   ├── updateSurvey/     # PUT: Update survey record
│   │   ├── deleteSurvey/     # DELETE: Remove survey record
│   │   ├── login/            # POST: Authenticate user & issue JWT
│   │   └── signup/           # POST: Register new user account
│   ├── dashboard/            # Survey listing, analytics, quick search
│   ├── login/                # User login portal
│   ├── signup/               # Account registration
│   ├── survey/
│   │   ├── new/              # Survey creation wizard
│   │   ├── [surveyNo]/       # Detailed survey view & PDF generator
│   │   └── edit/[surveyNo]/  # Edit survey parameters & pipeline items
│   ├── globals.css           # Global Tailwind CSS configurations
│   ├── layout.tsx            # Root layout & application metadata
│   └── page.tsx              # Project landing page & feature overview
├── components/
│   └── SurveyForm.tsx        # Reusable component for Create & Edit workflows
├── data/
│   └── items.json            # Agricultural pipe & fitting specifications catalog
└── lib/
    └── supabaseServer.ts     # Supabase client initializer
```

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Digvijay-Kesare/Siddheshwar-Sales-Pipeline-Report.git
cd Siddheshwar-Sales-Pipeline-Report
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 👨‍💻 Author
**Digvijay Kesare**  
Irrigation & Pipeline Survey Management System

# Uttar Pradesh Handball Association (UPHA)

The official web portal and management system for the Uttar Pradesh Handball Association. This platform is designed to manage players, coaches, referees, academies, and districts across the state of Uttar Pradesh.

## 🌟 Key Features

- **Multi-Role Dashboards**: Dedicated secure dashboards for Players, Coaches, Referees, Academies, and District Administrators.
- **Digital ID Cards**: Premium, downloadable digital ID cards generated securely on the backend (PDF) for all registered members.
- **Certification System**: Automated generation of official UPHA certificates with premium aesthetics (Gold borders, official seals, typography).
- **Event Management**: Registration and tracking for handball tournaments and events.
- **Notice Board**: Centralized announcements and notices customized by user role.
- **Online Registrations**: Seamless onboarding process for new players, coaches, and academies.

## 🛠 Technology Stack

### Frontend (Client-Side)
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend (Server-Side)
- **Framework**: Django & Django REST Framework (Python)
- **Database**: PostgreSQL / MySQL
- **PDF Generation**: ReportLab
- **Authentication**: JWT / Token-based authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Postgres / MySQL Database

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env` (Database credentials, Secret Key).
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:3000`.

## 📄 License
This project is proprietary and confidential. All rights reserved by the Uttar Pradesh Handball Association (UPHA).

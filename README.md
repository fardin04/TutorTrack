# 🎓 TutorTrack

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white" alt="Appwrite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white" alt="DaisyUI" />
</div>

<div align="center">
  <h3>🚀 Smart Tutor Management & Scheduling Platform</h3>
  <p><em>Streamline your tutoring business with intelligent scheduling, student management, and progress tracking</em></p>
</div>

---

## 🌟 Features

### 🔐 **Multi-User Authentication**
- Secure user registration and login
- Isolated data for each tutor
- Session management with automatic logout

### 📅 **Smart Scheduling System**
- Set your weekly availability with custom time slots
- Define maximum students per day
- Automatic schedule generation based on student preferences
- Conflict-free scheduling algorithm

### 👥 **Student Management**
- Add students with personalized preferences
- Set classes per week for each student
- Mark unavailable days for students
- Visual student cards with progress tracking

### 📊 **Class Logging & Progress Tracking**
- Mark classes as completed or missed
- Real-time progress bars for each student
- Track attendance patterns
- Historical class records

### 🎨 **Beautiful & Responsive UI**
- Modern design with DaisyUI components
- Fully responsive across all devices
- Dark/Light theme support
- Intuitive user experience

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Appwrite account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tutortrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_COLLECTION_STUDENT_ID=your_student_collection_id
   VITE_APPWRITE_COLLECTION_AVAILABILITY_ID=your_availability_collection_id
   VITE_APPWRITE_COLLECTION_LOGS_ID=your_logs_collection_id
   ```

4. **Set up Appwrite Collections**
   
   **Students Collection:**
   - `name` (String, required)
   - `daysPerWeek` (Integer, required)
   - `blockedDays` (String, required) - JSON array
   - `tutorId` (String, required)

   **Availability Collection:**
   - `workingDays` (String, required) - JSON array
   - `maxStudents` (String, required) - JSON object
   - `tutorId` (String, required)

   **Logs Collection:**
   - `studentId` (String, required)
   - `date` (String, required)
   - `status` (String, required)

5. **Enable Authentication**
   - Go to your Appwrite Console
   - Navigate to Auth → Settings
   - Enable Email/Password authentication

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🎯 How It Works

### 1. **Authentication Flow**
```
Visit TutorTrack → Login/Register → Set Availability → Add Students → Generate Schedule → Log Classes
```

### 2. **Scheduling Algorithm**
The intelligent scheduling system:
- Prioritizes students with higher classes/week requirements
- Distributes classes evenly across available days
- Respects both tutor availability and student preferences
- Automatically handles conflicts and constraints

### 3. **Data Isolation**
Each tutor has completely isolated data:
- Students are filtered by `tutorId`
- Availability settings are user-specific
- Class logs are associated with the tutor's students

---

## 🛠️ Tech Stack

| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **React 18** | Frontend Framework | Modern, component-based architecture |
| **Vite** | Build Tool | Lightning-fast development experience |
| **Appwrite** | Backend-as-a-Service | Authentication, database, real-time updates |
| **Tailwind CSS** | Styling | Utility-first, highly customizable |
| **DaisyUI** | Component Library | Beautiful pre-built components |

---

## 📱 User Journey

### 1. **First Visit**
- User sees clean login/register form
- Can create account or login with existing credentials

### 2. **Setting Up**
- Set weekly availability (working days and max students per day)
- Add students with their preferences and constraints

### 3. **Daily Usage**
- View automatically generated weekly schedule
- Log completed/missed classes with one click
- Track student progress with visual indicators

---

## 🎨 Design Philosophy

- **Simplicity First**: Clean, intuitive interface
- **Mobile Responsive**: Works perfectly on all devices  
- **Accessibility**: WCAG compliant design
- **Performance**: Optimized for speed and efficiency

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit your changes**: `git commit -m 'Add some amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

---

## 📋 Roadmap

### 🔮 Upcoming Features

- [ ] **Calendar Integration** - Sync with Google Calendar
- [ ] **Payment Tracking** - Invoice generation and payment tracking
- [ ] **Video Call Integration** - Direct Zoom/Meet links
- [ ] **Mobile App** - React Native companion app
- [ ] **Analytics Dashboard** - Detailed insights and reports
- [ ] **Notification System** - Email/SMS reminders
- [ ] **Multi-language Support** - Internationalization
- [ ] **Export Features** - PDF reports and data export

---

## 🐛 Common Issues & Solutions

**Issue**: "Invalid query syntax" error
```
Solution: Update to latest Appwrite SDK and use Query helpers
```

**Issue**: Students not appearing in schedule
```
Solution: Ensure tutor availability is set before adding students
```

**Issue**: Authentication not working
```
Solution: Check Appwrite Auth settings and enable Email/Password
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Appwrite Team** - For the amazing BaaS platform
- **React Team** - For the incredible framework
- **Tailwind CSS** - For the utility-first CSS framework
- **DaisyUI** - For beautiful component library
- **Vite Team** - For the lightning-fast build tool

---

<div align="center">
  <h3>🎓 Built with ❤️ for Tutors Worldwide</h3>
  <p><em>Making tutoring management simple, efficient, and enjoyable</em></p>
  
  **⭐ Star this repository | 🐛 Report Bug | ✨ Request Feature**
</div>

---

*Last updated: August 2025*

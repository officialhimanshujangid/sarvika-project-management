# 🚀 Project Management Dashboard

A modern, responsive project management application built with React 19, Redux Toolkit, and Tailwind CSS. This application provides comprehensive project and task management capabilities with role-based access control, real-time charts, and drag-and-drop functionality.

## 🌐 Live Demo

**Live URL:** [sarvika-project-management.vercel.app](https://sarvika-project-management.vercel.app)

## ✨ Features

### 🎯 Core Functionality
- **Project Management**: Create, edit, delete, and track projects
- **Task Management**: Comprehensive task creation with drag-and-drop status updates
- **Team Management**: Organize teams and assign members
- **Employee Management**: User management with role-based access
- **Dashboard Analytics**: Real-time charts and project statistics

### 🔐 Role-Based Access Control
- **Head/Admin Users**: Full access to create, edit, and delete projects and tasks
- **Employee Users**: View and update assigned tasks, limited project access
- **Secure Authentication**: Protected routes and role-based UI rendering

### 📊 Data Visualization
- **Project Status Distribution**: Doughnut charts showing project status breakdown
- **Task Status Overview**: Visual representation of task completion rates
- **Project Completion Rates**: Bar charts displaying progress by project
- **Interactive Charts**: Built with Chart.js and React-Chartjs-2

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Drag & Drop**: Intuitive task status updates
- **Rich Text Editor**: Quill.js integration for detailed descriptions
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Charts**: Chart.js + React-Chartjs-2
- **Forms**: Formik + Yup validation
- **Drag & Drop**: React DnD
- **Rich Text**: React Quill
- **Icons**: React Icons
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd publicggg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   **⚠️ Important**: If you encounter dependency conflicts with React 19, use the force flag:
   ```bash
   npm install -f
   ```
   
   Some dependencies may not fully support React 19 yet, but the force flag will install them anyway and the application will work correctly.

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── charts/          # Chart components
│   ├── modals/          # Modal dialogs
│   └── ...
├── contexts/            # React contexts
├── layout/              # Layout components
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Tasks.jsx
│   ├── Teams.jsx
│   ├── Employees.jsx
│   ├── Settings.jsx
│   └── ...
├── redux/               # Redux store and slices
│   └── redux_slices/
├── utils/               # Utility files and mock data
└── main.jsx            # Application entry point
```

## 🔄 Application Flow

### 1. **Authentication Flow**
```
Login Page → Demo Credentials → Role-based Redirect
├── Head/Admin → Full Dashboard Access
└── Employee → Limited Task View
```

### 2. **Project Management Flow**
```
Create Project → Assign Team → Set Timeline → Track Progress
├── Planning Phase
├── In Progress Phase
├── Completed Phase
└── On Hold Phase
```

### 3. **Task Management Flow**
```
Create Task → Assign to User → Set Priority → Track Status
├── To Do
├── In Progress
└── Completed
```

### 4. **Dashboard Analytics Flow**
```
Data Collection → Chart Processing → Real-time Updates
├── Project Status Charts
├── Task Distribution
└── Completion Rates
```

## 👥 Demo Accounts

### Admin/Head Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full project and task management capabilities

### Employee Account
- **Username**: `jsmith`
- **Password**: `jsmith2024`
- **Access**: View assigned tasks and limited project access

## 🎨 Theme System

The application supports both light and dark themes:
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Modern, eye-friendly interface
- **Auto-save**: Theme preference is saved in Redux store
- **Toggle**: Available in settings and header

## 📊 Data Management

### Mock Data Structure
- **Projects**: Status, priority, team assignments, timelines
- **Tasks**: Assignments, priorities, due dates, descriptions
- **Teams**: Team members, project associations
- **Users**: Role-based access, authentication

### State Management
- **Redux Toolkit**: Centralized state management
- **Slices**: Separate slices for auth, projects, tasks, teams, settings
- **Persistence**: Settings and theme preferences persist across sessions

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings
4. Your app will be available at `your-app-name.vercel.app`

### Environment Variables
No environment variables are required for basic functionality. All data is managed through Redux state and mock JSON files.

## 🔧 Configuration

### Font Size Customization
The application uses a reduced font size system:
- **Base Font Size**: 14px (0.875rem)
- **Settings Page**: 12px (0.75rem) for compact display
- **Responsive**: Scales appropriately across devices

### Chart Configuration
- **Chart.js**: Configured for responsive design
- **Colors**: Theme-aware color schemes
- **Interactions**: Hover effects and tooltips

## 🐛 Troubleshooting

### Common Issues

1. **Dependency Installation Errors**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   npm install -f
   ```

2. **React 19 Compatibility Issues**
   - Some packages may show warnings
   - Use `npm install -f` to force installation
   - Application will work correctly despite warnings

3. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install -f
   npm run build
   ```

4. **Development Server Issues**
   ```bash
   # Check if port 5173 is available
   npm run dev -- --port 3000
   ```

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Redux Team** for state management
- **Tailwind CSS** for the utility-first CSS framework
- **Chart.js** for beautiful data visualization
- **Vercel** for seamless deployment

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the demo accounts and try different user roles
3. Ensure all dependencies are installed correctly
4. Check browser console for any error messages

---

**Built with ❤️ using React 19, Redux Toolkit, and Tailwind CSS**
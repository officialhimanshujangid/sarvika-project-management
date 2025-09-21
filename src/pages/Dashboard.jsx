import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { currentUser, users } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  const { tasks } = useSelector(state => state.tasks);
  const { teams } = useSelector(state => state.teams);


  // Process data for charts
  const projectStatusData = {
    labels: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    datasets: [
      {
        label: 'Projects by Status',
        data: [
          projects.filter(p => p.status === 'planning').length,
          projects.filter(p => p.status === 'in_progress').length,
          projects.filter(p => p.status === 'completed').length,
          projects.filter(p => p.status === 'on_hold').length
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate task completion rate by project
  const projectCompletionData = {
    labels: projects.map(p => p.name),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: projects.map(project => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          if (projectTasks.length === 0) return 0;
          const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
          return Math.round((completedTasks / projectTasks.length) * 100);
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Task status distribution data
  const taskStatusData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [
          tasks.filter(t => t.status === 'todo').length,
          tasks.filter(t => t.status === 'in_progress').length,
          tasks.filter(t => t.status === 'completed').length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  


// Chart options
const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};


return (
  <div className="bg-[var(--bg-primary)] !p-6 min-h-screen">
    <h1 className="text-lg font-bold !mb-6 text-[var(--text-primary)]">Project Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 !gap-6 !mb-6">
      {/* Welcome card */}
      <div className="bg-[var(--bg-secondary)] !p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold !mb-2 text-[var(--text-primary)]">Welcome, {currentUser?.name}!</h2>
        <p className="text-[var(--text-secondary)]">Here's an overview of your projects and tasks.</p>
      </div>

      {/* Stats summary */}
      <div className="bg-[var(--bg-secondary)] !p-4 rounded-lg shadow grid grid-cols-2 !gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-[var(--text-primary)]">{projects.length}</p>
          <p className="text-[var(--text-secondary)]">Total Projects</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[var(--text-primary)]">{tasks.length}</p>
          <p className="text-[var(--text-secondary)]">Total Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {tasks.filter(t => t.status === 'completed').length}
          </p>
          <p className="text-[var(--text-secondary)]">Completed Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[var(--text-primary)]">{users.length}</p>
          <p className="text-[var(--text-secondary)]">Team Members</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 !gap-6 !mb-6">
      {/* Project Status Chart */}
      <div className="bg-[var(--bg-secondary)] !p-4 rounded-lg shadow">
        <h2 className="text-sm font-semibold !mb-4 text-[var(--text-primary)]">Project Status Distribution</h2>
        <div className="h-64">
          <Doughnut data={projectStatusData} options={doughnutOptions} className="!mx-auto w-full"  />
        </div>
      </div>

      {/* Task Status Distribution */}
      <div className="bg-[var(--bg-secondary)] !p-4 rounded-lg shadow">
        <h2 className="text-sm font-semibold !mb-4 text-[var(--text-primary)]">Overall Task Status Distribution</h2>
        <div className="h-64">
          <Doughnut data={taskStatusData} options={doughnutOptions} className="!mx-auto w-full"  />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-1 !gap-6 !mb-6">
      {/* Task Completion Rate by Project */}
      <div className="bg-[var(--bg-secondary)] !p-4 rounded-lg shadow">
        <h2 className="text-sm font-semibold !mb-4 text-[var(--text-primary)]">Task Completion Rate by Project</h2>
        <div className="h-64 min-h-[300px]">
          <Bar data={projectCompletionData} options={barOptions} className="!mx-auto w-full" />
        </div>
      </div>
    </div>



    {/* Recent Projects */}
    <div className="bg-[var(--bg-secondary)] !p-4 rounded-lg shadow !mb-6">
      <h2 className="text-sm font-semibold !mb-4 text-[var(--text-primary)]">Recent Projects</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-color)]">
          <thead>
            <tr>
              <th className="!px-4 !py-2 text-left text-[var(--text-primary)]">Project Name</th>
              <th className="!px-4 !py-2 text-left text-[var(--text-primary)]">Status</th>
              <th className="!px-4 !py-2 text-left text-[var(--text-primary)]">Completion</th>
              <th className="!px-4 !py-2 text-left text-[var(--text-primary)]">Team</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 5).map(project => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
              const completionRate = projectTasks.length > 0
                ? Math.round((completedTasks / projectTasks.length) * 100)
                : 0;

              return (
                <tr key={project.id}>
                  <td className="!px-4 !py-2 text-[var(--text-primary)]">{project.name}</td>
                  <td className="!px-4 !py-2">
                    <span className={`!px-2 !py-1 rounded-full text-xs ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {project.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="!px-4 !py-2 text-[var(--text-primary)]">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{completionRate}%</span>
                  </td>
                  <td className="!px-4 !py-2 text-[var(--text-primary)]">
                    {teams.find(t => t.id === project.teamId)?.name || 'Unassigned'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default Dashboard;
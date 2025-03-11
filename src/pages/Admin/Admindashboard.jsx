import React, { useState, useEffect } from 'react';
import AdminNavbar from '../ui/adminnavbar';
import { Chart } from 'primereact/chart';

function AdminDashboard() {
  const [studentsPerCollegeData, setStudentsPerCollegeData] = useState({});
  const [sessionTypesData, setSessionTypesData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Data for Students per College (Pie Chart)
    const studentsPerCollegeData = {
      labels: ['CAH', 'CMBS', 'CCS', 'CABE'],
      datasets: [
        {
          label: 'Students per College',
          data: [170, 150, 80, 100],  // Example student counts per College
          backgroundColor: [
            'rgba(239, 68, 68, 0.4)',
            'rgba(239, 68, 68, 0.4)',
            'rgba(239, 68, 68, 0.4)',
            'rgba(239, 68, 68, 0.4)',
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(239, 68, 68)',
            'rgb(239, 68, 68)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Data for Session Types (Bar Chart)
    const sessionTypesData = {
      labels: ['Referral', 'Online', 'Walk-in'],
      datasets: [
        {
          label: 'Session Types',
          data: [65, 59, 80], // Example session counts for each type
          backgroundColor: [
            'rgba(239, 68, 68, 0.4)',
            'rgba(239, 68, 68, 0.4)',
            'rgba(239, 68, 68, 0.4)',
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(239, 68, 68)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const hardcodedOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'center'
        }
      },
      maintainAspectRatio: false
    };

    setStudentsPerCollegeData(studentsPerCollegeData);
    setSessionTypesData(sessionTypesData);
    setChartOptions(hardcodedOptions)
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      {/* Dashboard Content */}
      <div className="max-w-8xl mx-auto mt- px-6 pt-12">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7"> {/* Responsive grid */}
          {[
            { title: 'Total Number of Students', value: 15, subtitle: 'This semester' },
            { title: 'New Requests', value: 6, subtitle: '+1 since yesterday' },
            { title: 'Completed Sessions', value: 24, subtitle: 'This month' },
            { title: 'No-shows', value: 3, subtitle: 'This week' },
          ].map((item, index) => (
            <div key={index} className="bg-white border p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-4xl font-bold">{item.value}</p>
              <p className="text-gray-600 text-sm">{item.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"> {/* Responsive grid */}
          {/* Recent Activity */}
          <div className="bg-white border p-6 rounded-lg shadow-md">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Recent Activity</h2>
              <button className="text-[#3A0323] font-medium hover:text-[#2a021a] transition-colors">
                See all
              </button>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mt-4 border-b pb-2">
                <p className="font-semibold">New Referral: John Doe (CS101)</p>
                <p className="text-gray-600 text-sm">
                  Referred by: Prof. Smith - <span className="font-bold">Reason:</span> Academic Performance
                </p>
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="bg-white border p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Notifications</h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"> {/* Responsive grid */}
          {/* Pie Chart */}
          <div className="bg-white border p-6 rounded-lg shadow-md pb-8">
            <h2 className="text-lg font-bold">Students per College</h2>
            <Chart type="pie" data={studentsPerCollegeData} options={chartOptions} style={{ width: '100%', height: '250px' }} />
          </div>

          {/* Bar Chart */}
          <div className="bg-white border p-6 rounded-lg shadow-md pb-8">
            <h2 className="text-lg font-bold">Session Types</h2>
            <Chart type="bar" data={sessionTypesData} options={chartOptions} style={{ width: '100%', height: '250px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

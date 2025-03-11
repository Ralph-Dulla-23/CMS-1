import React, { useState, useEffect } from 'react';
import AdminNavbar from '../ui/adminnavbar';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';

function Reports() {
  const [studentsPerCollegeData, setStudentsPerCollegeData] = useState({});
  const [sessionTypesData, setSessionTypesData] = useState({});
  const [counselingSessionsData, setCounselingSessionsData] = useState({});
  const [yearPerCollegesData, setYearPerCollegesData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('thisMonth');
  const [selectedCollege, setSelectedCollege] = useState('all');

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

    // Data for Counseling Sessions Over Time (Line Chart)
    const counselingSessionsData = {
      labels: ['2024-11-2', '2024-11-5', '2024-11-8', '2024-11-11', '2024-11-14', '2024-11-17', '2024-11-20', '2024-11-23', '2024-11-26', '2024-11-29'],
      datasets: [
        {
          label: 'Counseling Sessions',
          data: [900, 500, 550, 850, 150, 750, 550, 450, 350, 320],
          fill: false,
          borderColor: 'rgb(239, 68, 68)',
          tension: 0.4,
        },
      ],
    };

    // Data for Year per Colleges (Bar Chart)
    const yearPerCollegesData = {
      labels: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      datasets: [
        {
          label: 'Students',
          data: [80, 30, 75, 65],
          backgroundColor: 'rgba(239, 68, 68, 0.4)',
          borderColor: 'rgb(239, 68, 68)',
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
          align: 'center',
          labels: {
            color: '#495057'
          }
        }
      },
      maintainAspectRatio: false
    };

    setStudentsPerCollegeData(studentsPerCollegeData);
    setSessionTypesData(sessionTypesData);
    setCounselingSessionsData(counselingSessionsData);
    setYearPerCollegesData(yearPerCollegesData);
    setChartOptions(hardcodedOptions)
  }, []);

  const monthOptions = [
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Past 3 Months', value: 'past3Months' },
  ];

  const collegeOptions = [
    { label: 'All Colleges', value: 'all' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Business', value: 'business' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      {/* Dashboard Content */}
      <div className="max-w-8xl mx-auto mt- px-6 pt-12">
        <h1 className="text-3xl font-bold mb-6">Counseling Reports</h1>

        {/* Filters */}
        <div className="flex justify-end space-x-4 mb-8">  {/* Increased spacing below filters */}
          <Dropdown
            value={selectedMonth}
            options={monthOptions}
            onChange={(e) => setSelectedMonth(e.value)}
            placeholder="Select a Month"
            className="w-full md:w-48"
          />
          <Dropdown
            value={selectedCollege}
            options={collegeOptions}
            onChange={(e) => setSelectedCollege(e.value)}
            placeholder="Select a College"
            className="w-full md:w-48"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Counseling Sessions Over Time (Line Chart) */}
          <div className="bg-white border p-4 rounded-lg shadow-md mx-2"> {/* Added horizontal margin */}
            <h2 className="text-lg font-semibold mb-2">Counseling Sessions Over Time</h2>
            <Chart type="line" data={counselingSessionsData} options={chartOptions} style={{ width: '100%', height: '200px' }} />
          </div>

          {/* Students per College (Pie Chart) */}
          <div className="bg-white border p-4 rounded-lg shadow-md mx-2"> {/* Added horizontal margin */}
            <h2 className="text-lg font-semibold mb-2">Students per College</h2>
            <Chart type="pie" data={studentsPerCollegeData} options={chartOptions} style={{ width: '100%', height: '200px' }} />
          </div>

          {/* Session Types (Bar Chart) */}
          <div className="bg-white border p-4 rounded-lg shadow-md mx-2"> {/* Added horizontal margin */}
            <h2 className="text-lg font-semibold mb-2">Session Types</h2>
            <Chart type="bar" data={sessionTypesData} options={chartOptions} style={{ width: '100%', height: '200px' }} />
          </div>

          {/* Year per Colleges (Bar Chart) */}
          <div className="bg-white border p-4 rounded-lg shadow-md mx-2 md:col-span-2 lg:col-span-3"> {/* Added horizontal margin */}
            <h2 className="text-lg font-semibold mb-2">Year per Colleges</h2>
            <Chart type="bar" data={yearPerCollegesData} options={chartOptions} style={{ width: '100%', height: '200px' }} />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white shadow rounded-md p-5 mb-5 mt-8"> {/* Increased spacing above stats */}
          <h2 className="text-lg font-semibold mb-3">Summary Statistics</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>Total Session:</div><div>532</div>
            <div>Average Sessions per Day:</div><div>6.3</div>
            <div>Most Active College:</div><div>Pharmacy</div>
            <div>Least Active College:</div><div>Computer Science</div>
            <div>Most Common Reasons:</div><div>idk what reason tbh</div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center mt-4">
          <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded text-sm">
            Export Data as CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;

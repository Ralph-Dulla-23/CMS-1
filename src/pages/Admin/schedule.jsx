import React, { useState } from 'react';
import AdminNavbar from '../ui/adminnavbar';
import { Calendar } from 'primereact/calendar';

function Schedule() {
  const [date, setDate] = useState(new Date());
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white min-h-screen">
     
      <AdminNavbar />

     
      <div className="max-w-8xl mx-auto mt- px-6 pt-12">
        <h1 className="text-4xl font-bold mb-8">Admin Schedule</h1>


        <div className="grid grid-cols-2 gap-10">
        
          <div className="bg-white shadow-lg border rounded-xl p-10 flex flex-col w-full h-[500px]">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 6.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V6.75m-18 0A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0118.75 6.75m-18 0v2.25m19.5 0v2.25m-18 0a2.25 2.25 0 01-1.125 2.063V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.688a2.25 2.25 0 01-1.125-2.063m-18 0A2.25 2.25 0 013 11.25v-2.25m19.5 0v-2.25m0 0a2.25 2.25 0 011.125-2.063V6.75A2.25 2.25 0 0018.75 4.5h-1.5a2.25 2.25 0 00-2.25 2.25v1.688a2.25 2.25 0 01-1.125 2.063m-7.5 0A2.25 2.25 0 019 11.25v-2.25m7.5 0v-2.25m0 0a2.25 2.25 0 011.125-2.063V6.75A2.25 2.25 0 0012.75 4.5h-1.5a2.25 2.25 0 00-2.25 2.25v1.688a2.25 2.25 0 01-1.125 2.063" />
              </svg>
              Calendar
            </h2>
            <div className="flex-grow flex justify-center items-center">
              <Calendar
                value={date}
                onChange={(e) => setDate(e.value)}
                inline
                showWeek
                className="w-full"
              />
            </div>
          </div>

        
          <div className="bg-white shadow-lg border rounded-xl p-10 flex flex-col w-full h-[500px]">
            <h2 className="text-2xl font-semibold mb-6">
              Sessions for {formattedDate}
            </h2>
            <div className="flex-grow flex justify-center items-center">
              <p className="text-gray-500 text-2xl font-medium">No sessions for this day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;

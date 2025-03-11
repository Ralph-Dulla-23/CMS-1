import React, { useState } from 'react';
import AdminNavbar from '../ui/adminnavbar';

function History() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const students = [
    {
      name: 'John Doe',
      course: 'Computer Science',
      year: '3rd',
      type: 'Walk-in',
      referral: 'Self',
      status: 'Reviewed',
      remarks: 'Terminated',
      details: {
        mode: 'Referral',
        fullName: 'John Doe',
        email: 'jdoe@uic.edu.ph',
        courseYear: 'Information Technology 1A',
        department: 'College of Computer Studies',
        id: '2200000321',
        dob: '01/02/2003',
        ageSex: '21/M',
        contact: '09123456789',
        address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        emergencyContact: 'Anna Doe - 09123456788',
        date: 'October 10, 2024',
        time: '2:00 PM',
        personal: ['I have a hard time making decisions.', 'I easily get worried or overthink.'],
        interpersonal: ['I am being bullied.', "I can't express my feelings and thoughts to others."],
        grief: ['None'],
        academics: ['I am overly worried about my academic performance.'],
        family: [
          "I have a hard time dealing with my parents/guardian's expectations and demands.",
          'Our family is having financial concerns.',
        ],
      },
    },
    {
      name: 'Sebastian Vincent',
      course: 'Engineering',
      year: '2nd',
      type: 'Online',
      referral: 'Self',
      status: 'Reviewed',
      remarks: 'Terminated',
      details: null,
    },
  ];

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white-100 min-h-screen">
      <AdminNavbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Session History</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Year</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Referral</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={index}
                  className="border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => openModal(student)}
                >
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.course}</td>
                  <td className="py-3 px-4">{student.year}</td>
                  <td className="py-3 px-4">{student.type}</td>
                  <td className="py-3 px-4">{student.referral}</td>
                  <td className="py-3 px-4">{student.status}</td>
                  <td className="py-3 px-4">{student.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-3xl rounded-lg shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full"
            >
              X
            </button>
            <h1 className="text-2xl font-bold mb-4">View History Details</h1>
            <div>
              <p>
                <strong>Mode of Counseling:</strong> {selectedStudent.details.mode}
              </p>
              <p>
                <strong>Full name:</strong> {selectedStudent.details.fullName}
              </p>
              <p>
                <strong>UIC Email Address:</strong> {selectedStudent.details.email}
              </p>
              <p>
                <strong>Course & Year:</strong> {selectedStudent.details.courseYear}
              </p>
              <p>
                <strong>College Department:</strong> {selectedStudent.details.department}
              </p>
              <p>
                <strong>UIC ID:</strong> {selectedStudent.details.id}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedStudent.details.dob}
              </p>
              <p>
                <strong>Age/Sex:</strong> {selectedStudent.details.ageSex}
              </p>
              <p>
                <strong>Contact No.:</strong> {selectedStudent.details.contact}
              </p>
              <p>
                <strong>Present Address:</strong> {selectedStudent.details.address}
              </p>
              <p>
                <strong>Emergency contact person and no.:</strong> {selectedStudent.details.emergencyContact}
              </p>
              <p>
                <strong>Date:</strong> {selectedStudent.details.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedStudent.details.time}
              </p>

              <h2 className="text-xl font-bold mt-4">Personal</h2>
              <ul>
                {selectedStudent.details.personal.map((item, index) => (
                  <li key={index}>● {item}</li>
                ))}
              </ul>

              <h2 className="text-xl font-bold mt-4">Interpersonal</h2>
              <ul>
                {selectedStudent.details.interpersonal.map((item, index) => (
                  <li key={index}>● {item}</li>
                ))}
              </ul>

              <h2 className="text-xl font-bold mt-4">Grief/Bereavement</h2>
              <ul>
                {selectedStudent.details.grief.map((item, index) => (
                  <li key={index}>● {item}</li>
                ))}
              </ul>

              <h2 className="text-xl font-bold mt-4">Academics</h2>
              <ul>
                {selectedStudent.details.academics.map((item, index) => (
                  <li key={index}>● {item}</li>
                ))}
              </ul>

              <h2 className="text-xl font-bold mt-4">Family</h2>
              <ul>
                {selectedStudent.details.family.map((item, index) => (
                  <li key={index}>● {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;

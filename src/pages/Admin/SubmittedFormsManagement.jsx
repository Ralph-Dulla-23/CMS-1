import React, { useState, useEffect } from 'react';
import AdminNavbar from '../ui/adminnavbar';
import { getStudentInterviewForms, updateFormStatus } from '../../firebase/firestoreService';

const mapConcernAreasToText = (concerns, category) => {
  if (!concerns || !Array.isArray(concerns) || concerns.length === 0) {
    return ['None'];
  }

  const mappings = {
    personal: {
      'notConfident': 'I do not feel confident about myself',
      'hardTimeDecisions': 'I have a hard time making decisions',
      'problemSleeping': 'I have a problem with sleeping',
      'moodNotStable': 'I have noticed that my mood is not stable'
    },
    interpersonal: {
      'beingBullied': 'I am being bullied',
      'cannotHandlePeerPressure': 'I cannot handle peer pressure',
      'difficultyGettingAlong': 'I have difficulty getting along with others'
    },
    academic: {
      'overlyWorriedAcademic': 'I am overly worried about my academic performance',
      'notMotivatedStudy': 'I am not motivated to study',
      'difficultyUnderstanding': 'I have difficulty understanding the class lessons'
    },
    family: {
      'hardTimeDealingParents': 'I have a hard time dealing with my parents/guardian\'s expectations and demands',
      'difficultyOpeningUp': 'I have difficulty opening up to family member/s',
      'financialConcerns': 'Our family is having financial concerns'
    }
  };

  return concerns.map(concern => mappings[category][concern] || concern);
};

function SubmittedFormsManagement() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // Added for tab navigation

  const fetchForms = async () => {
    setLoading(true);
    try {
      const result = await getStudentInterviewForms();
      console.log("Fetch result:", result);
      
      if (result.success) {
        console.log("Raw forms data:", result.forms);
        
        const processedForms = result.forms.map(form => {
          console.log("Processing form:", form);
          
          // Extract course and year from courseYearSection
          let course = 'Unknown';
          let year = 'Unknown';
          
          if (form.courseYearSection) {
            const parts = form.courseYearSection.split(' ');
            if (parts.length > 0) {
              course = parts[0];
              // Try to extract year (e.g., "1st", "2nd", etc.)
              const yearMatch = form.courseYearSection.match(/(\d+)[a-zA-Z]{2}/);
              if (yearMatch) {
                year = yearMatch[0];
              } else if (parts.length > 1) {
                year = parts[1];
              }
            }
          }

          // Process areas of concern safely
          const areasOfConcern = form.areasOfConcern || {};
          
          return {
            id: form.id,
            name: form.studentName || 'Unknown',
            course: course,
            year: year,
            type: form.type || 'Walk-in',
            referral: form.referral || 'Self',
            status: form.status || 'Pending',
            remarks: form.remarks || '',
            isReferral: form.isReferral || false,
            details: {
              mode: form.isReferral ? 'Referral' : 'Non-Referral',
              fullName: form.studentName || 'Unknown',
              email: form.email || 'Unknown',
              courseYear: form.courseYearSection || 'Unknown',
              department: 'College of Computer Studies', // Default or fetch from DB
              id: form.studentId || '2200000321', // Default or fetch from DB
              dob: form.dateOfBirth || 'Unknown',
              ageSex: form.ageSex || 'Unknown',
              contact: form.contactNo || 'Unknown',
              address: form.presentAddress || 'Unknown',
              emergencyContact: `${form.emergencyContactPerson || 'Unknown'} - ${form.emergencyContactNo || 'Unknown'}`,
              date: form.dateTime ? new Date(form.dateTime).toLocaleDateString() : 'Unknown',
              time: form.dateTime ? new Date(form.dateTime).toLocaleTimeString() : 'Unknown',
              personal: mapConcernAreasToText(areasOfConcern.personal, 'personal'),
              interpersonal: mapConcernAreasToText(areasOfConcern.interpersonal, 'interpersonal'),
              grief: ['None'], // Default value
              academics: mapConcernAreasToText(areasOfConcern.academic, 'academic'),
              family: mapConcernAreasToText(areasOfConcern.family, 'family'),
            }
          };
        });
        
        console.log("Processed forms:", processedForms);
        setForms(processedForms);
      } else {
        setError(result.error || "Failed to fetch forms. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
      setError("Failed to fetch forms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Debug data processing
  useEffect(() => {
    console.log("Forms data:", forms);
    console.log("Non-referral forms:", nonReferralForms);
    console.log("Referral forms:", referralForms);
  }, [forms]);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const handleAccept = async () => {
    if (!selectedStudent) return;
    
    const result = await updateFormStatus(selectedStudent.id, 'Reviewed', 'Terminated');
    
    if (result.success) {
      setForms(forms.map(form => 
        form.id === selectedStudent.id 
          ? { ...form, status: 'Reviewed', remarks: 'Terminated' } 
          : form
      ));
      closeModal();
    } else {
      alert("Failed to update session status. Please try again.");
    }
  };

  const handleReschedule = async () => {
    if (!selectedStudent) return;
    
    const result = await updateFormStatus(selectedStudent.id, 'Rescheduled', 'Pending reschedule');
    
    if (result.success) {
      setForms(forms.map(form => 
        form.id === selectedStudent.id 
          ? { ...form, status: 'Rescheduled', remarks: 'Pending reschedule' } 
          : form
      ));
      closeModal();
    } else {
      alert("Failed to update session status. Please try again.");
    }
  };

  const nonReferralForms = forms.filter(form => !form.isReferral);
  const referralForms = forms.filter(form => form.isReferral);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <AdminNavbar />
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      {error && (
        <div className="max-w-8xl mx-auto mt-4 px-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button 
              onClick={fetchForms}
              className="underline ml-2"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto mt-8 px-6">
        <h1 className="text-2xl font-bold mb-6">Student Interview Submissions</h1>
        
        {/* Tabs for Walk-in and Referral */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button 
                className={`mr-8 py-2 px-1 border-b-2 ${
                  !activeTab ? 'border-[#340013] text-[#340013] font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(null)}
              >
                All Submissions ({forms.length})
              </button>
              <button 
                className={`mr-8 py-2 px-1 border-b-2 ${
                  activeTab === 'walk-in' ? 'border-[#340013] text-[#340013] font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('walk-in')}
              >
                Walk-in ({nonReferralForms.length})
              </button>
              <button 
                className={`py-2 px-1 border-b-2 ${
                  activeTab === 'referral' ? 'border-[#340013] text-[#340013] font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('referral')}
              >
                Referrals ({referralForms.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Table of submissions */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course & Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === 'walk-in' ? nonReferralForms : 
                activeTab === 'referral' ? referralForms : forms).map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.course} {student.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        student.status === 'Reviewed' ? 'bg-green-100 text-green-800' : 
                        student.status === 'Rescheduled' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => openModal(student)}
                      className="text-[#340013] hover:text-[#5a0021] font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {(activeTab === 'walk-in' ? nonReferralForms.length === 0 : 
                activeTab === 'referral' ? referralForms.length === 0 : 
                forms.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Student Details</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-gray-500">Name:</span> {selectedStudent.details.fullName}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedStudent.details.email}</p>
                    <p><span className="text-gray-500">Course & Year:</span> {selectedStudent.details.courseYear}</p>
                    <p><span className="text-gray-500">Department:</span> {selectedStudent.details.department}</p>
                    <p><span className="text-gray-500">Student ID:</span> {selectedStudent.details.id}</p>
                    <p><span className="text-gray-500">Date of Birth:</span> {selectedStudent.details.dob}</p>
                    <p><span className="text-gray-500">Age/Sex:</span> {selectedStudent.details.ageSex}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-gray-500">Contact Number:</span> {selectedStudent.details.contact}</p>
                    <p><span className="text-gray-500">Address:</span> {selectedStudent.details.address}</p>
                    <p><span className="text-gray-500">Emergency Contact:</span> {selectedStudent.details.emergencyContact}</p>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mt-4">Session Details</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-gray-500">Mode:</span> {selectedStudent.details.mode}</p>
                    <p><span className="text-gray-500">Date:</span> {selectedStudent.details.date}</p>
                    <p><span className="text-gray-500">Time:</span> {selectedStudent.details.time}</p>
                    <p><span className="text-gray-500">Current Status:</span> 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${selectedStudent.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedStudent.status === 'Reviewed' ? 'bg-green-100 text-green-800' : 
                          selectedStudent.status === 'Rescheduled' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {selectedStudent.status}
                      </span>
                    </p>
                    {selectedStudent.remarks && (
                      <p><span className="text-gray-500">Remarks:</span> {selectedStudent.remarks}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">Areas of Concern</h4>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Personal</h5>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {selectedStudent.details.personal.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Interpersonal</h5>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {selectedStudent.details.interpersonal.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Academic</h5>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {selectedStudent.details.academics.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Family</h5>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {selectedStudent.details.family.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleReschedule}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reschedule
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-[#340013] text-white text-sm font-medium rounded-md hover:bg-[#5a0021] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#340013]"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmittedFormsManagement;
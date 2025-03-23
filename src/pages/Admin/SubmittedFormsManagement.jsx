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

// RescheduleModal Component
function RescheduleModal({ onClose, onSubmit, student }) {
    const [rescheduleData, setRescheduleData] = useState({
        date: "",
        time: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRescheduleData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(rescheduleData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <div className="w-[700px] bg-white border rounded-lg shadow-lg flex relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">✖</button>
                <div className="w-1/2 flex justify-center items-center p-6 border-r">
                    <img src="/src/assets/img/cmslogo.png" alt="Logo" className="w-32 h-32" />
                </div>
                <div className="w-1/2 p-8">
                    <h2 className="text-xl font-bold mb-4">Reschedule Session</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="text-sm font-medium">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={rescheduleData.date}
                            onChange={handleInputChange}
                            className="border rounded-md p-2"
                            placeholder="Enter new date"
                        />
                        <label className="text-sm font-medium">Time</label>
                        <input
                            type="time"
                            name="time"
                            value={rescheduleData.time}
                            onChange={handleInputChange}
                            className="border rounded-md p-2"
                            placeholder="Enter new time"
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <button type="button" onClick={onClose} className="text-gray-600">Cancel</button>
                            <button type="submit" className="bg-[#3A0323] hover:bg-[#2a021a] text-white px-4 py-2 rounded-md transition-colors">Confirm</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function SubmittedFormsManagement() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false); // New state for reschedule modal
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(null); // Added for tab navigation
    const [remarks, setRemarks] = useState({});

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

    const openRescheduleModal = () => {
        setIsRescheduleModalOpen(true);
    };

    const closeRescheduleModal = () => {
        setIsRescheduleModalOpen(false);
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

    const handleReschedule = async (rescheduleData) => {
        if (!selectedStudent) return;

        const result = await updateFormStatus(
            selectedStudent.id,
            'Rescheduled',
            `Rescheduled to ${rescheduleData.date} at ${rescheduleData.time}`
        );

        if (result.success) {
            setForms(forms.map(form =>
                form.id === selectedStudent.id
                    ? { ...form, status: 'Rescheduled', remarks: `Rescheduled to ${rescheduleData.date} at ${rescheduleData.time}` }
                    : form
            ));
            closeRescheduleModal();
            closeModal();
        } else {
            alert("Failed to update session status. Please try again.");
        }
    };

    const handleRemarksChange = async (formId, newRemarks) => {
        setRemarks(prevRemarks => ({ ...prevRemarks, [formId]: newRemarks }));

        const result = await updateFormStatus(formId, null, newRemarks); // Pass null for status to only update remarks
        if (result.success) {
            setForms(forms.map(form =>
                form.id === formId
                    ? { ...form, remarks: newRemarks }
                    : form
            ));
        } else {
            alert("Failed to update remarks. Please try again.");
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
                <h1 className="text-2xl font-bold mb-6">Submitted Forms Management</h1>

                {/* Non-Referrals Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Non-Referrals</h2>
                    <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Year
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Referral
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {nonReferralForms.map((form) => (
                                    <tr key={form.id} className="hover:bg-gray-50" onClick={() => openModal(form)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{form.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.course}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.year}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.referral}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${form.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                form.status === 'Reviewed' ? 'bg-green-100 text-green-800' :
                                                    form.status === 'Rescheduled' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {form.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={remarks[form.id] || form.remarks}
                                                onChange={(e) => handleRemarksChange(form.id, e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value=""></option>
                                                <option value="Attended">Attended</option>
                                                <option value="Follow up">Follow up</option>
                                                <option value="No Show">No Show</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Referrals Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Referrals</h2>
                    <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Year
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Referral
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {referralForms.map((form) => (
                                    <tr key={form.id} className="hover:bg-gray-50" onClick={() => openModal(form)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{form.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.course}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.year}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{form.referral}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${form.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                form.status === 'Reviewed' ? 'bg-green-100 text-green-800' :
                                                    form.status === 'Rescheduled' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {form.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={remarks[form.id] || form.remarks}
                                                onChange={(e) => handleRemarksChange(form.id, e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value=""></option>
                                                <option value="Follow up">Follow up</option>
                                                <option value="No Show">No Show</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">Areas of Concern</h4>
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <h5 className="font-semibold text-gray-700">Personal:</h5>
                                        <ul>
                                            {selectedStudent.details.personal.map((concern, index) => (
                                                <li key={index} className="ml-4 list-disc">{concern}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700">Interpersonal:</h5>
                                        <ul>
                                            {selectedStudent.details.interpersonal.map((concern, index) => (
                                                <li key={index} className="ml-4 list-disc">{concern}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700">Academics:</h5>
                                        <ul>
                                            {selectedStudent.details.academics.map((concern, index) => (
                                                <li key={index} className="ml-4 list-disc">{concern}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-700">Family:</h5>
                                        <ul>
                                            {selectedStudent.details.family.map((concern, index) => (
                                                <li key={index} className="ml-4 list-disc">{concern}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 flex justify-end items-center space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 bg-[#3A0323] text-white rounded-md hover:bg-[#2a021a] focus:outline-none focus:ring-2 focus:ring-green-200"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => {
                                    openRescheduleModal();
                                }}
                                className="px-4 py-2 bg-[#3A0323] text-white rounded-md hover:bg-[#2a021a] focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isRescheduleModalOpen && selectedStudent && (
                <RescheduleModal
                    onClose={closeRescheduleModal}
                    onSubmit={handleReschedule}
                    student={selectedStudent}
                />
            )}
        </div>
    );
}

export default SubmittedFormsManagement;

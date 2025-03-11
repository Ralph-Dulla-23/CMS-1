import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../ui/studentnavbar";
import { submitStudentInterviewForm } from '../../firebase/firestoreService';

export default function Request() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        consentGiven: false,
        studentName: "",
        dateTime: "",
        dateOfBirth: "",
        contactNo: "",
        courseYearSection: "",
        ageSex: "",
        presentAddress: "",
        emergencyContactPerson: "",
        emergencyContactNo: "",
        selfDescription: "",
        importantThings: "",
        friends: "",
        classParticipation: "",
        family: "",
        comfortableConfidant: "",
        additionalComments: "",
        areasOfConcern: {
            personal: [],
            interpersonal: [],
            academic: [],
            family: []
        }
    });

    const steps = [
        { label: "Consent", progress: 10 },
        { label: "Personal Information", progress: 25 },
        { label: "Self-Assessment", progress: 50 },
        { label: "Additional Information", progress: 75 },
        { label: "Concern", progress: 100 },
    ];

    const handleCheckboxChange = (category, value) => {
        const currentValues = formData.areasOfConcern[category];
        setFormData({
            ...formData,
            areasOfConcern: {
                ...formData.areasOfConcern,
                [category]: currentValues.includes(value)
                    ? currentValues.filter(item => item !== value)
                    : [...currentValues, value]
            }
        });
    };

    const nextStep = () => {
        if (step === 0 && !formData.consentGiven) return;
        setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const result = await submitStudentInterviewForm(formData);
        if (result.success) {
            alert("Form submitted successfully!");
            navigate('/Dashboard');
        } else {
            alert("Failed to submit form. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <StudentNavbar />
            <div className="max-w-4xl mx-auto mt-10 p-5">
                <h2 className="text-2xl font-bold text-center mb-5">Student Initial/Routine Interview</h2>

                {/* Progress bar */}
                <div className="relative w-full bg-gray-200 h-3 rounded-full mb-6 overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-[#3B021F] transition-all duration-500" style={{ width: `${steps[step].progress}%` }}></div>
                </div>

                {/* Steps Display */}
                <div className="flex justify-between mb-6">
                    {steps.map((s, i) => (
                        <div key={i} className={`flex flex-col items-center ${i <= step ? "text-[#3B021F]" : "text-gray-400"}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${i <= step ? "bg-[#3B021F]" : "bg-gray-300"}`}>
                                {i + 1}
                            </div>
                            <span className="text-xs mt-2 text-center w-20">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Form Fields */}
                {step === 0 && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Consent Form</h3>
                        <p className="mb-4">
                            I hereby give my consent to the University of the Immaculate Conception...
                        </p>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.consentGiven}
                                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                                className="mr-2"
                            />
                            <span>I understand and agree to the terms above</span>
                        </label>
                    </div>
                )}

        {step === 1 && (
            <div>
              <label className="block mb-2 font-semibold">Name</label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Date/Time</label>
              <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Contact No.</label>
              <input type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Course/Yr. & Section</label>
              <input type="text" name="courseYearSection" value={formData.courseYearSection} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Age/Sex</label>
              <input type="text" name="ageSex" value={formData.ageSex} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Present Address</label>
              <input type="text" name="presentAddress" value={formData.presentAddress} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Emergency Contact Person</label>
              <input type="text" name="emergencyContactPerson" value={formData.emergencyContactPerson} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Emergency Contact No.</label>
              <input type="text" name="emergencyContactNo" value={formData.emergencyContactNo} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
            </div>
          )}

        {step === 2 && (
          <div>
    
          <label className="block mb-2">1. What do you think of yourself? How do you describe yourself?</label>
          <textarea
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded mb-4"
            name="selfDescription"
            value={formData.selfDescription}
            onChange={handleChange}
          ></textarea>
          <label className="block mb-2">2. What are the most important things to you?</label>
          <textarea
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded mb-4"
            name="importantThings"
            value={formData.importantThings}
            onChange={handleChange}
          ></textarea>
          <label className="block mb-2">3. Tell me about your friends. What are the things you like or dislike doing with them?</label>
          <textarea
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded mb-4"
            name="friends"
            value={formData.friends}
            onChange={handleChange}
          ></textarea>
          <label className="block mb-2">4. What do you like or dislike about your class? Describe your participation in class activities.</label>
          <textarea
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded mb-4"
            name="classParticipation"
            value={formData.classParticipation}
            onChange={handleChange}
          ></textarea>
          
        </div>
        )}

        {step === 3 && (
            <div>
            <label className="block mb-2">5. Tell me about your family. How is your relationship with each member of the family? Who do you like or dislike among them? Why?</label>
          <textarea
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded mb-4"
            name="family"
            value={formData.family}
            onChange={handleChange}
          ></textarea>
          <label className="block mb-2">6. To whom do you feel comfortable sharing your problems? Why?</label>
          <textarea
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded mb-4"
            name="comfortableConfidant"
            value={formData.comfortableConfidant}
            onChange={handleChange}
          ></textarea>
          <label className="block mb-2">7. Is there anything I haven't asked that you like to tell me?</label>
          <textarea
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded mb-4"
            name="additionalComments"
            value={formData.additionalComments}
            onChange={handleChange}
          ></textarea>
          
          </div>
        )} 

         {step === 4 && (
            <div>
            <h2 className="text-xl font-bold mb-4">Areas of Concern</h2>
            
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Personal</h3>
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        value="notConfident"
                        checked={formData.areasOfConcern.personal.includes("notConfident")}
                        onChange={() => handleCheckboxChange("personal", "notConfident")}
                      /> I do not feel confident about myself
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        value="hardTimeDecisions"
                        checked={formData.areasOfConcern.personal.includes("hardTimeDecisions")}
                        onChange={() => handleCheckboxChange("personal", "hardTimeDecisions")}
                      /> I have a hard time making decisions
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="problemSleeping"
                        checked={formData.areasOfConcern.personal.includes("problemSleeping")}
                        onChange={() => handleCheckboxChange("personal", "problemSleeping")} 
                      /> I have a problem with sleeping
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        value="moodNotStable"
                        checked={formData.areasOfConcern.personal.includes("moodNotStable")}
                        onChange={() => handleCheckboxChange("personal", "moodNotStable")}
                      /> I have noticed that my mood is not stable
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Interpersonal</h3>
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="beingBullied"
                        checked={formData.areasOfConcern.interpersonal.includes("beingBullied")}
                        onChange={() => handleCheckboxChange("interpersonal", "beingBullied")}
                      /> I am being bullied
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        value="cannotHandlePeerPressure"
                        checked={formData.areasOfConcern.interpersonal.includes("cannotHandlePeerPressure")}
                        onChange={() => handleCheckboxChange("interpersonal", "cannotHandlePeerPressure")}
                      /> I cannot handle peer pressure
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        value="difficultyGettingAlong"
                        checked={formData.areasOfConcern.interpersonal.includes("difficultyGettingAlong")}
                        onChange={() => handleCheckboxChange("interpersonal", "difficultyGettingAlong")}
                      /> I have difficulty getting along with others
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Academic</h3>
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="overlyWorriedAcademic"
                        checked={formData.areasOfConcern.academic.includes("overlyWorriedAcademic")}
                        onChange={() => handleCheckboxChange("academic", "overlyWorriedAcademic")}
                      /> I am overly worried about my academic performance
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="notMotivatedStudy"
                        checked={formData.areasOfConcern.academic.includes("notMotivatedStudy")}
                        onChange={() => handleCheckboxChange("academic", "notMotivatedStudy")}
                      /> I am not motivated to study
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="difficultyUnderstanding"
                        checked={formData.areasOfConcern.academic.includes("difficultyUnderstanding")}
                        onChange={() => handleCheckboxChange("academic", "difficultyUnderstanding")}
                      /> I have difficulty understanding the class lessons
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Family</h3>
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="hardTimeDealingParents"
                        checked={formData.areasOfConcern.family.includes("hardTimeDealingParents")}
                        onChange={() => handleCheckboxChange("family", "hardTimeDealingParents")}
                      /> I have a hard time dealing with my parents/guardian's expectations
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="difficultyOpeningUp"
                        checked={formData.areasOfConcern.family.includes("difficultyOpeningUp")}
                        onChange={() => handleCheckboxChange("family", "difficultyOpeningUp")}
                      /> I have difficulty opening up to family member/s
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        value="financialConcerns"
                        checked={formData.areasOfConcern.family.includes("financialConcerns")}
                        onChange={() => handleCheckboxChange("family", "financialConcerns")}
                      /> Our family is having financial concerns
                    </label>
                  </div>
                </div>
              </div>
            
          </div>
        )} 


                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={prevStep}
                        className={`px-4 py-2 border border-gray-400 rounded-md ${step === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={step === 0}
                    >
                        Back
                    </button>
                    <button
                        onClick={step === steps.length - 1 ? handleSubmit : nextStep}
                        className="px-4 py-2 bg-[#3B021F] text-white rounded-md flex items-center"
                    >
                        {step === steps.length - 1 ? "Submit" : "Next"}
                        {step !== steps.length - 1 && <span className="ml-2">→</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}

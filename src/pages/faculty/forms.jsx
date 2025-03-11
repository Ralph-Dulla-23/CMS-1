import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ui/ProfileContext";
import FacultyNavbar from "../ui/facultynavbar";

export default function Forms() {
  const navigate = useNavigate();
  const { openProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    studentName: "",
    studentID: "",
    facultyName: "",
    department: "",
    referralReason: "",
    concerns: []
  });

  const steps = [
    { label: "Student Information", progress: 25 },
    { label: "Personal/Social", progress: 50 },
    { label: "Faculty Information", progress: 75 },
    { label: "Additional Information", progress: 100 },
  ];

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const concerns = checked
        ? [...prevData.concerns, value]
        : prevData.concerns.filter((c) => c !== value);
      return { ...prevData, concerns };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <FacultyNavbar />
      
      <div className="max-w-2xl mx-auto mt-20 space-y-6">
        <h2 className="text-2xl font-bold text-center">Referral form</h2>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="absolute top-0 left-0 h-full bg-[#3B021F] rounded-full transition-all duration-300" style={{ width: `${steps[step].progress}%` }}></div>
        </div> 

        {/* Step Indicators */}
        <div className="flex justify-between mb-6">
          {steps.map((s, i) => (
            <div key={i} className={`flex flex-col items-center ${i <= step ? "text-[#3B021F]" : "text-gray-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${i <= step ? "bg-[#3B021F]" : "bg-gray-300"}`}>
                {i + 1}
              </div>
              <span className="text-xs mt-2">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div>
          {step === 0 && (
            <div>
              <label className="block mb-2 font-semibold">Client's Name</label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter student name" className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Course/Year</label>
              <input type="text" name="studentID" value={formData.studentID} onChange={handleChange} placeholder="Enter student ID" className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <label className="block mb-2 font-semibold">Date</label>
              <input type="text" name="studentID" value={formData.studentID} onChange={handleChange} placeholder="Enter student ID" className="w-full p-2 border border-gray-300 rounded-md mb-4" />
            </div>
          )}

          {step === 1 && (
            <div>
              <label className="block mb-2 font-semibold">Personal/Social Concerns</label>
              <div className="space-y-2">
                {["Adjustment to college life", "Attitudes toward studies", "Financial problems", "Health", "Lack of self-confidence/Self-esteem", "Relationship with family/friends/BF/GF"].map((concern, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      value={concern}
                      checked={formData.concerns.includes(concern)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <span>{concern}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
            <label className="block mb-2 font-semibold">Academic</label>
            <div className="space-y-2">
              {["Unmet Subject requiremnts/projects", "attendance:absences/tardiness", "course choice: own/Sombody else", "failing grade", "school choice", "study habit","time mgt./schedule"].map((concern, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    value={concern}
                    checked={formData.concerns.includes(concern)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span>{concern}</span>
                </div>
              ))}
            </div>
          </div>
          )}

          {step === 3 && (
             <div>
             <label className="block mb-2 font-semibold">Other Concerns</label>
             <textarea name="otherConcerns" value={formData.otherConcerns} onChange={handleChange} placeholder="Please specify any other concerns not listed above" className="w-full p-2 border border-gray-300 rounded-md mb-4"></textarea>
             
             <label className="block mb-2 font-semibold">Observations/Remarks</label>
             <textarea name="observations" value={formData.observations} onChange={handleChange} placeholder="Enter your observations or remarks about the student" className="w-full p-2 border border-gray-300 rounded-md mb-4"></textarea>
             
             <label className="block mb-2 font-semibold">Referred by</label>
             <input type="text" name="referredBy" value={formData.referredBy} onChange={handleChange} placeholder="Your name" className="w-full p-2 border border-gray-300 rounded-md mb-4" />
           </div>
         )}
      
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button onClick={prevStep} className="px-4 py-2 border border-gray-400 rounded-md">Back</button>
          )}
          <button onClick={step === steps.length - 1 ? () => console.log("Submit Referral", formData) : nextStep} className="px-4 py-2 bg-[#3B021F] text-white rounded-md flex items-center">
            {step === steps.length - 1 ? "Submit Referral" : "Next"}
            {step !== steps.length - 1 && <span className="ml-2">→</span>}
          </button>
        </div>

        
      </div>
    </div>
  );
}

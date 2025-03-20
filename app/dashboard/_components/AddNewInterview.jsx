'use client';

import { chatSession } from '@utils/GeminiAi';
import React, { useState } from 'react';
// import {db} from '@utils/db';
import { useUser } from '@clerk/nextjs';
import {MockInterview} from '@utils/schema';
import {db} from '@utils/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


export default function AddNewInterview() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const[jsonResponse, setJsonResponse] = useState([]);
  const {user}=useUser();
  const router=useRouter();

  const handleJobPositionChange = (e) => setJobPosition(e.target.value);
  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);
  const handleExperienceChange = (e) => setExperience(e.target.value);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    console.log('Job Position:', jobPosition);
    console.log('Job Description:', jobDescription);
    console.log('Experience:', experience);
  
    const inputPrompt = `job position: ${jobPosition}, job description: ${jobDescription}, experience: ${experience}. Based on this input, give me 5 interview-related questions and answers in JSON format.`;
  
    try {
      const result = await chatSession.sendMessage(inputPrompt);
      let responseText = await result.response.text();
  
      // 🛑 Clean and sanitize the response
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  
      // ✅ Try parsing the JSON safely
      let mockResponse;
      try {
        mockResponse = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Invalid JSON from AI:', jsonError, responseText);
        alert('Error: The AI response is not valid JSON. Try again.');
        setLoading(false);
        return;
      }
  
      console.log('Mock Response:', mockResponse);
      setJsonResponse(mockResponse);
  
      // ✅ Only insert into DB if JSON is valid
      if (mockResponse) {
        // Prepare the document to insert
        const mockDocument = {
          jsonMockResp: JSON.stringify(mockResponse),
          jobPosition,
          jobDesc: jobDescription,
          jobExperience: experience,
          createdby: user?.primaryEmailAddress?.emailAddress,
          createdat: new Date().toISOString(),
          mockId: Math.random().toString(36).substring(7), // this is just a client-side mock ID, Firestore will generate its own ID
        };
  
        // Insert the document into Firestore
        const docRef = await addDoc(collection(db, "mockinterviews"), mockDocument);
  
        console.log('Document written with ID:', docRef.id);
  
        // Redirect to the new interview mock page
        router.push(`/dashboard/interview/${docRef.id}`);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  
    setLoading(false); // Stop loading
  };
  

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Add New Button */}
      <div
        className="p-4 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={toggleModal}
      >
        <h2 className="font-bold text-lg text-center">+ Add New Interview</h2>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-3xl w-full">
            <h3 className="text-lg font-semibold text-center mb-6">
              Tell us about the job you're applying for
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Job Position */}
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Job Position / Role</label>
                <input
                  type="text"
                  value={jobPosition}
                  onChange={handleJobPositionChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  className="w-full p-3 border rounded-md"
                  rows="4"
                  required
                />
              </div>

              {/* Experience */}
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Experience (years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={handleExperienceChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-6 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-md transition-all flex items-center gap-2 ${
                    loading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Generating from AI...
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { chatSession } from "@utils/GeminiAi";
import React, { useState } from "react";
// import {db} from '@utils/db';
import { useUser } from "@clerk/nextjs";
import { MockInterview } from "@utils/schema";
import { db } from "@utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddNewInterview() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const handleJobPositionChange = (e) => setJobPosition(e.target.value);
  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);
  const handleExperienceChange = (e) => setExperience(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    console.log("Job Position:", jobPosition);
    console.log("Job Description:", jobDescription);
    console.log("Experience:", experience);

    const inputPrompt = `job position: ${jobPosition}, job description: ${jobDescription}, experience: ${experience}. Based on this input, give me 5 interview-related questions and answers in JSON format.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      let responseText = await result.response.text();

      // 🛑 Clean and sanitize the response
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // ✅ Try parsing the JSON safely
      let mockResponse;
      try {
        mockResponse = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Invalid JSON from AI:", jsonError, responseText);
        alert("Error: The AI response is not valid JSON. Try again.");
        setLoading(false);
        return;
      }

      console.log("Mock Response:", mockResponse);
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
        const docRef = await addDoc(
          collection(db, "mockinterviews"),
          mockDocument
        );

        console.log("Document written with ID:", docRef.id);

        // Redirect to the new interview mock page
        router.push(`/dashboard/interview/${docRef.id}`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }

    setLoading(false); // Stop loading
  };

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Add New Button */}
      <div
        className="card-responsive p-6 hover:scale-105 cursor-pointer transition-smooth"
        onClick={toggleModal}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="font-bold text-lg sm:text-xl text-center">
            Add New Interview
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Create a new AI-powered interview session
          </p>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Tell us about the job you're applying for
                </h3>
                <button
                  onClick={toggleModal}
                  className="p-2 hover:bg-accent rounded-md transition-fast"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Position */}
                <div>
                  <label className="block mb-2 font-semibold">
                    Job Position / Role
                  </label>
                  <input
                    type="text"
                    value={jobPosition}
                    onChange={handleJobPositionChange}
                    className="input-responsive"
                    placeholder="e.g., Frontend Developer, Data Scientist"
                    required
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className="block mb-2 font-semibold">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                    className="textarea-responsive"
                    rows="4"
                    placeholder="Paste the job description here..."
                    required
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block mb-2 font-semibold">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={experience}
                    onChange={handleExperienceChange}
                    className="input-responsive"
                    placeholder="e.g., 3"
                    min="0"
                    max="50"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="btn-outline order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`order-1 sm:order-2 flex items-center justify-center gap-2 ${
                      loading
                        ? "btn-secondary cursor-not-allowed opacity-50"
                        : "btn-primary"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        <span className="mobile-only">Generating...</span>
                        <span className="mobile-hidden">
                          Generating from AI...
                        </span>
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

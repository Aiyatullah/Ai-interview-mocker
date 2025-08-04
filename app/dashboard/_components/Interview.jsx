"use client";
import React, { useState, useEffect } from "react";
import { db } from "@utils/firebase"; // Firebase import
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useUser } from "@clerk/nextjs"; // Clerk hook to get the user

function Interview() {
  const { user } = useUser(); // Get the logged-in user
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    if (!user) return; // Ensure user is logged in

    const fetchInterviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mockinterviews"));

        if (!querySnapshot.empty) {
          const userEmail = user.primaryEmailAddress.emailAddress; // Get logged-in user's email

          // Filter interviews that belong to the logged-in user
          const interviewData = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((interview) => interview.createdby === userEmail);

          setInterviews(interviewData);
        } else {
          console.log("No interviews found!");
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-balance">Your Interviews</h2>
        <p className="text-muted-foreground text-balance">
          Manage and continue your interview sessions
        </p>
      </div>

      {/* Interview Cards Grid */}
      <div className="dashboard-grid">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div key={interview.id} className="interview-card">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg sm:text-xl text-balance">
                    {interview.jobPosition}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{interview.jobExperience} years</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {interview.jobDesc}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {new Date(interview.createdat).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Button Row */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                {/* Start Interview Button */}
                <Link
                  href={`/dashboard/interview/${interview.id}`}
                  className="flex-1"
                >
                  <button className="btn-primary w-full">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="mobile-only">Start</span>
                    <span className="mobile-hidden">Start Interview</span>
                  </button>
                </Link>

                {/* Feedback Button */}
                <Link
                  href={`/dashboard/interview/${interview.id}/feedback`}
                  className="flex-1"
                >
                  <button className="btn-outline w-full">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="mobile-only">Feedback</span>
                    <span className="mobile-hidden">View Feedback</span>
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No interviews yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first interview to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;

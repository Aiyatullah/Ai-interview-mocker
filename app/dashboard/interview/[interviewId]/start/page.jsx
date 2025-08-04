"use client";
import { db } from '@utils/firebase';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation'; // Use useParams to get dynamic URL params
import Link from 'next/link'; // Import Link component
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

export default function Start() {
  const params = useParams(); // Get the interview ID from the params
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const docRef = doc(db, 'mockinterviews', params.interviewId); // Use interviewId from params
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setInterviewDetails(docSnap.data()); // Set interview details
        const jsonMockResponse = JSON.parse(docSnap.data().jsonMockResp);
        setMockInterviewQuestions(jsonMockResponse); // Set the questions for the interview
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-balance">Interview Session</h1>
        {interviewDetails && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium">{interviewDetails.jobPosition}</span>
            <span>•</span>
            <span>{interviewDetails.jobExperience} years experience</span>
          </div>
        )}
      </div>

      {/* Main Interview Layout */}
      <div className="interview-layout">
        {/* Left Column - Questions Section */}
        <div className="question-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Questions</h2>
            <div className="text-sm text-muted-foreground">
              {activeQuestionIndex + 1} of {mockInterviewQuestions.length}
            </div>
          </div>
          <QuestionSection 
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
        </div>

        {/* Right Column - Webcam Section */}
        <div className="recording-section">
          <h2 className="text-lg font-semibold mb-4">Record Your Answer</h2>
          <RecordAnswerSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
        </div>
      </div>

      {/* Finish Button - Fixed at bottom on mobile, inline on desktop */}
      <div className="flex justify-center lg:hidden">
        <Link href={`/dashboard/interview/${params.interviewId}/feedback`}>
          <button className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Finish Interview
          </button>
        </Link>
      </div>

      {/* Desktop Finish Button */}
      <div className="desktop-only fixed bottom-6 right-6">
        <Link href={`/dashboard/interview/${params.interviewId}/feedback`}>
          <button className="btn-primary shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Finish Interview
          </button>
        </Link>
      </div>
    </div>
  );
}

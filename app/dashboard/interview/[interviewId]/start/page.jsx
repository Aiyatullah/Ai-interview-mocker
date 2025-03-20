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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left Column - Questions Section */}
      <div className="p-5 border rounded-lg">
        <h3 className="font-bold text-xl mb-4">Questions</h3>
        <QuestionSection 
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />
      </div>

      {/* Right Column - Webcam Section */}
      <RecordAnswerSection
        mockInterviewQuestions={mockInterviewQuestions}
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
      />

      {/* Finish Button */}
      <div className="fixed bottom-4 right-4">
        <Link href={`/dashboard/interview/${params.interviewId}/feedback`}> {/* Pass interviewId from params */}
          <button className="p-3 bg-yellow-200 text-green rounded-lg">
            Finish Interview
          </button>
        </Link>
      </div>

    </div>
  );
}

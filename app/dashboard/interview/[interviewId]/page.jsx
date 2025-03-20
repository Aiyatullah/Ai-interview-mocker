"use client"; 
import { db } from '@utils/firebase';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { useParams } from 'next/navigation';
import Webcam from 'react-webcam';
import { WebcamIcon, Lightbulb } from 'lucide-react';
import Link from 'next/link';

function Interview() {
  const params = useParams(); // Using Next.js's useParams hook
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    const GetInterviewDetails = async () => {
      try {
        const docRef = doc(db, "mockinterviews", params.interviewId); // Using params correctly
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInterviewDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching interview details: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.interviewId) {
      GetInterviewDetails();
    }
  }, [params?.interviewId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='my-10 grid grid-cols-2 gap-10 items-center justify-center'>
      {/* Left - Interview Details */}
      <div className="p-5 bg-white shadow-lg rounded-lg">
        <h2 className="font-bold text-2xl mb-4">Interview Details</h2>
        <div className="space-y-2">
          <h3><span className="font-semibold">Job Position:</span> {interviewDetails.jobPosition}</h3>
          <h3><span className="font-semibold">Job Description:</span> {interviewDetails.jobDesc}</h3>
          <h3><span className="font-semibold">Experience:</span> {interviewDetails.jobExperience} years</h3>
        </div>
      </div>

      {/* Right - Webcam & Lightbulb Info */}
      <div className="flex flex-col items-center justify-center p-5 bg-white shadow-lg rounded-lg">
        {/* Light Bulb Info */}
        <div className="flex items-center mb-4 bg-yellow-100 p-3 rounded-md">
          <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
          <p className="text-gray-700">
            Enable the webcam to start the interview. You will answer 5 questions one by one. Good luck!
          </p>
        </div>

        <h2 className="font-bold text-2xl mb-4">Let's Get Started</h2>
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{
              height: 300,
              width: 300,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
        ) : (
          <>
            <WebcamIcon className='h-72 w-full my-4 p-20 bg-secondary rounded-lg border' />
            <button 
              onClick={() => setWebCamEnabled(!webCamEnabled)}
              className='bg-primary text-white p-2 rounded-lg mt-4'
            >
              Open Webcam
            </button>
          </>
        )}

        {/* Start Interview Button */}
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <button 
            className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg mt-6 w-40'
            //disabled={!webCamEnabled}
          >
            Start Interview
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;

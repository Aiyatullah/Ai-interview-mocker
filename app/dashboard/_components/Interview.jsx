"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@utils/firebase'; // Firebase import
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

function Interview() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    // Fetch interviews from Firestore
    const fetchInterviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'mockinterviews'));
        
        if (!querySnapshot.empty) {
          const interviewData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInterviews(interviewData);
        } else {
          console.log('No interviews found!');
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="mt-4">
      <h3 className="font-bold text-xl mb-4">Your Interviews</h3>

      {/* Flex container for interview boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div key={interview.id} className="flex flex-col items-start p-4 border rounded-md">
              <h4 className="font-semibold text-lg">{interview.jobPosition}</h4>
              <p className="text-sm text-gray-600">{interview.jobDesc}</p>
              <p className="text-sm text-gray-600">Experience: {interview.jobExperience}</p>

              {/* Button Row */}
              <div className="flex gap-4 mt-4">
                {/* Feedback Button */}
                <Link href={`/dashboard/interview/${interview.id}/feedback`}>
                  <button className="p-2 bg-amber-300 text-white rounded-lg hover:bg-blue-700">
                    View Feedback
                  </button>
                </Link>

                {/* Start Interview Button */}
                <Link href={`/dashboard/interview/${interview.id}`}>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-green-700">
                    Start Interview
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No interviews available. Please add a new interview.</p>
        )}
      </div>
    </div>
  );
}

export default Interview;

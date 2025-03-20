"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@utils/firebase';
import { doc, collection, getDocs } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function Feedback() {
  const [responses, setResponses] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // State to store average rating
  const { interviewId } = useParams(); // Get interviewId from params

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const docRef = doc(db, 'mockinterviews', interviewId); // Reference to interview document
        const responsesCollectionRef = collection(docRef, 'responses'); // Reference to responses collection

        const responsesSnapshot = await getDocs(responsesCollectionRef);

        if (!responsesSnapshot.empty) {
          // If responses are found, map over them and store in state
          const responsesData = responsesSnapshot.docs.map((doc) => doc.data());
          setResponses(responsesData);

          // Calculate the average rating
          const totalRating = responsesData.reduce((acc, response) => acc + response.rating, 0);
          const average = totalRating / responsesData.length;
          setAverageRating(average.toFixed(2)); // Set the average rating (rounded to 2 decimal places)
        } else {
          console.log('No responses found!');
        }
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };

    fetchResponses();
  }, [interviewId]); // Fetch data whenever interviewId changes

  return (
    <div className="p-4">
      <h1 className="text-green-600 font-bold text-2xl">Congratulations!</h1>
      <p className="text-gray-800 mt-2 font-bold">Here is your feedback:</p>

      {/* Display Average Rating */}
      <div className="mt-4 p-4 mb-4 bg-gray-200 rounded-md">
        <h3 className="font-semibold">Average Rating: </h3>
        <p
  className={`text-sm ${
    averageRating >= 4
      ? 'text-green-600' // Green for high ratings
      : averageRating >= 3
      ? 'text-yellow-600' // Yellow for medium ratings
      : 'text-red-600' // Red for low ratings
  }`}
>
  Your overall rating is {averageRating} / 5
</p>
{/* Home Button */}
<Link href="/dashboard">
        <button className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go to Dashboard
        </button>
      </Link>
      </div>

      {responses.length > 0 ? (
        <div className="mt-4">
          {/* Map through responses and display each one */}
          {responses.map((response, index) => (
            <div key={index} className="mb-4">
              <CollapsibleQuestionCard
                question={response.question}
                userAnswer={response.userAnswer}
                expectedAnswer={response.expectedAnswer}
                feedback={response.feedback}
                rating={response.rating}
                index={index}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading responses...</p>
      )}
    </div>
  );
}

function CollapsibleQuestionCard({
  question,
  userAnswer,
  expectedAnswer,
  feedback,
  rating,
  index,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-4 border rounded-md">
      <div
        onClick={toggleCollapse}
        className="cursor-pointer flex justify-between items-center p-2 bg-gray-200 rounded-md"
      >
        <h3 className="font-semibold">Question #{index + 1}</h3>
        <span>{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div className="mt-2">
          {/* Question Section with Different Color Box */}
          <div className="p-4 mb-2 bg-blue-100 rounded-md">
            <p className="text-sm text-gray-600"><strong>Question:</strong> {question}</p>
          </div>

          {/* User Answer Section with Different Color Box */}
          <div className="p-4 mb-2 bg-yellow-100 rounded-md">
            <p className="text-sm text-gray-600"><strong>Your Answer:</strong> {userAnswer}</p>
          </div>

          {/* Expected Answer Section with Different Color Box */}
          <div className="p-4 mb-2 bg-green-100 rounded-md">
            <p className="text-sm text-gray-600"><strong>Expected Answer:</strong> {expectedAnswer}</p>
          </div>

          {/* Feedback Section with Different Color Box */}
          <div className="p-4 mb-2 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600"><strong>Feedback:</strong> {feedback}</p>
          </div>

          {/* Rating Section with Color Indicating Rating */}
          <div className="mt-2">
            <span className="font-semibold">Rating: </span>
            <span
              className={`${
                rating >= 4
                  ? 'text-green-600'
                  : rating >= 3
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {rating}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

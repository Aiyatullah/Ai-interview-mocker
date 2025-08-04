"use client";
import React, { useState, useEffect } from "react";
import { db } from "@utils/firebase";
import { doc, collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, ChevronDown, ChevronUp, Home, Trophy } from "lucide-react";

export default function Feedback() {
  const [responses, setResponses] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // State to store average rating
  const { interviewId } = useParams(); // Get interviewId from params

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const docRef = doc(db, "mockinterviews", interviewId); // Reference to interview document
        const responsesCollectionRef = collection(docRef, "responses"); // Reference to responses collection

        const responsesSnapshot = await getDocs(responsesCollectionRef);

        if (!responsesSnapshot.empty) {
          // If responses are found, map over them and store in state
          const responsesData = responsesSnapshot.docs.map((doc) => doc.data());
          setResponses(responsesData);

          // Calculate the average rating
          const totalRating = responsesData.reduce(
            (acc, response) => acc + response.rating,
            0
          );
          const average = totalRating / responsesData.length;
          setAverageRating(average.toFixed(2)); // Set the average rating (rounded to 2 decimal places)
        } else {
          console.log("No responses found!");
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };

    fetchResponses();
  }, [interviewId]); // Fetch data whenever interviewId changes

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingMessage = (rating) => {
    if (rating >= 4) return "Excellent performance!";
    if (rating >= 3) return "Good job, keep improving!";
    return "Keep practicing to improve!";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600">
            Congratulations!
          </h1>
        </div>
        <p className="text-muted-foreground">Here is your detailed feedback:</p>
      </div>

      {/* Average Rating Card */}
      <div className="card-responsive p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
          <h2 className="text-xl font-semibold">Overall Performance</h2>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-primary">
              {averageRating}
            </span>
            <span className="text-muted-foreground">/ 5</span>
          </div>

          <p className={`text-sm font-medium ${getRatingColor(averageRating)}`}>
            {getRatingMessage(averageRating)}
          </p>
        </div>

        {/* Home Button */}
        <div className="mt-6">
          <Link href="/dashboard">
            <button className="btn-primary flex items-center gap-2 mx-auto">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Responses */}
      {responses.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Question Details</h2>
          {responses.map((response, index) => (
            <CollapsibleQuestionCard
              key={index}
              question={response.question}
              userAnswer={response.userAnswer}
              expectedAnswer={response.expectedAnswer}
              feedback={response.feedback}
              rating={response.rating}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading responses...</p>
        </div>
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

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="card-responsive">
      <button
        onClick={toggleCollapse}
        className="w-full flex items-center justify-between p-4 hover:bg-accent transition-fast"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </span>
          <div className="text-left">
            <h3 className="font-semibold text-sm sm:text-base">
              Question {index + 1}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {question}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className={`text-sm font-medium ${getRatingColor(rating)}`}>
              {rating}/5
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 border-t">
          {/* Question */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-600">Question</h4>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">{question}</p>
            </div>
          </div>

          {/* Your Answer */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-yellow-600">Your Answer</h4>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm">{userAnswer}</p>
            </div>
          </div>

          {/* Expected Answer */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-600">
              Expected Answer
            </h4>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm">{expectedAnswer}</p>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600">Feedback</h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">{feedback}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rating</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-sm font-medium ${getRatingColor(rating)}`}>
                {rating}/5
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

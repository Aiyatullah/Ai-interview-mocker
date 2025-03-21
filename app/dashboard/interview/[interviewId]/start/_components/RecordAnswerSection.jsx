import React, { useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { chatSession } from '@utils/GeminiAi';
import { db } from '@utils/firebase';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { WebcamIcon, Lightbulb } from 'lucide-react';

export default function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex }) {
  const { interviewId } = useParams();
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState('');
  const [isWebcamOpen, setIsWebcamOpen] = useState(true); // Track webcam state

  const handleStopRecording = async () => {
    stopSpeechToText();
    const finalAnswer = results.map((result) => result.transcript).join(' ');
    setUserAnswer(finalAnswer);

    if (finalAnswer.length < 10) {
      toast.error("Error: The recording is too short, please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const question = mockInterviewQuestions[activeQuestionIndex]?.question;
    const expectedAnswer = mockInterviewQuestions[activeQuestionIndex]?.answer || 'No expected answer provided';

    const feedbackPrompt = `Question: ${question}\nAnswer: ${finalAnswer}\nExpected Answer: ${expectedAnswer}\nPlease provide feedback and a rating out of 5 in JSON format with fields "feedback" and "rating". Keep it concise and avoid any extra information.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      let responseText = await result.response?.text();

      responseText = responseText.replace(/```json|```/g, '').trim();
      let parsedFeedback = JSON.parse(responseText);

      const responsesRef = collection(db, `mockinterviews/${interviewId}/responses`);
      const querySnapshot = await getDocs(query(responsesRef, where('question', '==', question)));

      if (!querySnapshot.empty) {
        const existingDocId = querySnapshot.docs[0].id;
        await setDoc(doc(db, `mockinterviews/${interviewId}/responses`, existingDocId), {
          question,
          userAnswer: finalAnswer,
          expectedAnswer,
          feedback: parsedFeedback.feedback,
          rating: parsedFeedback.rating,
          timestamp: new Date(),
        });
      } else {
        await addDoc(responsesRef, {
          question,
          userAnswer: finalAnswer,
          expectedAnswer,
          feedback: parsedFeedback.feedback,
          rating: parsedFeedback.rating,
          timestamp: new Date(),
        });
      }

      toast.success("✅ Answer saved successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error processing feedback:", error);
      toast.error("⚠️ Something went wrong while processing feedback.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleStartRecording = () => {
    setUserAnswer('');
    startSpeechToText();
  };

  const handleReset = () => {
    stopSpeechToText();
    setUserAnswer('');
    results.length = 0;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
      {/* Lightbulb Hint - Moved Above Navigation Buttons */}
      <div className="flex items-center  bg-yellow-100 p-3 rounded-md mt-6">
        <Lightbulb className="h-6 w-6 text-yellow-500 " />
        <p className="text-gray-700 font-semibold italic">
          Please reset the answer after each question or repeating the question. Good luck!
        </p>
      </div>
      {/* Webcam or Placeholder Icon */}
      <div className="relative w-full flex items-center justify-center p-2">
        {isWebcamOpen ? (
          <Webcam
            mirrored={true}
            style={{ width: '100%', height: '100%' }}
            className="w-full h-64 rounded-lg border border-gray-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-200 rounded-lg border border-gray-300">
            <WebcamIcon className="h-16 w-16 text-gray-500" />
            <p className="text-gray-500 mt-2">Webcam is not enabled</p>
          </div>
        )}
      </div>

      {/* Recording Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`px-5 py-3 rounded-full text-white transition ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-300 hover:bg-green-600'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <button
          onClick={handleReset}
          className="px-8 py-3 rounded-full bg-blue-800 hover:bg-blue-600 text-white transition"
        >
          Reset
        </button>
      </div>

      {/* Live Transcription */}
      {interimResult && (
        <div className="text-lg text-gray-700 mt-4 p-3 border border-gray-300 rounded-lg bg-white w-full">
          <h3 className="font-semibold">Live Transcription:</h3>
          <p>{interimResult}</p>
        </div>
      )}

      {/* Final Answer */}
      {userAnswer && (
        <div className="mt-4 p-3 border border-gray-300 rounded-lg bg-white w-full">
          <h3 className="font-semibold">Final Answer:</h3>
          <p>{userAnswer}</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

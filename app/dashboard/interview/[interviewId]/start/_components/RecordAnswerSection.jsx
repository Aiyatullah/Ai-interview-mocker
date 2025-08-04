import React, { useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { chatSession } from "@utils/GeminiAi";
import { db } from "@utils/firebase";
import { useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  WebcamIcon,
  Lightbulb,
  Mic,
  MicOff,
  RotateCcw,
  Video,
  VideoOff,
} from "lucide-react";

export default function RecordAnswerSection({
  mockInterviewQuestions,
  activeQuestionIndex,
}) {
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

  const [userAnswer, setUserAnswer] = useState("");
  const [isWebcamOpen, setIsWebcamOpen] = useState(true); // Track webcam state

  const handleStopRecording = async () => {
    stopSpeechToText();
    const finalAnswer = results.map((result) => result.transcript).join(" ");
    setUserAnswer(finalAnswer);

    if (finalAnswer.length < 10) {
      toast.error("Error: The recording is too short, please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const question = mockInterviewQuestions[activeQuestionIndex]?.question;
    const expectedAnswer =
      mockInterviewQuestions[activeQuestionIndex]?.answer ||
      "No expected answer provided";

    const feedbackPrompt = `Question: ${question}\nAnswer: ${finalAnswer}\nExpected Answer: ${expectedAnswer}\nPlease provide feedback and a rating out of 5 in JSON format with fields "feedback" and "rating". Keep it concise and avoid any extra information.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      let responseText = await result.response?.text();

      responseText = responseText.replace(/```json|```/g, "").trim();
      let parsedFeedback = JSON.parse(responseText);

      const responsesRef = collection(
        db,
        `mockinterviews/${interviewId}/responses`
      );
      const querySnapshot = await getDocs(
        query(responsesRef, where("question", "==", question))
      );

      if (!querySnapshot.empty) {
        const existingDocId = querySnapshot.docs[0].id;
        await setDoc(
          doc(db, `mockinterviews/${interviewId}/responses`, existingDocId),
          {
            question,
            userAnswer: finalAnswer,
            expectedAnswer,
            feedback: parsedFeedback.feedback,
            rating: parsedFeedback.rating,
            timestamp: new Date(),
          }
        );
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
    setUserAnswer("");
    startSpeechToText();
  };

  const handleReset = () => {
    stopSpeechToText();
    setUserAnswer("");
    results.length = 0;
  };

  return (
    <div className="space-y-6">
      {/* Lightbulb Hint */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800 font-medium">
          Please reset the answer after each question or repeating the question.
          Good luck!
        </p>
      </div>

      {/* Webcam Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Camera</h3>
        <button
          onClick={() => setIsWebcamOpen(!isWebcamOpen)}
          className="btn-outline p-2"
          aria-label={isWebcamOpen ? "Disable camera" : "Enable camera"}
        >
          {isWebcamOpen ? (
            <VideoOff className="w-4 h-4" />
          ) : (
            <Video className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Webcam or Placeholder */}
      <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
        {isWebcamOpen ? (
          <Webcam mirrored={true} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <WebcamIcon className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Camera disabled
            </p>
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
              isRecording ? "bg-destructive hover:bg-destructive/90" : ""
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4" />
                <span className="mobile-only">Stop</span>
                <span className="mobile-hidden">Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span className="mobile-only">Record</span>
                <span className="mobile-hidden">Start Recording</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="btn-outline flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="mobile-only">Reset</span>
            <span className="mobile-hidden">Reset</span>
          </button>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            Recording in progress...
          </div>
        )}
      </div>

      {/* Live Transcription */}
      {interimResult && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Live Transcription:</h4>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{interimResult}</p>
          </div>
        </div>
      )}

      {/* Final Answer */}
      {userAnswer && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Final Answer:</h4>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{userAnswer}</p>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

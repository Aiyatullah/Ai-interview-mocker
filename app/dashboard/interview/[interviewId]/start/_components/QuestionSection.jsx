import React from "react";
import {
  WebcamIcon,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Volume2,
} from "lucide-react";

export default function QuestionSection({
  mockInterviewQuestions,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) {
  const speakQuestion = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find((voice) => voice.name.includes("Female"));
    if (femaleVoice) {
      speech.voice = femaleVoice;
    }
    window.speechSynthesis.speak(speech);
  };

  const handleNext = () => {
    if (activeQuestionIndex < mockInterviewQuestions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Number Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {mockInterviewQuestions.map((_, index) => (
          <button
            key={index}
            className={`p-2 sm:p-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
              activeQuestionIndex === index
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => setActiveQuestionIndex(index)}
          >
            <span className="mobile-only">Q{index + 1}</span>
            <span className="mobile-hidden">Question {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Show selected question and audio button */}
      {activeQuestionIndex !== null && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg sm:text-xl mb-3">
                Question {activeQuestionIndex + 1}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-balance">
                {mockInterviewQuestions[activeQuestionIndex]?.question}
              </p>
            </div>

            <button
              onClick={() =>
                speakQuestion(
                  mockInterviewQuestions[activeQuestionIndex]?.question
                )
              }
              className="btn-secondary p-2 sm:p-3 flex-shrink-0"
              aria-label="Listen to question"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={activeQuestionIndex === 0}
              className={`btn-outline flex items-center gap-2 ${
                activeQuestionIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-accent"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="mobile-only">Prev</span>
              <span className="mobile-hidden">Previous</span>
            </button>

            <div className="text-sm text-muted-foreground">
              {activeQuestionIndex + 1} of {mockInterviewQuestions.length}
            </div>

            <button
              onClick={handleNext}
              disabled={
                activeQuestionIndex >= mockInterviewQuestions.length - 1
              }
              className={`btn-outline flex items-center gap-2 ${
                activeQuestionIndex >= mockInterviewQuestions.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-accent"
              }`}
            >
              <span className="mobile-only">Next</span>
              <span className="mobile-hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

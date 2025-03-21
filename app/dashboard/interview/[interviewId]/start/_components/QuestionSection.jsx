import React from 'react';
import { WebcamIcon, Lightbulb } from 'lucide-react';

export default function QuestionSection({
  mockInterviewQuestions,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) {
  const speakQuestion = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find((voice) => voice.name.includes('Female'));
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
    <div className="relative space-y-4 p-4">
      {/* Question Number Grid */}
      <div className="grid grid-cols-3 gap-4">
        {mockInterviewQuestions.map((_, index) => (
          <div
            key={index}
            className={`cursor-pointer text-center py-2 px-4 border rounded-full ${
              activeQuestionIndex === index
                ? 'bg-blue-800 text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setActiveQuestionIndex(index)}
          >
            Question #{index + 1}
          </div>
        ))}
      </div>

      {/* Show selected question and audio button */}
      {activeQuestionIndex !== null && (
        <div className="mt-4">
          <h3 className="font-bold text-xl mb-2">Question #{activeQuestionIndex + 1}</h3>
          <p>{mockInterviewQuestions[activeQuestionIndex]?.question}</p>
          <button
            onClick={() => speakQuestion(mockInterviewQuestions[activeQuestionIndex]?.question)}
            className="mt-2 p-2 bg-yellow-200 text-black rounded-full"
          >
            🎙️
          </button>
        </div>
      )}

      
      {/* Navigation Buttons - Bottom Right */}
      <div className="absolute bottom-4 right-4 flex gap-4 items-center">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={activeQuestionIndex === 0}
          className={`p-2 rounded-lg ${
            activeQuestionIndex === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white'
          }`}
        >
          Previous
        </button>

        {/* Next Button */}
        {activeQuestionIndex < mockInterviewQuestions.length - 1 && (
          <button
            onClick={handleNext}
            className="p-2 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

"use client";
import { db } from "@utils/firebase";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Webcam from "react-webcam";
import { WebcamIcon, Lightbulb, Play, Camera, CameraOff } from "lucide-react";
import Link from "next/link";

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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto"></div>
          <p className="text-muted-foreground">Loading interview details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-balance">Interview Setup</h1>
        <p className="text-muted-foreground text-balance">
          Configure your camera and review interview details before starting
        </p>
      </div>

      <div className="interview-layout">
        {/* Left - Interview Details */}
        <div className="card-responsive p-6">
          <h2 className="text-lg font-semibold mb-4">Interview Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Job Position
              </label>
              <p className="text-sm font-medium">
                {interviewDetails?.jobPosition}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Experience Required
              </label>
              <p className="text-sm font-medium">
                {interviewDetails?.jobExperience} years
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Job Description
              </label>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {interviewDetails?.jobDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Right - Webcam & Setup */}
        <div className="card-responsive p-6">
          <h2 className="text-lg font-semibold mb-4">Camera Setup</h2>

          {/* Light Bulb Info */}
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Enable your camera to start the interview. You will answer 5
              questions one by one. Good luck!
            </p>
          </div>

          {/* Camera Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Camera Status
              </span>
              <button
                onClick={() => setWebCamEnabled(!webCamEnabled)}
                className="btn-outline flex items-center gap-2"
                aria-label={webCamEnabled ? "Disable camera" : "Enable camera"}
              >
                {webCamEnabled ? (
                  <>
                    <CameraOff className="w-4 h-4" />
                    <span className="mobile-only">Disable</span>
                    <span className="mobile-hidden">Disable Camera</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span className="mobile-only">Enable</span>
                    <span className="mobile-hidden">Enable Camera</span>
                  </>
                )}
              </button>
            </div>

            {/* Camera Preview */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {webCamEnabled ? (
                <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  mirrored={true}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <WebcamIcon className="h-16 w-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Camera disabled
                  </p>
                </div>
              )}
            </div>

            {/* Start Interview Button */}
            <Link
              href={`/dashboard/interview/${params.interviewId}/start`}
              className="block"
            >
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Interview
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;

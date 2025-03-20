"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function Upgrade() {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-blue-600">Upgrade to Pro 🚀</h2>
        <p className="text-gray-600 mt-2">
          Support the developer and unlock premium features!
        </p>

        <div className="mt-4 border-t pt-4">
          <p className="text-lg font-semibold">Only $5/month</p>
          <p className="text-sm text-gray-500">Cancel anytime.</p>
        </div>

        {/* Upgrade Button */}
        <button
          className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => setShowQR(true)}
        >
          Upgrade Now
        </button>

        <p className="text-sm text-gray-400 mt-3">
          *Your support helps improve the platform and add new features! ❤️
        </p>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">Scan to Pay</h3>
            <Image src="/qr-code.png" width={250} height={250} alt="QR Code" className="mx-auto mt-3" />
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => setShowQR(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

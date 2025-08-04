import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
          About AI Interview Mocker 🦑
        </h1>
        <p className="text-gray-600 text-center mb-8">
          AI Interview Mocker is designed to help candidates practice and
          improve their interview skills with AI-driven mock sessions.
        </p>

        {/* Creator Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between">
          <div className="flex-shrink-0">
            <Image
              src="/spidey4.jpg" // Ensure your image is in the public folder
              alt="Creator"
              className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-lg transform hover:scale-105 transition-transform duration-300"
              width={160}
              height={140}
            />
          </div>
          <div className="mt-6 md:mt-0 md:ml-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Meet the Creator 🚀
            </h2>
            <p className="text-gray-600 mt-2">
              Passionate about AI, web development, and problem-solving.
              Always exploring new ways to make interviews more efficient and interactive.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Find Me Online 🌐
          </h2>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="https://www.linkedin.com/in/aiyatullah-saiyed-8b4538251/" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition">
                <Image
                  src="/linkedin.svg" // Ensure your svg icons are in the public folder
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
                <span>LinkedIn</span>
              </div>
            </Link>

            <Link href="https://github.com/Aiyatullah" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition">
                <Image
                  src="/github.svg" // Ensure your svg icons are in the public folder
                  alt="GitHub"
                  width={24}
                  height={24}
                />
                <span>GitHub</span>
              </div>
            </Link>

            <Link href="https://leetcode.com/u/aiyatullah/" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-600 transition">
                <Image
                  src="/leetcode.svg" // Ensure your svg icons are in the public folder
                  alt="LeetCode"
                  width={24}
                  height={24}
                />
                <span>LeetCode</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for accessing and using Webperia.",
};

export default function TermsAndConditions() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">Welcome to Webperia. By accessing or using our website builder, applications, and related services, you agree to be bound by these Terms and Conditions.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">We grant you a personal, non-exclusive, non-transferable license to use Webperia for the purpose of creating and managing websites in accordance with these terms.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. User Content</h2>
          <p className="mb-4">You retain all rights to the content you create, upload, and publish using Webperia. You are solely responsible for ensuring your content does not violate any laws or third-party rights.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Prohibited Uses</h2>
          <p className="mb-4">You may not use our service for any illegal purposes, to host malicious code, to distribute spam, or to engage in unauthorized advertising. We reserve the right to suspend or terminate accounts that violate these restrictions.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Modifications</h2>
          <p className="mb-4">We reserve the right to modify these terms at any time. Continued use of the service after such modifications constitutes acceptance of the updated terms.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy describing how Webperia handles your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <p className="mb-4">At Webperia, we take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us when you create an account, build a website, or communicate with us. This may include your name, email address, payment information, and site content.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices, and respond to your support requests.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Protection</h2>
          <p className="mb-4">We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Cookies</h2>
          <p className="mb-4">We use cookies and similar technologies to enhance your experience, understand usage patterns, and securely authenticate your sessions.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Webperia strict no-refund policy.",
};

export default function RefundPolicy() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
            <h2 className="text-xl font-semibold text-red-900 mb-2 mt-0">Strict No-Refund Policy</h2>
            <p className="mb-0 text-red-800">Please note that all sales are final. We do not offer refunds, exchanges, or credits for any of our services.</p>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Service Access</h2>
          <p className="mb-4">Upon successful payment, you immediately receive access to our platform and digital resources. Due to the immediate and intangible nature of our digital products and services, refunds cannot be granted under any circumstances.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Subscription Cancellations</h2>
          <p className="mb-4">You may cancel your subscription at any time to prevent future billing. However, cancellation does not entitle you to a refund for previously billed charges or partially used billing periods. You will continue to have access to the service until the end of your current billing cycle.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Trial Periods</h2>
          <p className="mb-4">If you are on a free trial, please ensure you cancel before the trial period ends if you do not wish to be charged. Once a charge has been processed after a trial period, it is non-refundable.</p>

          <p className="mt-8 font-medium">By making a purchase with Webperia, you explicitly agree to this no-refund policy.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

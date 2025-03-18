"use client"  // Add this directive to mark the entire page as a client component

import VoicePractice from "@/components/VoicePractice";
import CaseSelection from "@/components/CaseSelection";

const Page = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <CaseSelection/>
        </div>
    );
};

export default Page;
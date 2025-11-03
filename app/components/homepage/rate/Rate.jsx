"use client"
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import GlowCard from '../../helper/glow-card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const Rate = () => {
  const router = useRouter();
  const developers = [
    {
        id:1,
      level: 'Basic',
      projectRate: '$70 - $140',
      category:'General projects',
      description: 'General website, typically consisting of 2-3 pages maximum, limited revisions and a basic SEO configuration.',
      examples:'Portfolio Website, Small Business Intro Site, Event/Invitation Page and so on.'
    },
    {
        id:2,
      level: 'Standard',
      projectRate: '$200 - $350',
      category:'Mid-Level projects',
      description: 'A mid-tier package that expands on the basic option, offering more features, quicker turnaround, additional pages, and enhanced customization.',
      examples:'Educational Institute Website, Corporate Business Site, Nonprofit/NGO Site and so on.'
    },
    {
        id:3,
      level: 'Premium',
      projectRate: '$420 - $700',
      category:'Large & complex projects',
      description: 'The top-tier offering with the most comprehensive services, premium add-ons, unlimited revisions, or expedited turnaround.',
      examples:'E-commerce Platform, Restaurant Management System, SaaS Application and so on.'
    }
  ];

  return (
    <div className="bg-[#0d1224] flex flex-col items-center justify-center p-8 relative">
        {/* 🔙 Back Button */}
      <button
      onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-[#16f2b3] transition-colors"
      >
        <FaArrowLeft className="w-5 h-5" />
        <span className="text-sm md:text-base">Back</span>
      </button>
       <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-base md:text-xl rounded-md text-center">
          Pricing & Packages
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {developers.map((dev, index) => (
         <GlowCard key={index} identifier={`developers-${dev.id}`}>
                    <div className="p-3 relative">
                      <Image
                        src="/blur-23.svg"
                        alt="Hero"
                        width={1080}
                        height={200}
                        className="absolute bottom-0 opacity-80"
                      />
                        <p className="absolute top-0 left-0 text-sm md:text-lg font-semibold bg-[#16f2b3] text-black inline rounded-br-xl rounded-tl-xl px-2 py-1">
                        {dev.level}
                        </p>
                      <div className="flex flex-col gap-2 items-center px-3 py-5">
                        
                          <p className="text-lg sm:text-2xl mb-2 font-bold uppercase text-center">
                            💰 {dev.projectRate}
                          </p>
                          <p className="text-base sm:text-xl mb-2 font-medium uppercase text-center">
                            {dev.category}
                          </p>
                          <p className="text-sm sm:text-base text-justify">
                            {dev.description}
                          </p>
                          <p><span className="text-[#ec4899]">Examples: </span>{dev.examples}</p>
                      </div>
                    </div>
                  </GlowCard>
        ))}
      </div>
    </div>
  );
};

export default Rate;
"use client"
import React, { useState } from "react";

const Story = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    "/image/1.jpg",
    "/image/2.jpg",
    "/image/3.jpg",
    "/image/4.jpg",
    "/image/5.jpg",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
        <h1 className="text-xl md:text-4xl font-semibold my-6 text-center underline">Drama Script</h1>
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(image)}
            className="overflow-hidden rounded-lg cursor-pointer"
          >
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-40 sm:h-52 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl font-light z-50"
            aria-label="Close image"
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt="Fullscreen"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Story;
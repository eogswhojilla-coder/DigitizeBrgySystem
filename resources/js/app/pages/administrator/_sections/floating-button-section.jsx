import React from 'react';

export default function FloatingButtonSection() {
  return (
    <button
      className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 z-50"
      onClick={() => alert("Floating Button Clicked!")}
    >
      +
    </button>
  );
}

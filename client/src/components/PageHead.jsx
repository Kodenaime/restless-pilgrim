import React from "react";

const PageHead = ({ title, backgroundImage }) => {
  return (
    <div
      className="w-full h-64 md:h-80 lg:h-96 flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 backdrop-blur-sm" />
      <h1 className="relative text-white text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg transition-all duration-500 animate-fade-in">
        {title}
      </h1>
    </div>
  );
};

export default PageHead;

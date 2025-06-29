const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop" 
          alt="Church background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl text-center mx-auto">
          {/* Subheading */}
          <p className="text-lg md:text-xl font-medium text-[#964B00] mb-4">
            A Pilgrim Reflection
          </p>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            THE RESTLESS PILGRIM <span className="text-[#964B00] text-2xl">Curating pilgrim hearts for earthly impact and eternity with God</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Nothing wrong in asking help from people but look to God first and let Him guide you to those He wants to help you.@ChineduOranye
          </p>
          
          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-[#964B00] hover:bg-transparent text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30">
              Watch Sermons
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-[#964B00]">
              Join The Pilgrim Family
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce w-8 h-8 border-4 border-white rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
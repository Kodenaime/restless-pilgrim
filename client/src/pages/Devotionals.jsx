import React, { useContext } from 'react';
import PageHead from '../components/PageHead';
import devotionalImage from '../assets/about.jpeg';

import { Link } from 'react-router';

const Devotionals = () => {



  return (
    <div className="min-h-screen">
      <PageHead title="Devotionals" backgroundImage={devotionalImage} />
      
      <section className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Audio Devotionals Card */}
          <article 
            className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-64"
            style={{ 
              backgroundImage: `url(${devotionalImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Link to='/audio-devotionals' className="bg-white bg-opacity-90 hover:bg-opacity-100 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-blue-600 mr-2">|</span> Audio Devotionals
                </h2>
              </Link>
            </div>
          </article>

          {/* Written Devotionals Card */}
          <article 
            className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-64"
            style={{ 
              backgroundImage: `url(${devotionalImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Link to='/written-devotionals'  className="bg-white bg-opacity-90 hover:bg-opacity-100 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-blue-600 mr-2">|</span> Written Devotionals
                </h2>
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Devotionals;
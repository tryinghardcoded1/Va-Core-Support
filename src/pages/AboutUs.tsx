import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200"
        >
          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-black text-zinc-900 mb-6 tracking-tight">About HIRE A VA</h1>
            
            <div className="prose prose-lg text-zinc-600 mb-10">
              <p className="mb-4">
                Originally founded as <strong>VA CORE SUPPORT</strong> by <strong>Joshua Bernstein</strong> from San Francisco, our mission has always been to connect incredible talent with businesses that need them.
              </p>
              <p>
                We believe in empowering entrepreneurs and business owners by providing top-tier virtual assistants who can handle the day-to-day operations, allowing you to focus on what truly matters: growing your business.
              </p>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Our Story</h2>
              <div className="aspect-[9/16] max-w-sm mx-auto bg-zinc-100 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 relative">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/NK7wBwqqZto" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;

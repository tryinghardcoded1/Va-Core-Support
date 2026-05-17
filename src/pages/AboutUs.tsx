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
              <p>
                We believe in empowering entrepreneurs and business owners by providing top-tier virtual assistants who can handle the day-to-day operations, allowing you to focus on what truly matters: growing your business.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;

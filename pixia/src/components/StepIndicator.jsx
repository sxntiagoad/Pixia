import React from 'react';
import { motion } from 'framer-motion';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-4xl mx-auto mb-8">
      {steps.map((step, index) => (
        <div key={index} className="relative flex flex-col items-center flex-1">
          {/* Línea conectora */}
          {index < steps.length - 1 && (
            <div className="absolute left-1/2 right-1/2 h-[2px] top-7 -translate-y-1/2 w-full">
              <div className="h-full bg-gray-700">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{
                    width: index + 1 < currentStep ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          {/* Círculo indicador */}
          <motion.div
            className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center 
              ${index + 1 <= currentStep ? 'bg-emerald-500' : 'bg-gray-700'}`}
            animate={{
              scale: index + 1 === currentStep ? 1.1 : 1,
              backgroundColor: index + 1 <= currentStep ? '#10B981' : '#374151'
            }}
            transition={{ duration: 0.3 }}
          >
            {step.icon}
          </motion.div>
          
          {/* Etiqueta */}
          <span className={`mt-3 text-sm ${
            index + 1 <= currentStep ? 'text-emerald-500' : 'text-gray-500'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;

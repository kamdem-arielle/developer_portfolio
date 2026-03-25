import React from 'react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import { motion } from 'framer-motion';
export function SideBars() {
  return (
    <>
      {/* Left Bar - Socials */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.5,
          delay: 1
        }}
        className="hidden md:flex flex-col items-center fixed bottom-0 left-8 lg:left-12 z-30">
        
        <div className="flex flex-col space-y-6 mb-6">
          <a
            href="https://github.com/kamdem-arielle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate hover:text-accent-pink transition-colors hover:-translate-y-1 transform duration-200"
            aria-label="GitHub">
            
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/arielle-kamdem-17858225a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate hover:text-accent-pink transition-colors hover:-translate-y-1 transform duration-200"
            aria-label="LinkedIn">
            
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate hover:text-accent-pink transition-colors hover:-translate-y-1 transform duration-200"
            aria-label="Twitter">
            
            <TwitterIcon className="w-5 h-5" />
          </a>
        </div>
        <div className="h-24 w-px bg-slate/50" />
      </motion.div>

      {/* Right Bar - Email */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.5,
          delay: 1
        }}
        className="hidden md:flex flex-col items-center fixed bottom-0 right-8 lg:right-12 z-30">
        
        <a
          href="mailto:kamdemarielle22@gmail.com"
          className="text-slate hover:text-accent-pink transition-colors text-xs tracking-widest font-mono mb-6 hover:-translate-y-1 transform duration-200"
          style={{
            writingMode: 'vertical-rl'
          }}>
          
          kamdemarielle22@gmail.com
        </a>
        <div className="h-24 w-px bg-slate/50" />
      </motion.div>
    </>);

}
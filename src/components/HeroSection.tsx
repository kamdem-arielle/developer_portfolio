import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownIcon } from 'lucide-react';

const statusMessages = [
  'Open to new projects',
  'Open to networking',
  'Open to collaborations',
  'Open to new experiences',
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spacerIndex, setSpacerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statusMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-[90vh] flex flex-col justify-center relative ">
      
      {/* Decorative Blobs */}
      <motion.div
        className="absolute top-1/4 right-10 w-64 h-64 bg-accent-pink/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: 'easeInOut'
        }} />
      
      <motion.div
        className="absolute top-1/3 right-40 w-72 h-72 bg-accent-lavender/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 30, -20, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: 'easeInOut'
        }} />
      
      <motion.div
        className="absolute bottom-1/4 right-20 w-80 h-80 bg-accent-coral/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -20, 40, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: 'easeInOut'
        }} />
      

      <div className="max-w-3xl relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7,
            ease: 'easeOut'
          }}>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 border border-primary-dark/30 rounded-full mb-6">
            <span className="relative flex h-2.5 w-2.5 shrink-0 ml-0.5">
              <span
                className="absolute inset-0 rounded-full bg-green-400 opacity-40"
                style={{ animation: 'ripple 2.5s ease-out infinite' }}
              />
              <span
                className="absolute inset-0 rounded-full bg-green-400 opacity-40"
                style={{ animation: 'ripple 2.5s ease-out 1.25s infinite' }}
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="relative h-5 overflow-hidden text-sm font-medium text-navy inline-block transition-all duration-300">
              <span className="invisible whitespace-nowrap">{statusMessages[spacerIndex]}</span>
              <AnimatePresence initial={false} mode="wait" onExitComplete={() => setSpacerIndex(currentIndex)}>
                <motion.span
                  key={currentIndex}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut', delay: spacerIndex !== currentIndex ? 0.15 : 0 }}
                  className="absolute inset-x-0 top-0 whitespace-nowrap text-center"
                >
                  {statusMessages[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <p className="text-accent-pink font-medium tracking-wide mb-4">
            Hi, my name is Arielle.
          </p>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-navy leading-tight mb-6 text-balance">
            Crafting beautiful interfaces &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-lavender">
              scalable cloud solutions.
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: 'easeOut'
          }}>
          
          <p className="text-lg md:text-xl text-slate max-w-2xl leading-relaxed mb-10">
            I'm a Full Stack Developer who loves turning complex problems into clean, reliable applications. 
            With 6+ years of experience, I've built production-grade systems across web, cloud, and enterprise environments and I genuinely enjoy every part of the process.
            When I'm not coding, I'm exploring the outdoors, or hanging out with friends and family.
          </p> 
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: 'easeOut'
          }}
          className="flex flex-wrap gap-4">
          
          <a
            href="#projects"
            className="px-8 py-4 bg-navy text-white rounded-full font-medium hover:bg-navy-light transition-colors shadow-warm hover:shadow-warm-hover">
            
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-4 bg-white text-navy border border-primary-dark rounded-full font-medium hover:bg-primary-dark/30 transition-colors">
            
            Get In Touch
          </a>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7,
            delay: 0.6,
            ease: 'easeOut'
          }}>
          
          <p className="text-sm text-slate mt-8">
            Find me at{' '}
            <a
              href="https://github.com/kamdem-arielle"
              className="text-accent-pink hover:underline font-medium">
              
              GitHub
            </a>{' '}
            and{' '}
            <a
              href="https://www.linkedin.com/in/arielle-kamdem-17858225a/"
              className="text-accent-pink hover:underline font-medium">
              
              LinkedIn
            </a>
            .
            <br />
            Download my{' '}
            <a
              href="#"
              className="text-accent-pink hover:underline font-medium">
              
              resume
            </a>{' '}
            (PDF, 918kb)
          </p>
        </motion.div>
      </div>

      {/* <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 1,
          delay: 1
        }}
        className="absolute bottom-10 left-0 flex items-center text-slate text-sm font-medium tracking-widest uppercase">
        
        <span className="writing-vertical-rl transform rotate-180 mb-4">
          Scroll
        </span>
        <motion.div
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }}>
          
          <ArrowDownIcon className="w-4 h-4 text-accent-pink" />
        </motion.div>
      </motion.div> */}

    </section>);

}
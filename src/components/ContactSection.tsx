import React from 'react';
import { motion } from 'framer-motion';
import { MailIcon, GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
export function ContactSection() {
  return (
    <section id="contact" className="py-24 lg:py-32 relative">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-accent-lavender/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none" />

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        whileInView={{
          opacity: 1,
          y: 0
        }}
        viewport={{
          once: true
        }}
        transition={{
          duration: 1.0
        }}
        className="text-center relative z-10 max-w-2xl mx-auto">
        
        <p className="text-accent-pink font-medium tracking-widest uppercase text-sm mb-4">
          What's Next?
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-6">
          Let's Build Something Beautiful Together.
        </h2>
        <p className="text-slate text-lg mb-10 leading-relaxed">
          I'm currently open to new opportunities in frontend, backend and cloud
          engineering. Whether you have a question, a project idea, or just want
          to say hi, I'll try my best to get back to you!
        </p>

        <a
          href="mailto:kamdemarielle22@gmail.com"
          className="inline-flex items-center px-8 py-4 bg-navy text-white rounded-full font-medium hover:bg-navy-light transition-all duration-300 shadow-warm hover:shadow-warm-hover hover:-translate-y-1">
          
          <MailIcon className="w-5 h-5 mr-3" />
          Say Hello
        </a>

        <div className="mt-16 flex justify-center space-x-6">
          <a
            href="https://github.com/kamdem-arielle"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full text-slate hover:text-accent-pink hover:shadow-md transition-all border border-primary-dark/50"
            aria-label="GitHub">
            
            <GithubIcon className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/kamdem-arielle"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full text-slate hover:text-accent-pink hover:shadow-md transition-all border border-primary-dark/50"
            aria-label="LinkedIn">
            
            <LinkedinIcon className="w-6 h-6" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full text-slate hover:text-accent-pink hover:shadow-md transition-all border border-primary-dark/50"
            aria-label="Twitter">
            
            <TwitterIcon className="w-6 h-6" />
          </a>
        </div>
      </motion.div>
    </section>);

}
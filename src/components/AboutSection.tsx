import React from 'react';
import { motion } from 'framer-motion';
const frontendSkills = [
'Angular',
'React',
'Next.js',
'Vue.js',
'Framer Motion',
'TypeScript',
'Node.js',
'Python',
'Asp.net',
];

const cloudSkills = [
'AWS',
'GCP',
'Azure',
'Linux',
'Terraform',
'GitHub Actions',
'Circle CI',
'Zabbix'
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
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
          once: true,
          margin: '-100px'
        }}
        transition={{
          duration: 1.0
        }}>
        
        <div className="flex items-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mr-6">
            About Me
          </h2>
          <div className="h-px bg-accent-pink flex-grow max-w-xs opacity-50" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6 text-slate leading-relaxed text-lg">
            <p>
              Hey, I'm Arielle, a Full Stack Developer who loves building things that live on the internet. My journey into tech started in 2018, and what began as curiosity quickly turned into a career I'm genuinely passionate about
            </p>
            <p>
              Fast-forward to today, I've had the privilege of working across startups, corporations, and client engagements in {' '}
              <span className="text-accent-pink font-medium">
                Healthcare insurance, Canadian immigration, Sport betting, E-commerce and many others
              </span>
              . My focus has always been on building reliable, well-crafted applications that solve real problems for real people.
            </p>
            <p>
              From crafting responsive interfaces to designing cloud infrastructure, automating deployments, and keeping production systems running smoothly and securely, I care about every layer of what I build
              {/* Recently, I've discovered a deep passion for the infrastructure
              that powers these applications. I'm currently transitioning my
              career focus toward{' '} */}
              {/* <span className="text-accent-pink font-medium">
                Cloud Engineering and DevOps
              </span> */}
             
            </p>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-8 shadow-warm border border-primary-dark/30">
              <h3 className="font-heading text-xl font-semibold text-navy mb-6 flex items-center">
                <span className="w-2 h-2 rounded-full bg-accent-pink mr-3" />
                Fullstack Arsenal
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {frontendSkills.map((skill) =>
                <span
                  key={skill}
                  className="px-4 py-2 bg-accent-pink/10 text-accent-pink rounded-full text-sm font-medium">
                  
                    {skill}
                  </span>
                )}
              </div>

              <h3 className="font-heading text-xl font-semibold text-navy mb-6 flex items-center">
                <span className="w-2 h-2 rounded-full bg-accent-lavender mr-3" />
                Cloud & DevOps
              </h3>
              <div className="flex flex-wrap gap-2">
                {cloudSkills.map((skill) =>
                <span
                  key={skill}
                  className="px-4 py-2 bg-accent-lavender/10 text-accent-lavender rounded-full text-sm font-medium">
                  
                    {skill}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>);

}
import React from 'react';
import { motion } from 'framer-motion';
const education = [
{
  id: 1,
  degree: "Bachelor's Degree in Software Engineering",
  school: 'University Institute of Technology',
  location: 'Douala, Cameroon',
  date: '2022 - 2023',
  description:
  'Formalized and deepened expertise I had already been building in the field. Focused on advanced computer science concepts, software engineering, server administration, and cloud computing, with hands-on projects in web and mobile application development and deployment',
  tech: [
  'Software Engineering',
  'Server Administration',
  'Cloud Computing',
  'Java',
  'Python',
  'Docker',
  'AWS'
]
},
{
  id: 2,
  degree: "Diploma in Software Engineering",
  school: 'University Institute of the Gulf of Guinea',
  location: 'Douala, Cameroon',
  date: '2020 - 2022',
  description:
  'Strengthened my technical knowledge in software development, networking, and database management. Complemented real-world experience with structured learning across web and mobile development and full-stack solutions. Graduated with honours',
  tech: [
  'Web Development',
  'Mobile Development',
  'Database Management',
  'JavaScript',
  'React',
  'Angular',
  'MySQL']

}];

export function EducationSection() {
  return (
    <section id="education" className="py-24">
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
          duration: 0.6
        }}>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Section Title */}
          <div className="lg:w-1/4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy sticky top-24">
              Education
            </h2>
          </div>

          {/* Education List */}
          <div className="lg:w-3/4 flex flex-col">
            {education.map((item, index) =>
            <motion.div
              key={item.id}
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
                margin: '-50px'
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              className={`py-8 ${index !== 0 ? 'border-t border-primary-dark/50' : 'pt-0'}`}>
              
                <h3 className="font-heading text-2xl font-bold text-navy mb-3">
                  {item.degree}
                </h3>

                <div className="flex flex-wrap items-center text-sm text-slate mb-4 gap-2">
                  <span className="font-medium text-navy">{item.school}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{item.location}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{item.date}</span>
                </div>

                <p className="text-slate leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.tech.map((tech) =>
                <span
                  key={tech}
                  className="px-3 py-1 bg-white border border-primary-dark/50 text-slate rounded-full text-xs font-medium">
                  
                      {tech}
                    </span>
                )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>);

}
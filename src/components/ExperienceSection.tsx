import React from 'react';
import { motion } from 'framer-motion';
const experiences = [
{
  id: 1,
  date: '2024 — Present',
  title: 'Full Stack Developer',
  company: ' Laureal Corporation',
  description:
  'Building a secure document management platform end-to-end for 1,000+ users. Developing REST APIs with Node.js, managing AWS infrastructure (Lambda, EC2, S3, Cognito, IAM),  implementing CI/CD pipelines with GitHub Actions and mentoring  junior developers.',
  tech: ['Angular', 'Ngrx', 'React', 'Typescript', 'Node.js', 'AWS', 'GitHub Actions']
},
{
  id: 2,
  date: '2023 — 2024',
  title: 'Full Stack Developer',
  company: 'Pether Corporation',
  description:
  'Maintained 4 enterprise applications at 99.5% uptime. Led a team of 5 through a major Angular migration, shipped a financial BNPL platform handling 1,000+ monthly transactions, and implemented CI/CD pipelines with CircleCI. Resolved 200+ support tickets with a 95% satisfaction rate.',
  tech: ['Angular', 'TypeScript', 'Node.js', 'Circle CI', 'Zabbix', 'AWS', 'GCP']
},
{
  id: 3,
  date: '2022 — 2022',
  title: 'Full Stack Developer',
  company: 'Freelance',
  description:
  'Delivered custom web solutions for 8+ clients across sports betting, immigration, and e-commerce. Built real-time data visualization modules, deployed scalable infrastructure on AWS, and integrated third-party CRMs via REST API',
  tech: ['React', 'Angular', 'Typescript', 'D3.js', 'Node.js', 'AWS', 'Azure', 'WebSocket']
},
{
  id: 4,
  date: '2019 — 2022',
  title: 'Software Engineer',
  company: 'Telcar Cocoa Ltd',
  description:
  'Contributed to the full stack development of the company\'s management systems deployed on Azure. Developed RESTful APIs in ASP.NET Core, optimized MS SQL Server queries, built CI/CD pipelines with Azure DevOps reducing deployment time by 60%, and provided L2 technical support with a 95% first-contact resolution rate',
  tech: ['Angular', 'ASP.NET Core', 'Azure', 'Azure DevOps', 'MS SQL Server']
},

];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24">
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
        
        <div className="flex items-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mr-6">
            Experience
          </h2>
          <div className="h-px bg-accent-lavender flex-grow max-w-xs opacity-50" />
        </div>

        <div className="relative border-l border-primary-dark ml-3 md:ml-4 space-y-12">
          {experiences.map((exp, index) =>
          <motion.div
            key={exp.id}
            initial={{
              opacity: 0,
              x: -20
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1
            }}
            className="relative pl-8 md:pl-12 group">
            
              {/* Timeline dot */}
              <div className="absolute w-3 h-3 bg-primary border-2 border-accent-pink rounded-full -left-[6.5px] top-1.5 group-hover:bg-accent-pink transition-colors duration-300" />

              <div className="flex flex-col md:flex-row md:items-baseline mb-2">
                <h3 className="font-heading text-xl font-bold text-navy mr-4">
                  {exp.title}{' '}
                  <span className="text-accent-pink">@ {exp.company}</span>
                </h3>
                <span className="text-sm font-medium text-slate tracking-widest uppercase mt-1 md:mt-0">
                  {exp.date}
                </span>
              </div>

              <p className="text-slate mb-4 leading-relaxed max-w-2xl">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.tech.map((tech) =>
              <span
                key={tech}
                className="px-3 py-1 bg-white border border-primary-dark text-slate rounded-full text-xs font-medium shadow-sm">
                
                    {tech}
                  </span>
              )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>);

}
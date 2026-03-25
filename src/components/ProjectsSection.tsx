import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLinkIcon, GithubIcon, FolderIcon } from 'lucide-react';
import { link } from 'fs';
import { li } from 'framer-motion/client';
const projects = [
{
  id: 1,
  title: 'Multi-Tenant File Access Platform',
  description:
  'A secure cloud application demonstrating role-based, multi-tenant access to isolated file storage using AWS Cognito, IAM, and S3 prefix-based data separation. Built as the foundation for a corporate file management system where each organization accesses only their own data, with an Angular frontend that feels as intuitive as Google Drive',
  tech: ['AWS S3', 'AWS Cognito', 'IAM', 'AWS CDK', 'Angular 19', 'GitHub Actions'],
  highlight: true,
  link :'https://github.com/kamdem-arielle/aws-cognito-s3-multitenant-access-app'
},
{
  id: 2,
  title: 'DevOps Learning Roadmap',
  description:
  'A structured open-source resource for developers beginning their DevOps journey. Built from my personal learning path, it brings together the notes I used to ace my cloud and DevOps certifications and breaks down complex concepts into digestible guides covering the core tools and practices every modern developer should know',
  tech: ['DevOps', 'CI/CD' ,'Docker','Linux','Cloud','Git'],
  highlight: true,
  link :'https://github.com/kamdem-arielle/devops_roadmap'
},
{
  id: 3,
  title: 'SPA Deployment Pipeline on AWS',
  description:
  'A complete end-to-end guide and working implementation for hosting a Single Page Application on AWS with production-grade standards. Covers S3 static hosting, CloudFront CDN distribution, Route 53 DNS management, ACM SSL certificates, and a fully automated GitHub Actions CI/CD pipeline that builds, deploys, and invalidates the CDN cache on every push.',
  tech: ['AWS S3' , 'CloudFront' , 'Route 53' , 'ACM' , 'IAM' , 'GitHub Actions' , 'CI/CD'],
  highlight: true,
  link :'https://github.com/kamdem-arielle/Spa_deployment_using_aws'
},
// {
//   id: 4,
//   title: 'PortfolioGen',
//   description:
//   'A static site generator tailored for developers. Compiles markdown to optimized HTML/CSS and automatically deploys to AWS S3 and CloudFront via Terraform.',
//   tech: ['Terraform', 'AWS S3', 'Node.js', 'Markdown'],
//   highlight: false
// },
// {
//   id: 5,
//   title: 'TaskMaster Pro',
//   description:
//   'A comprehensive project management tool with real-time collaboration, kanban boards, and automated reporting features for agile teams.',
//   tech: ['Vue.js', 'Firebase', 'Tailwind', 'Vuex'],
//   highlight: false
// },
// {
//   id: 6,
//   title: 'API Gateway',
//   description:
//   'A custom API gateway service that handles rate limiting, authentication, and request routing for microservices architecture.',
//   tech: ['Go', 'Redis', 'Docker', 'gRPC'],
//   highlight: false
// }
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24">
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
            Other Noteworthy Projects
          </h2>
          <div className="h-px bg-accent-coral flex-grow max-w-xs opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {projects.map((project, index) =>
          <motion.div
            key={project.id}
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
            className="group relative bg-white rounded-xl p-6 md:p-8 shadow-sm hover:shadow-warm transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-primary-dark/40">
            
              <div className="flex justify-between items-start mb-6">
                <div className="text-accent-pink">
                  <FolderIcon className="w-10 h-10 stroke-1" />
                </div>
                <div className="flex space-x-3 text-slate">
                  <a
                  href={`${project.link}`}
                  className="hover:text-accent-pink transition-colors"
                  aria-label={`GitHub repository for ${project.title}`}>
                  
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  {/* <a
                  href="#"
                  className="hover:text-accent-pink transition-colors"
                  aria-label={`Live demo for ${project.title}`}>
                  
                    <ExternalLinkIcon className="w-5 h-5" />
                  </a> */}
                </div>
              </div>

              <h3
              className={`font-heading text-xl font-bold mb-3 group-hover:text-accent-pink transition-colors ${project.highlight ? 'text-accent-pink' : 'text-navy'}`}>
              
                {project.title}
              </h3>

              <p className="text-slate text-sm mb-8 flex-grow leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto font-mono text-xs text-slate/80">
                {project.tech.map((tech) =>
              <span key={tech}>{tech}</span>
              )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/kamdem-arielle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-navy border border-primary-dark rounded-full font-medium hover:bg-primary-dark/30 transition-colors text-sm">
            
            Show More on GitHub
          </a>
        </div>
      </motion.div>
    </section>);

}
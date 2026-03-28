import React, { useEffect, useState } from 'react';
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  MenuIcon,
  XIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface SidebarProps {
  activeSection: string;
}
const navItems = [
{
  id: 'about',
  label: 'About'
},
{
  id: 'experience',
  label: 'Experience'
},
{
  id: 'education',
  label: 'Education'
},
{
  id: 'projects',
  label: 'Projects'
},
{
  id: 'blog',
  label: 'Blog'
},
{
  id: 'contact',
  label: 'Contact'
}];

export function Sidebar({ activeSection }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  return (
    <>
      {/* Top Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'h-16 bg-primary/90 backdrop-blur-md border-b border-primary-dark/50 shadow-sm' : 'h-20 bg-transparent'}`}>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <motion.div
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.5
            }}>
            
            <h1
              className="font-heading text-2xl font-bold text-navy cursor-pointer"
              onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
              }>
              
              AK <span className="text-accent-pink">Dev</span>
            </h1>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{
                      opacity: 0,
                      y: -10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1
                    }}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-colors hover:text-accent-pink ${isActive ? 'text-accent-pink' : 'text-slate'}`}>
                    
                    {item.label}
                  </motion.button>);

              })}
            </div>

            <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.6
              }}
              className="flex items-center space-x-4 pl-6 border-l border-primary-dark/50">
              
              <a
                href="https://github.com/kamdem-arielle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-accent-pink transition-colors">
                
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/arielle-kamdem-17858225a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-accent-pink transition-colors">
                
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </motion.div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-navy p-2 focus:outline-none"
            aria-label="Toggle menu">
            
            {isMobileMenuOpen ?
            <XIcon className="w-6 h-6" /> :

            <MenuIcon className="w-6 h-6" />
            }
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -20
          }}
          transition={{
            duration: 0.2
          }}
          className="fixed inset-0 top-[64px] bg-primary/95 backdrop-blur-md z-40 lg:hidden overflow-y-auto border-t border-primary-dark/50">
          
            <div className="flex flex-col py-8 px-6 space-y-6">
              {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-lg font-medium transition-colors ${isActive ? 'text-accent-pink' : 'text-navy'}`}>
                  
                    {item.label}
                  </button>);

            })}

              <div className="pt-6 mt-6 border-t border-primary-dark/50 flex items-center space-x-6">
                <a
                href="https://github.com/kamdem-arielle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-accent-pink transition-colors">
                
                  <GithubIcon className="w-6 h-6" />
                </a>
                <a
                href="https://www.linkedin.com/in/arielle-kamdem-17858225a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-accent-pink transition-colors">
                
                  <LinkedinIcon className="w-6 h-6" />
                </a>
                <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-accent-pink transition-colors">
                
                  <TwitterIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}
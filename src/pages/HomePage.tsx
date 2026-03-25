import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { HighlightsSection } from '../components/HighlightsSection';
import { AboutSection } from '../components/AboutSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { BlogSection } from '../components/BlogSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
export function HomePage() {
  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </>);

}
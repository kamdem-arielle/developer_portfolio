import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRightIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import spaDeploymentContent from '../blog-posts/spa-deployment-aws/content.md?raw';
type Category = 'All' | 'Frontend' | 'DevOps' | 'Cloud' | 'Career';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: Category;
  readTime: string;
  contentType?: 'html' | 'markdown';
}

export const blogPosts: BlogPost[] = [
{
  id: 7,
  slug: 'how-to-deploy-a-spa-on-aws-s3-cloudfront-route53',
  title: 'How to Deploy a Single Page Application on AWS: S3, CloudFront, Route 53 & CI/CD',
  excerpt:
    'A complete, step-by-step guide to deploying your SPA on Amazon S3 with custom domain, HTTPS via CloudFront, and automated GitHub Actions deployments.',
  content: spaDeploymentContent,
  date: 'Mar 20, 2026',
  category: 'Cloud' as Category,
  readTime: '15 min read',
  contentType: 'markdown' as const
},
{
  id: 1,
  slug: 'from-frontend-to-cloud-my-transition-journey',
  title: 'From Frontend to Cloud: My Transition Journey',
  excerpt:
  'Reflecting on the challenges and triumphs of shifting my career focus from React components to AWS infrastructure.',
  content: `
      <p>Making the leap from frontend development to cloud engineering wasn't something I planned from the start. Like many developers, I found myself naturally gravitating toward the infrastructure that powered the applications I was building.</p>
      
      <h2>The Catalyst</h2>
      <p>It started when our team faced deployment bottlenecks. We had beautiful React applications, but getting them to production was a nightmare. Manual deployments, inconsistent environments, and the dreaded "it works on my machine" syndrome were daily occurrences.</p>
      
      <p>I volunteered to help set up our CI/CD pipeline, thinking it would be a weekend project. Three months later, I was deep into Docker containers, Kubernetes orchestration, and AWS services I'd never heard of before.</p>
      
      <h2>The Learning Curve</h2>
      <p>The transition wasn't easy. Frontend development has immediate feedback—you change a CSS property and see the result instantly. Cloud infrastructure is different. You write Terraform code, wait for resources to provision, debug mysterious IAM permission errors, and repeat.</p>
      
      <p>But there's something deeply satisfying about designing systems that scale. When you see your infrastructure handle a traffic spike without breaking a sweat, it's a different kind of accomplishment than pixel-perfect UI.</p>
      
      <h2>Bridging Both Worlds</h2>
      <p>What I've found most valuable is the perspective that comes from understanding both sides. I can design frontend applications with deployment in mind. I understand the constraints of serverless functions, the benefits of edge computing, and how to optimize for cloud costs.</p>
      
      <p>If you're a frontend developer curious about cloud, my advice is simple: start with the deployment pipeline for your own projects. That's where the magic begins.</p>
    `,
  date: 'Jan 15, 2026',
  category: 'Career' as Category,
  readTime: '5 min read'
},
{
  id: 2,
  slug: 'setting-up-production-ready-kubernetes-cluster',
  title: 'Setting Up a Production-Ready Kubernetes Cluster',
  excerpt:
  'A comprehensive guide to configuring a robust K8s cluster with proper security policies, ingress controllers, and monitoring.',
  content: `
      <p>Kubernetes has become the de facto standard for container orchestration, but setting up a production-ready cluster requires more than just running kubectl apply. Let's walk through the essential components.</p>
      
      <h2>Security First</h2>
      <p>Before anything else, establish your security baseline. This means implementing RBAC (Role-Based Access Control), network policies, and pod security standards. Don't skip this step—retrofitting security is much harder than building it in from the start.</p>
      
      <h2>Ingress and Load Balancing</h2>
      <p>Your cluster needs a way to handle incoming traffic. I recommend starting with NGINX Ingress Controller for its flexibility and extensive documentation. Pair it with cert-manager for automatic TLS certificate management.</p>
      
      <h2>Monitoring and Observability</h2>
      <p>You can't manage what you can't measure. Set up Prometheus for metrics collection, Grafana for visualization, and consider adding Jaeger for distributed tracing. These tools will save you countless hours when debugging production issues.</p>
      
      <h2>GitOps Workflow</h2>
      <p>Implement a GitOps workflow using tools like ArgoCD or Flux. This ensures your cluster state is always in sync with your Git repository, making deployments predictable and rollbacks trivial.</p>
    `,
  date: 'Feb 02, 2026',
  category: 'DevOps' as Category,
  readTime: '12 min read'
},
{
  id: 3,
  slug: 'building-accessible-react-components-that-scale',
  title: 'Building Accessible React Components That Scale',
  excerpt:
  'How to design a component library that prioritizes a11y without sacrificing developer experience or performance.',
  content: `
      <p>Accessibility isn't a feature—it's a fundamental aspect of good software. When building a component library, baking in accessibility from the start is far easier than adding it later.</p>
      
      <h2>Start with Semantic HTML</h2>
      <p>Before reaching for ARIA attributes, ensure you're using the right HTML elements. A button should be a &lt;button&gt;, not a &lt;div&gt; with an onClick handler. Semantic HTML provides accessibility features for free.</p>
      
      <h2>Keyboard Navigation</h2>
      <p>Every interactive element must be keyboard accessible. This means proper focus management, visible focus indicators, and logical tab order. Test your components by unplugging your mouse.</p>
      
      <h2>Screen Reader Testing</h2>
      <p>Automated testing catches many issues, but nothing replaces testing with actual screen readers. VoiceOver on Mac, NVDA on Windows, and TalkBack on Android all behave slightly differently.</p>
      
      <h2>Documentation</h2>
      <p>Document the accessibility features of each component. Include keyboard shortcuts, ARIA attributes used, and any considerations for specific disabilities. Good documentation helps your team maintain accessibility standards.</p>
    `,
  date: 'Dec 10, 2025',
  category: 'Frontend' as Category,
  readTime: '8 min read'
},
{
  id: 4,
  slug: 'terraform-best-practices-i-wish-i-knew-earlier',
  title: 'Terraform Best Practices I Wish I Knew Earlier',
  excerpt:
  'Lessons learned from managing complex infrastructure as code. State management, modules, and workspace strategies.',
  content: `
      <p>After managing infrastructure for multiple projects with Terraform, I've accumulated a list of practices I wish I'd known from day one.</p>
      
      <h2>State Management</h2>
      <p>Never store state locally for team projects. Use remote state with locking (S3 + DynamoDB for AWS). This prevents state corruption and enables collaboration.</p>
      
      <h2>Module Everything</h2>
      <p>Create modules for reusable infrastructure patterns. A well-designed module abstracts complexity while remaining flexible. Start with modules for common patterns like VPCs, ECS services, or Lambda functions.</p>
      
      <h2>Environment Separation</h2>
      <p>Use workspaces or separate state files for different environments. I prefer separate state files with a consistent directory structure—it's more explicit and reduces the risk of applying changes to the wrong environment.</p>
      
      <h2>Plan Before Apply</h2>
      <p>Always review terraform plan output before applying. Better yet, integrate plan output into your PR process so team members can review infrastructure changes alongside code changes.</p>
    `,
  date: 'Nov 22, 2025',
  category: 'Cloud' as Category,
  readTime: '7 min read'
},
{
  id: 5,
  slug: 'css-container-queries-changed-everything',
  title: 'CSS Container Queries Changed Everything',
  excerpt:
  'Why we can finally stop relying solely on media queries and build truly modular, responsive components.',
  content: `
      <p>For years, we've been building "responsive" components that weren't truly responsive—they responded to the viewport, not their container. Container queries change everything.</p>
      
      <h2>The Problem with Media Queries</h2>
      <p>Media queries work great for page-level layouts, but they fall apart for reusable components. A card component might need different layouts depending on whether it's in a sidebar or main content area, regardless of viewport size.</p>
      
      <h2>Enter Container Queries</h2>
      <p>Container queries let components respond to their parent container's size. This means truly portable components that adapt to their context, not just the viewport.</p>
      
      <h2>Practical Implementation</h2>
      <p>Start by identifying components that appear in multiple contexts with different space constraints. Cards, navigation items, and data displays are prime candidates. Gradually migrate these to use container queries.</p>
      
      <h2>Browser Support</h2>
      <p>Container queries are now supported in all major browsers. For older browser support, consider a progressive enhancement approach where the component falls back to a reasonable default layout.</p>
    `,
  date: 'Oct 05, 2025',
  category: 'Frontend' as Category,
  readTime: '6 min read'
},
{
  id: 6,
  slug: 'aws-solutions-architect-certification-journey',
  title: 'My AWS Solutions Architect Certification Journey',
  excerpt:
  'Study strategies, resources, and tips that helped me pass the SAA-C03 exam on my first attempt.',
  content: `
      <p>Passing the AWS Solutions Architect Associate exam was a milestone in my cloud journey. Here's how I prepared and what I learned along the way.</p>
      
      <h2>Study Resources</h2>
      <p>I used a combination of resources: Adrian Cantrill's course for deep understanding, Tutorials Dojo practice exams for test preparation, and AWS documentation for reference. Don't rely on just one source.</p>
      
      <h2>Hands-On Practice</h2>
      <p>Theory alone won't cut it. Set up a personal AWS account and build things. Deploy a multi-tier application, set up VPC peering, configure CloudFront distributions. The exam tests practical knowledge.</p>
      
      <h2>Focus Areas</h2>
      <p>Pay special attention to: VPC networking, IAM policies, S3 storage classes, database options (RDS vs DynamoDB vs Aurora), and cost optimization strategies. These topics appear frequently.</p>
      
      <h2>Exam Strategy</h2>
      <p>Read questions carefully—AWS loves to include subtle details that change the correct answer. Flag difficult questions and return to them. Time management is crucial with 65 questions in 130 minutes.</p>
    `,
  date: 'Sep 18, 2025',
  category: 'Cloud' as Category,
  readTime: '10 min read'
}];

const categories: Category[] = ['All', 'Frontend', 'DevOps', 'Cloud', 'Career'];
const categoryColors = {
  Frontend: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
  DevOps:
  'bg-accent-lavender/10 text-accent-lavender border-accent-lavender/20',
  Cloud: 'bg-accent-coral/10 text-accent-coral border-accent-coral/20',
  Career: 'bg-navy/10 text-navy border-navy/20',
  All: 'bg-slate/10 text-slate border-slate/20'
};
const categoryGradients = {
  Frontend: 'from-accent-pink/5 to-accent-pink/20',
  DevOps: 'from-accent-lavender/5 to-accent-lavender/20',
  Cloud: 'from-accent-coral/5 to-accent-coral/20',
  Career: 'from-navy/5 to-navy/20',
  All: ''
};
interface BlogSectionProps {
  showAll?: boolean;
}
export function BlogSection({ showAll = false }: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const filteredPosts = blogPosts.filter(
    (post) => activeCategory === 'All' || post.category === activeCategory
  );
  const displayedPosts = showAll ? filteredPosts : filteredPosts.slice(0, 3);
  return (
    <section id="blog" className="py-24">
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
        
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mr-6">
                Blog
              </h2>
              <div className="h-px bg-accent-pink flex-grow max-w-xs opacity-50" />
            </div>
            {!showAll &&
            <Link
              to="/blog"
              className="hidden md:inline-flex items-center text-sm font-medium text-navy hover:text-accent-pink transition-colors">
              
                See all posts
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            }
          </div>
          <p className="text-slate text-lg">
            Sharing what I learn along the way.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((category) =>
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategory === category ? categoryColors[category].replace('/10', '').replace('text-', 'bg-').replace('text-navy', 'bg-navy text-white').replace('text-slate', 'bg-slate text-white') + ' text-white shadow-md' : 'bg-white text-slate border-primary-dark hover:border-slate/40'}`}>
            
              {category}
            </button>
          )}
        </div>

        {/* Blog Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          <AnimatePresence mode="popLayout">
            {displayedPosts.map((post) =>
            <motion.article
              key={post.id}
              layout
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.9
              }}
              transition={{
                duration: 0.3
              }}
              className="group bg-white rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-hover transition-all duration-300 border border-primary-dark/20 flex flex-col h-full">
              
                <Link
                to={`/blog/${post.slug}`}
                className="flex flex-col h-full">
                
                  <div
                  className={`h-2 bg-gradient-to-r ${categoryGradients[post.category]}`} />
                
                  <div className="p-6 md:p-8 flex flex-col flex-grow relative">
                    <div className="flex justify-between items-center mb-4">
                      <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[post.category]}`}>
                      
                        {post.category}
                      </span>
                      <span className="text-xs text-slate font-medium">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-navy mb-3 group-hover:text-accent-pink transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate text-sm mb-6 flex-grow leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary-dark/30">
                      <span className="text-xs text-slate font-medium">
                        {post.readTime}
                      </span>
                      <span className="flex items-center text-sm font-medium text-navy group-hover:text-accent-pink transition-colors">
                        Read Article{' '}
                        <ArrowUpRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}
          </AnimatePresence>
        </motion.div>

        {/* See More Button (Mobile + when not showing all) */}
        {!showAll &&
        <div className="mt-10 text-center">
            <Link
            to="/blog"
            className="inline-flex items-center px-8 py-4 bg-white text-navy border border-primary-dark rounded-full font-medium hover:bg-primary-dark/30 transition-colors">
            
              See all posts
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        }
      </motion.div>
    </section>);

}
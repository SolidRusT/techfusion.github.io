import React from 'react';
import { Github, Zap, Printer, Car, Code } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-tech-green-700 p-6 rounded-lg shadow-lg flex items-start">
    <Icon className={`${color} mr-4 flex-shrink-0`} size={48} aria-hidden="true" />
    <div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

const Home = () => {
  const features = [
    { icon: Zap, title: "Information Technology", description: "Exploring the latest in tech innovations and solutions.", color: "text-yellow-400" },
    { icon: Printer, title: "3D Printing", description: "Bringing ideas to life with cutting-edge 3D printing technology.", color: "text-blue-400" },
    { icon: Car, title: "Automotive Modification", description: "Pushing the boundaries of vehicle performance and customization.", color: "text-red-400" },
    { icon: Code, title: "And More...", description: "Diving into any technical challenge that comes our way.", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-green-800 to-tech-green-600 text-white">
      <header className="bg-tech-green-900 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Technical Fusion Canada</h1>
        <nav>
          <a href="https://github.com/SolidRusT/techfusion.github.io" className="ml-4 hover:text-tech-green-300 flex items-center" target="_blank" rel="noopener noreferrer">
            <Github className="mr-1" size={24} aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to the Canadian Technical Community</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Focused on information technology, 3D printing, automotive modification,
            and anything else that sparks our interest.
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </section>
        
        <section className="bg-tech-green-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Our Roots</h2>
          <p className="mb-4">
            Technical Fusion Canada is proudly incubated by SolidRusT Networks, 
            an innovator in disruptive technology solutions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://solidrust.net" className="text-tech-green-300 hover:underline" target="_blank" rel="noopener noreferrer">SolidRusT Networks</a>
            <a href="https://github.com/SolidRusT/" className="text-tech-green-300 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
              <Github className="mr-1" size={24} aria-hidden="true" />
              <span>GitHub Organization</span>
            </a>
          </div>
        </section>
      </main>
      
      <footer className="bg-tech-green-900 p-4 text-center mt-12">
        <p>&copy; {new Date().getFullYear()} Technical Fusion Canada. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
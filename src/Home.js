import React from 'react';
import { Github, Zap, Printer, Car, Code } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-600 text-white">
      <header className="bg-green-900 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Technical Fusion Canada</h1>
        <nav>
          <a href="https://github.com/SolidRusT/techfusion.github.io" className="ml-4 hover:text-green-300 flex items-center">
            <Github className="mr-1" size={24} />
            <span>GitHub</span>
          </a>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to the Canadian Technical Community</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Focused on information technology, 3D printing, automotive modification, and anything else that sparks our interest.
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            { icon: Zap, title: "Information Technology", description: "Exploring the latest in tech innovations and solutions.", color: "text-yellow-400" },
            { icon: Printer, title: "3D Printing", description: "Bringing ideas to life with cutting-edge 3D printing technology.", color: "text-blue-400" },
            { icon: Car, title: "Automotive Modification", description: "Pushing the boundaries of vehicle performance and customization.", color: "text-red-400" },
            { icon: Code, title: "And More...", description: "Diving into any technical challenge that comes our way.", color: "text-purple-400" },
          ].map((item, index) => (
            <div key={index} className="bg-green-700 p-6 rounded-lg shadow-lg flex items-start">
              <item.icon className={`${item.color} mr-4 flex-shrink-0`} size={48} />
              <div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </section>
        
        <section className="bg-green-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Our Roots</h2>
          <p className="mb-4">
            Technical Fusion Canada is proudly incubated by SolidRusT Networks, 
            an innovator in disruptive technology solutions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://solidrust.net" className="text-green-300 hover:underline">SolidRusT Networks</a>
            <a href="https://github.com/SolidRusT/" className="text-green-300 hover:underline flex items-center">
              <Github className="mr-1" size={24} />
              <span>GitHub Organization</span>
            </a>
          </div>
        </section>
      </main>
      
      <footer className="bg-green-900 p-4 text-center mt-12">
        <p>&copy; 2024 Technical Fusion Canada. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
import React from 'react';
import { Github, Zap, Printer, Car, Code } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-600 text-white">
      <header className="bg-green-900 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Technical Fusion Canada</h1>
        <nav>
          <a href="https://github.com/SolidRusT/techfusion.github.io" className="ml-4 hover:text-green-300">
            <Github className="inline mr-1" size={24} />
            GitHub
          </a>
        </nav>
      </header>
      
      <main className="container mx-auto p-8">
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to the Canadian Technical Community</h2>
          <p className="text-xl">
            Focused on information technology, 3D printing, automotive modification, and anything else that sparks our interest.
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-green-700 p-6 rounded-lg shadow-lg flex items-center">
            <Zap className="text-yellow-400 mr-4" size={48} />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Information Technology</h3>
              <p>Exploring the latest in tech innovations and solutions.</p>
            </div>
          </div>
          <div className="bg-green-700 p-6 rounded-lg shadow-lg flex items-center">
            <Printer className="text-blue-400 mr-4" size={48} />
            <div>
              <h3 className="text-2xl font-semibold mb-2">3D Printing</h3>
              <p>Bringing ideas to life with cutting-edge 3D printing technology.</p>
            </div>
          </div>
          <div className="bg-green-700 p-6 rounded-lg shadow-lg flex items-center">
            <Car className="text-red-400 mr-4" size={48} />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Automotive Modification</h3>
              <p>Pushing the boundaries of vehicle performance and customization.</p>
            </div>
          </div>
          <div className="bg-green-700 p-6 rounded-lg shadow-lg flex items-center">
            <Code className="text-purple-400 mr-4" size={48} />
            <div>
              <h3 className="text-2xl font-semibold mb-2">And More...</h3>
              <p>Diving into any technical challenge that comes our way.</p>
            </div>
          </div>
        </section>
        
        <section className="bg-green-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Our Roots</h2>
          <p className="mb-4">
            Technical Fusion Canada is proudly incubated by SolidRusT Networks, 
            an innovator in disruptive technology solutions.
          </p>
          <div>
            <a href="https://solidrust.net" className="text-green-300 hover:underline mr-4">SolidRusT Networks</a>
            <a href="https://github.com/SolidRusT/" className="text-green-300 hover:underline">
              <Github className="inline mr-1" size={24} />
              GitHub Organization
            </a>
          </div>
        </section>
      </main>
      
      <footer className="bg-green-900 p-4 text-center">
        <p>&copy; 2024 Technical Fusion Canada. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
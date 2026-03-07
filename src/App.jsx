import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Analytics } from '@vercel/analytics/react';

// --- Custom Typewriter Component for Terminal Effect ---
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(intervalId);
      }
    }, 40); // Speed of typing in milliseconds
    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {displayedText}
      <span className="animate-pulse font-bold text-emerald-300">_</span>
    </div>
  );
};

// --- Project Data ---
const myProjects = [
  {
    title: "IoT Smart Parking System",
    tech: "C++ / Microcontrollers / IoT Sensors",
    description: "A highly scalable smart parking solution integrating IoT sensors and microcontrollers to monitor and manage real-time parking space availability.",
    video: "/parking.mp4", // KEEP YOUR VIDEO LINK HERE! 
    typewriterText: "", 
    github: "",
    demo: "#" 
  },
  {
    title: "Madarsa Gate Scanner",
    tech: "Python / Flask / Google Sheets API",
    description: "An automated entry logging system built with Python and Flask. It uses barcode scanning to instantly log student entries into a centralized Google Sheet.",
    video: "", // Leave blank to trigger the typing effect
    typewriterText: "> Initializing entry logs...\n> Scanning student barcode...\n> ID Verified.\n> Access Granted.\n> Data pushed to Google Sheets successfully.",
    github: "https://github.com/gmqazi1036/jamiturraza_main_gate.git",
    demo: "https://jamiaturraza-security.up.railway.app/login"
  },
  {
    title: "Majmua Aamaal",
    tech: "Full-Stack Web Development",
    description: "A comprehensive web application featuring a highly optimized UI/UX, providing users with an accessible collection of Islamic supplications and practices.",
    video: "", 
    typewriterText: "> Fetching supplication collection...\n> Loading UI/UX components...\n> Optimizing assets...\n> Majmua Aamaal deployed and live.",
    github: "https://github.com/hasanmujtaba2006/khatme-qadirya.git",
    demo: "https://khatme-qadirya.onrender.com/"
  },
  {
    title: "Next-Gen Ebook Platform",
    tech: "Concept / Startup Idea",
    description: "A conceptual application designed to scan physical books and convert them into formatted ebooks, featuring a personal vault and self-publishing platform.",
    video: "", 
    typewriterText: "> Booting physical scanner module...\n> Processing page geometry...\n> OCR Text Extraction: 100%\n> Converting to .epub format...\n> Saved to Personal Vault.",
    github: "https://github.com/hasanmujtaba2006/Scan2eBook-AI.git",
    demo: "https://scan2e-book-ai.vercel.app/"
  }
];

const App = () => {
  // --- Custom Cursor State ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans scroll-smooth md:cursor-none">
      
      {/* --- Custom Glowing Cursor --- */}
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0 hidden md:block"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.6 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full pointer-events-none z-[100] shadow-[0_0_15px_3px_rgba(52,211,153,0.8)] hidden md:block"
        animate={{ x: mousePosition.x - 6, y: mousePosition.y - 6 }}
        transition={{ type: "spring", stiffness: 1000, damping: 40 }}
      />

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-[#0a0a0a]/70 border-b border-white/5">
        <div className="text-2xl font-bold tracking-tighter text-emerald-400">HM.</div>
        <div className="space-x-8 text-sm text-gray-400 hidden md:block">
          <a href="#about" className="hover:text-emerald-400 transition-colors md:cursor-none">About</a>
          <a href="#projects" className="hover:text-emerald-400 transition-colors md:cursor-none">Projects</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors md:cursor-none">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative h-screen flex items-center justify-center px-6 md:px-24 pt-20">
        
        <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center pointer-events-none">
          
          <div className="w-full h-[400px] md:h-[600px] relative pointer-events-auto z-0 opacity-95 md:cursor-none">
             <Spline scene="https://prod.spline.design/MFnQuE1jhBVwXknr/scene.splinecode" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <h2 className="text-emerald-400 font-medium tracking-wide mb-3">
              Assalam-u-alaikum, my name is
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg">
              Hasan Mujtaba.
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-500 tracking-tight mb-6 drop-shadow-lg">
              I build things for the web & IoT.
            </h1>
            <p className="max-w-xl text-gray-300 text-lg leading-relaxed mb-8 drop-shadow-md backdrop-blur-sm bg-[#0a0a0a]/30 p-2 rounded-lg">
              I'm a software developer with a strong foundation in Python, full-stack architecture, and hardware integration. Currently focused on building my startup and exploring Data Science.
            </p>
            
            <a href="#projects" className="pointer-events-auto px-8 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-emerald-400 text-emerald-400 rounded-md hover:bg-emerald-400 hover:text-[#0a0a0a] transition-all duration-300 inline-block font-semibold md:cursor-none">
              Check out my projects
            </a>
          </motion.div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="relative z-10 min-h-screen bg-[#0a0a0a] px-6 md:px-24 py-24 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4">
              <span className="text-emerald-400 text-2xl">01.</span> About Me
              <div className="h-[1px] bg-gray-700 flex-grow ml-4 max-w-xs"></div>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-6 text-gray-400 leading-relaxed text-lg"
            >
              <p>
                I am currently pursuing my B.Tech in Computer Science and Engineering. My journey in tech started with a deep curiosity about how software and hardware communicate, which quickly evolved into building end-to-end systems.
              </p>
              <p>
                Whether I am writing complex Python backends, debugging C++ pointers for a micro-controller, or deploying full-stack web applications, I enjoy tackling problems from the ground up. In fact, when I step away from the keyboard, my favorite hobby is solving rigorous mathematics problems to keep my logic sharp.
              </p>
              <p>
                My ultimate goal is entrepreneurship. I am actively working towards launching a tech startup, bridging the gap between physical utilities and digital convenience.
              </p>
              
              <div className="mt-8">
                <p className="text-gray-200 font-medium mb-4">A few technologies I've been working with recently:</p>
                <ul className="grid grid-cols-2 gap-2 text-sm font-mono text-emerald-400">
                  <li className="flex items-center gap-2">▹ Python & Flask</li>
                  <li className="flex items-center gap-2">▹ React & Tailwind</li>
                  <li className="flex items-center gap-2">▹ C / C++</li>
                  <li className="flex items-center gap-2">▹ Data Science</li>
                  <li className="flex items-center gap-2">▹ Internet of Things (IoT)</li>
                  <li className="flex items-center gap-2">▹ Google Sheets API</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative group md:cursor-none w-3/4 mx-auto md:w-full max-w-md"
            >
              <div className="absolute inset-0 border-2 border-emerald-400 rounded-xl translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 -z-10"></div>
              
              <div className="bg-[#111111] rounded-xl aspect-square relative z-10 overflow-hidden">
                 <div className="absolute inset-0 bg-emerald-400/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none"></div>
                 <img 
                   src="/profile.jpg" 
                   alt="Hasan Mujtaba" 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                 />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 min-h-screen bg-[#0a0a0a] px-6 md:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4">
              <span className="text-emerald-400 text-2xl">02.</span> Featured Projects
              <div className="h-[1px] bg-gray-700 flex-grow ml-4 max-w-xs"></div>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {myProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.1 }}
                className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col group hover:border-emerald-400/50 transition-all duration-300 md:cursor-none overflow-hidden"
              >
                {/* Media Container: Checks for Video FIRST, then defaults to Terminal Typewriter */}
                <div className="w-full h-56 bg-gray-900 relative overflow-hidden border-b border-white/5">
                  <div className="absolute inset-0 bg-emerald-400/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                  
                  {project.video ? (
                    <video 
                      src={project.video} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    // Sleek Hacker Terminal UI
                    <div className="w-full h-full bg-[#050505] p-6 pt-12 font-mono text-xs md:text-sm text-emerald-400 relative overflow-hidden flex flex-col justify-center">
                      
                      {/* Fake Mac Window Controls */}
                      <div className="absolute top-0 left-0 w-full bg-[#111111] px-4 py-2 flex gap-2 items-center border-b border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        <span className="text-gray-500 text-[10px] ml-2 font-sans tracking-widest uppercase">
                          {project.title.split(' ')[0]} ~ bash
                        </span>
                      </div>

                      {/* Typing Effect Engine */}
                      <TypewriterText text={project.typewriterText} />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="text-emerald-400 text-sm font-mono mb-3">{project.tech}</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Links Section */}
                  <div className="mt-8 flex gap-6">
                    {project.github !== "#" && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-emerald-400 flex items-center gap-2 transition-colors md:cursor-none z-20 pointer-events-auto">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        Code
                      </a>
                    )}
                    {project.demo !== "#" && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-emerald-400 flex items-center gap-2 transition-colors md:cursor-none z-20 pointer-events-auto">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Live Demo
                      </a>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 bg-[#0a0a0a] px-6 md:px-24 py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-2xl"
        >
          <div className="text-emerald-400 font-mono mb-4">03. What's Next?</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Whether you have a question about my IoT builds, want to discuss a tech startup idea, or just want to say hi, my inbox is always open. I'll try my best to get back to you!
          </p>
          
          <a href="mailto:hasanmujtaba.q@gmail.com" className="px-8 py-4 bg-emerald-400 text-[#0a0a0a] font-bold rounded-md hover:bg-emerald-300 transition-colors duration-300 inline-block md:cursor-none z-20 pointer-events-auto">
            Say Hello
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-500 text-sm font-mono bg-[#0a0a0a]">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://github.com/hasanmujtaba2006" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors md:cursor-none pointer-events-auto">GitHub</a>
          <a href="https://www.linkedin.com/in/hasan-mujtaba-55b87037b/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors md:cursor-none pointer-events-auto">LinkedIn</a>
          <a href="https://t.me/Hasanmujtaba12" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors md:cursor-none pointer-events-auto">Telegram</a>
          <a href="https://discordapp.com/users/hasan_0249" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors md:cursor-none pointer-events-auto">Discord</a>
        </div>
        <p>Built by Hasan Mujtaba. &copy; {new Date().getFullYear()}</p>
      </footer>

      <Analytics />
    </div>
  );
};

export default App;

import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
    </>
  );
}

export default App;
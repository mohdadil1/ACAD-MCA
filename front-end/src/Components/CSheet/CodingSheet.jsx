import React, { useState } from 'react';
import Jumbotron from '../UI/Jumbotron/Jumbotron';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import { Table } from './Table'; 
import './CodingSheet.css';
import { ThemeProvider } from '../Context/theme';
import ThemeBtn from '../CSheet/ThemeBtn';

const CodingSheet = () => {
  const [isOpen, setIsOpen] = useState(Array(Table().length).fill(false));
  const [themeMode, setThemeMode] = useState("dark");

  const lightTheme = () => {
    setThemeMode("light");
  }

  const darkTheme = () => {
    setThemeMode("dark");
  }

  const toggleSection = (index) => {
    setIsOpen(prevState => {
      const newIsOpen = [...prevState];
      newIsOpen[index] = !newIsOpen[index];
      return newIsOpen;
    });
  };

  return (
    <ThemeProvider value={{themeMode, lightTheme, darkTheme}}>
      <div className={`table-container ${themeMode}`} style={{ minHeight: '100vh' }}>
        <div>
          <Jumbotron
            title="Coding Sheet"
            description="A curated set of top coding interview questions across key Data Structures & Algorithms topics"
          />
        </div>
        <div className="w-full max-w-sm mx-auto flex justify-end mb-4 py-2">
          <ThemeBtn />
        </div>
        <div className="container py-10 px-4 sm:px-6 md:px-10 mx-auto" style={{ minHeight: '80vh', overflowY: 'auto' }}>
          {Table().map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden mb-8">
              <div className="flex justify-between items-center bg-white p-4">
            <button
                className="w-full flex items-center justify-between px-4 py-1 text-xl font-bold text-gray-600 hover:text-brand-600 transition-colors duration-200"
                onClick={() => toggleSection(sectionIndex)}
              >
                <span>{section.title}</span>
                <div className="ml-2 text-brand-500">
                  {isOpen[sectionIndex] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>
              </div>
              {isOpen[sectionIndex] && (
                <div className="bg-white">
                  <div className="overflow-x-auto">
                    {section.content}
                  </div>
                  
                </div>
              )}
            </div>
          ))}
          <h1 className='center text-2xl text-gray-400 font-light'>More topics coming soon.</h1>
        </div>
        
      </div>
    </ThemeProvider>
  );
};

export default CodingSheet;

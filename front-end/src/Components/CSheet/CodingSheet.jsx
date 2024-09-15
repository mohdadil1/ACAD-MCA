import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const applyTheme = () => {
      const tableContainer = document.querySelector('.table-container');
      if (tableContainer) {
        tableContainer.classList.remove('light', 'dark');
        tableContainer.classList.add(themeMode);
      } else {
        console.log('Table container not found!');
      }
    };
    applyTheme();
  }, [themeMode]);

  return (
    <ThemeProvider value={{themeMode, lightTheme, darkTheme}}>
      <div className={`table-container ${themeMode}`} style={{ minHeight: '100vh' }}>
        <div>
          <Jumbotron
            title="Coding Sheet"
            description="Sheet contains very handily crafted and picked top coding interview questions from different topics of Data Structures & Algorithms"
          />
        </div>
        <div className="w-full max-w-sm mx-auto flex justify-end mb-4 py-2">
          <ThemeBtn />
        </div>
        <div className="container py-10 px-4 sm:px-6 md:px-10 lg: mx-auto" style={{ minHeight: '80vh', overflowY: 'auto' }}>
          {Table().map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-300 rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="flex justify-between items-center bg-white p-4">
            <button 
                className="w-full flex items-center justify-between px-4 py-1 text-xl font-bold text-gray-600"
                onClick={() => toggleSection(sectionIndex)}
              >
                <span>{section.title}</span>
                <div className="ml-2">
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
          <h1 className='center text-2xl'>Update more soon....</h1>
        </div>
        
      </div>
    </ThemeProvider>
  );
};

export default CodingSheet;

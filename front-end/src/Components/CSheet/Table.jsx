import React from 'react';
import { FaYoutube, FaEdit } from 'react-icons/fa'; 
import { CodingSheet } from '../../CodingSheet'; 

export const Table = () => {
  return CodingSheet.map((section, sectionIndex) => {
    const sectionContainer = (
      <div className="overflow-x-auto px-10 py-5">
        <table className="w-full border-l border-t border-gray-200">
          <thead>
            <tr>
              {section.columns.map((column) => (
                <th key={column.name} className="px-6 py-4 border-b-2 border-r border-brand-200 text-center font-bold text-lg">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.problems.map((problem, index) => (
              <tr key={index} className="hover:bg-brand-500/5 transition-colors duration-150">
                {section.columns.map((column) => (
                  <td key={column.name} className="px-6 py-4 border-b border-r text-lg text-center">
                    {column.name === 'problem' && problem[column.name]}
                    {column.name === 'youtube' && (
                      problem[column.name] && problem[column.name].trim().startsWith('http') ? (
                        <a href={problem[column.name]} target="_blank" rel="noopener noreferrer">
                          <FaYoutube className="text-red-600 mx-auto text-xl" />
                        </a>
                      ) : (
                        <span className="text-gray-400">soon...</span>
                      )
                    )}
                    {column.name === 'practice' && (
                      problem[column.name] && problem[column.name].trim().startsWith('http') ? (
                        <a href={problem[column.name]} target="_blank" rel="noopener noreferrer">
                          <FaEdit className="text-yellow-600 mx-auto text-xl" />
                        </a>
                      ) : (
                        <span className="text-gray-400">soon...</span>
                      )
                    )}
                    {column.name === 'difficulty' && (
                      <span className={`px-3 py-2 rounded-full ${
                        problem[column.name] === 'Easy' ? 'bg-green-100 text-green-600' : 
                        problem[column.name] === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 
                        problem[column.name] === 'Hard' ? 'bg-red-100 text-red-600' : ''
                      } text-lg`}>
                        {problem[column.name]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return { sectionIndex, title: section.title, content: sectionContainer };
  });
};

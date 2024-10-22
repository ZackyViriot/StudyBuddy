import React, { useState, useEffect } from 'react';

interface University {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
}

const big12Schools: University[] = [
  { name: 'University of Texas', shortName: 'Texas', primaryColor: '#BF5700', secondaryColor: '#FFFFFF' },
  { name: 'Texas Tech University', shortName: 'Texas Tech', primaryColor: '#CC0000', secondaryColor: '#000000' },
  { name: 'Baylor University', shortName: 'Baylor', primaryColor: '#003015', secondaryColor: '#FECB00' },
  { name: 'Texas Christian University', shortName: 'TCU', primaryColor: '#4D1979', secondaryColor: '#A3A9AC' },
  { name: 'University of Oklahoma', shortName: 'Oklahoma', primaryColor: '#841617', secondaryColor: '#FDF9D8' },
  { name: 'Oklahoma State University', shortName: 'Oklahoma State', primaryColor: '#FF7300', secondaryColor: '#000000' },
  { name: 'Kansas State University', shortName: 'K-State', primaryColor: '#512888', secondaryColor: '#D1D1D1' },
  { name: 'University of Kansas', shortName: 'Kansas', primaryColor: '#0051BA', secondaryColor: '#E8000D' },
  { name: 'Iowa State University', shortName: 'Iowa State', primaryColor: '#C8102E', secondaryColor: '#F1BE48' },
  { name: 'West Virginia University', shortName: 'West Virginia', primaryColor: '#002855', secondaryColor: '#EAAA00' },
  { name: 'University of Cincinnati', shortName: 'Cincinnati', primaryColor: '#000000', secondaryColor: '#E00122' },
  { name: 'University of Central Florida', shortName: 'UCF', primaryColor: '#FFC904', secondaryColor: '#000000' },
  { name: 'University of Houston', shortName: 'Houston', primaryColor: '#C8102E', secondaryColor: '#F6F6F7' },
  { name: 'Brigham Young University', shortName: 'BYU', primaryColor: '#002E5D', secondaryColor: '#FFFFFF' },
];

const UniversityMovingGallery: React.FC = () => {
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setPosition((prevPosition) => (prevPosition <= -100 ? 0 : prevPosition - 0.03));
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="overflow-hidden ml-4 h-10 flex items-center b-">
      <div 
        className="flex whitespace-nowrap transition-transform duration-1000 ease-linear"
        style={{ transform: `translateX(${position}%)` }}
      >
        {[...big12Schools, ...big12Schools].map((school, index) => (
          <div 
            key={index} 
            className="inline-flex items-center mx-3 opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
              style={{ 
                backgroundColor: school.primaryColor,
                color: school.secondaryColor
              }}
            >
              <span className="text-xs font-bold">{school.shortName[0]}</span>
            </div>
            <span className="text-xs font-medium text-gray-700">{school.shortName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversityMovingGallery;
// Sample housing dataset (prices in INR)
export const houseData = {
  trainFeatures: [
    [600, 1, 1],   // 1BHK
    [800, 2, 1],   // 2BHK
    [1000, 2, 2],  // 2BHK
    [1200, 3, 2],  // 3BHK
    [1500, 3, 2],  // 3BHK
    [1800, 3, 3],  // 3BHK
    [2000, 4, 3],  // 4BHK
    [2500, 4, 4],  // 4BHK
  ],
  trainLabels: [
    2500000,   // 25 Lakh
    3500000,   // 35 Lakh
    4500000,   // 45 Lakh
    6000000,   // 60 Lakh
    7500000,   // 75 Lakh
    9000000,   // 90 Lakh
    11000000,  // 1.1 Crore
    13500000,  // 1.35 Crore
  ]
};

export const featureNames = ['Square Feet', 'Bedrooms', 'Bathrooms'];

export const formatInr = (value: number): string => {
  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  
  if (crore > 0 && lakh > 0) {
    return `₹${crore} Crore ${lakh} Lakh`;
  } else if (crore > 0) {
    return `₹${crore} Crore`;
  } else if (lakh > 0) {
    return `₹${lakh} Lakh`;
  } else {
    return `₹${value}`;
  }
};
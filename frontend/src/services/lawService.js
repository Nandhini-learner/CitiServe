import axios from 'axios';

const API_URL = 'http://localhost:5000/api/laws';

// 1. Mock Data for Categories
const mockCategories = [
  { _id: '1', name: 'Constitutional Rights', description: 'Fundamental rights guaranteed by the constitution.' },
  { _id: '2', name: 'Women & Child Protections', description: 'Laws safeguarding safety, equality, and education.' },
  { _id: '3', name: 'Consumer & Digital Laws', description: 'Your legal protections in commerce and online spaces.' }
];

// 2. Mock Data for Laws inside those categories
const mockLaws = [
  { _id: '101', title: 'Right to Equality', description: 'Prohibits discrimination on grounds of religion, race, caste, sex, or place of birth.', category: 'Constitutional Rights' },
  { _id: '102', title: 'Right to Education (RTE)', description: 'Provides free and compulsory education for children between the ages of 6 and 14.', category: 'Women & Child Protections' },
  { _id: '103', title: 'Information Technology Act', description: 'Primary law dealing with cybercrime and electronic commerce.', category: 'Consumer & Digital Laws' }
];

// --- API Functions returning Mock Data instantly ---

export const getAllLaws = async (search = '') => {
  if (!search) return mockLaws;
  return mockLaws.filter(law => 
    law.title.toLowerCase().includes(search.toLowerCase()) || 
    law.description.toLowerCase().includes(search.toLowerCase())
  );
};

export const getCategories = async () => {
  return mockCategories;
};

export const getLawsByCategory = async (categoryName) => {
  return mockLaws.filter(law => law.category === categoryName);
};

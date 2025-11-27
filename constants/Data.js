//class code
export const CLASS_CATALOG = {
  FEC201: { id: 4, code: 'FEC201', name: 'FEC201: Algorithm I', lecturer: 'Dr. Smith' },
  CS305: { id: 6, code: 'CS305', name: 'CS305: Data Structures & Algorithms II', lecturer: 'Prof. Chen' },
  CS350: { id: 7, code: 'CS350', name: 'CS350: Web Development', lecturer: 'Dr. Rivera' },
  CS410: { id: 8, code: 'CS410', name: 'CS410: Operating Systems', lecturer: 'Prof. Thompson' },
  MATH202: { id: 5, code: 'MATH202', name: 'MATH202: Calculus II', lecturer: 'Prof. Lee' },
  MATH301: { id: 9, code: 'MATH301', name: 'MATH301: Linear Algebra', lecturer: 'Dr. Patel' },
  STATS250: { id: 10, code: 'STATS250', name: 'STATS250: Probability & Statistics', lecturer: 'Prof. Kim' },
  PHYS151: { id: 11, code: 'PHYS151', name: 'PHYS151: General Physics I', lecturer: 'Dr. Ahmed' },
  ECE220: { id: 12, code: 'ECE220', name: 'ECE220: Digital Logic Design', lecturer: 'Prof. Williams' },
  WRIT101: { id: 13, code: 'WRIT101', name: 'WRIT101: Academic Writing', lecturer: 'Dr. O’Connor' },
};

export const findClassByCode = (code) => {
  if (!code) return null;
  const upperCode = code.trim().toUpperCase();
  return CLASS_CATALOG[upperCode] || null;
};

//quiz code
export const QUIZ_CATALOG = {
  QZ42XX: { 
    id: 'qz-001', 
    code: 'QZ42XX', 
    name: 'Algorithm Quiz #1', 
    classCode: 'FEC201',
    questions: 10,
    duration: 15 
  },
  QZ09YY: { 
    id: 'qz-002', 
    code: 'QZ09YY', 
    name: 'Calculus Midterm', 
    classCode: 'MATH202',
    questions: 12,
    duration: 20
  },
  QZ77ZZ: { 
    id: 'qz-003', 
    code: 'QZ77ZZ', 
    name: 'Web Dev Basics', 
    classCode: 'CS350',
    questions: 8,
    duration: 10
  },
};

export const findQuizByCode = (code) => {
  if (!code) return null;
  const upperCode = code.trim().toUpperCase();
  return QUIZ_CATALOG[upperCode] || null;
};
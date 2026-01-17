const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('../models/Student');
const School = require('../models/School');
const Department = require('../models/Department');

const schools = [
  { schoolId: 0, name: "School of Engineering" },
  { schoolId: 1, name: "School of Business" },
  { schoolId: 2, name: "School of Arts & Sciences" },
  { schoolId: 3, name: "School of Medicine" },
  { schoolId: 4, name: "School of Law" },
  { schoolId: 5, name: "School of Education" }
];

const departments = [
  // Engineering
  { departmentId: 0, name: "Information Technology", code: "DIT/", schoolId: 0, schoolName: "School of Engineering" },
  { departmentId: 1, name: "Computer Science", code: "CS/", schoolId: 0, schoolName: "School of Engineering" },
  { departmentId: 2, name: "Software Engineering", code: "SE/", schoolId: 0, schoolName: "School of Engineering" },
  { departmentId: 3, name: "Civil Engineering", code: "CE/", schoolId: 0, schoolName: "School of Engineering" },
  { departmentId: 4, name: "Mechanical Engineering", code: "ME/", schoolId: 0, schoolName: "School of Engineering" },
  
  // Business
  { departmentId: 5, name: "Business Administration", code: "BBA/", schoolId: 1, schoolName: "School of Business" },
  { departmentId: 6, name: "Economics", code: "ECO/", schoolId: 1, schoolName: "School of Business" },
  { departmentId: 7, name: "Marketing", code: "MKT/", schoolId: 1, schoolName: "School of Business" },
  { departmentId: 8, name: "Finance", code: "FIN/", schoolId: 1, schoolName: "School of Business" },
  
  // Arts & Sciences
  { departmentId: 9, name: "Psychology", code: "PSY/", schoolId: 2, schoolName: "School of Arts & Sciences" },
  { departmentId: 10, name: "English Literature", code: "ENG/", schoolId: 2, schoolName: "School of Arts & Sciences" },
  { departmentId: 11, name: "Mathematics", code: "MTH/", schoolId: 2, schoolName: "School of Arts & Sciences" },
  { departmentId: 12, name: "Biology", code: "BIO/", schoolId: 2, schoolName: "School of Arts & Sciences" },
  
  // Medicine
  { departmentId: 13, name: "General Medicine", code: "MED/", schoolId: 3, schoolName: "School of Medicine" },
  { departmentId: 14, name: "Nursing", code: "NUR/", schoolId: 3, schoolName: "School of Medicine" },
  { departmentId: 15, name: "Pharmacy", code: "PHM/", schoolId: 3, schoolName: "School of Medicine" },
  
  // Law
  { departmentId: 16, name: "Law", code: "LAW/", schoolId: 4, schoolName: "School of Law" },
  { departmentId: 17, name: "International Law", code: "ILW/", schoolId: 4, schoolName: "School of Law" },
  
  // Education
  { departmentId: 18, name: "Primary Education", code: "PED/", schoolId: 5, schoolName: "School of Education" },
  { departmentId: 19, name: "Secondary Education", code: "SED/", schoolId: 5, schoolName: "School of Education" },
  { departmentId: 20, name: "Special Education", code: "SPE/", schoolId: 5, schoolName: "School of Education" }
];

const students = [
  // Engineering - IT
  { registrationNumber: "DIT/2024/001", name: "John Doe", email: "john.doe@university.edu", yearOfStudy: "2.1", meanScore: 75, schoolId: 0, schoolName: "School of Engineering", departmentId: 0, departmentName: "Information Technology", departmentCode: "DIT/" },
  { registrationNumber: "DIT/2024/002", name: "Jane Smith", email: "jane.smith@university.edu", yearOfStudy: "3.1", meanScore: 82, schoolId: 0, schoolName: "School of Engineering", departmentId: 0, departmentName: "Information Technology", departmentCode: "DIT/" },
  { registrationNumber: "DIT/2024/003", name: "Bob Wilson", email: "bob.wilson@university.edu", yearOfStudy: "1.1", meanScore: 45, schoolId: 0, schoolName: "School of Engineering", departmentId: 0, departmentName: "Information Technology", departmentCode: "DIT/" },
  { registrationNumber: "DIT/2024/004", name: "Alice Brown", email: "alice.brown@university.edu", yearOfStudy: "4.1", meanScore: 85, schoolId: 0, schoolName: "School of Engineering", departmentId: 0, departmentName: "Information Technology", departmentCode: "DIT/" },
  
  // Engineering - CS
  { registrationNumber: "CS/2024/001", name: "Mike Johnson", email: "mike.johnson@university.edu", yearOfStudy: "3.1", meanScore: 88, schoolId: 0, schoolName: "School of Engineering", departmentId: 1, departmentName: "Computer Science", departmentCode: "CS/" },
  { registrationNumber: "CS/2024/002", name: "Sarah Davis", email: "sarah.davis@university.edu", yearOfStudy: "2.1", meanScore: 91, schoolId: 0, schoolName: "School of Engineering", departmentId: 1, departmentName: "Computer Science", departmentCode: "CS/" },
  { registrationNumber: "CS/2024/003", name: "Tom Anderson", email: "tom.anderson@university.edu", yearOfStudy: "1.1", meanScore: 55, schoolId: 0, schoolName: "School of Engineering", departmentId: 1, departmentName: "Computer Science", departmentCode: "CS/" },
  
  // Engineering - SE
  { registrationNumber: "SE/2024/001", name: "Lisa Garcia", email: "lisa.garcia@university.edu", yearOfStudy: "4.1", meanScore: 86, schoolId: 0, schoolName: "School of Engineering", departmentId: 2, departmentName: "Software Engineering", departmentCode: "SE/" },
  { registrationNumber: "SE/2024/002", name: "David Lee", email: "david.lee@university.edu", yearOfStudy: "2.1", meanScore: 52, schoolId: 0, schoolName: "School of Engineering", departmentId: 2, departmentName: "Software Engineering", departmentCode: "SE/" },
  
  // Engineering - CE
  { registrationNumber: "CE/2024/001", name: "Peter Chen", email: "peter.chen@university.edu", yearOfStudy: "3.1", meanScore: 78, schoolId: 0, schoolName: "School of Engineering", departmentId: 3, departmentName: "Civil Engineering", departmentCode: "CE/" },
  { registrationNumber: "CE/2024/002", name: "Maria Santos", email: "maria.santos@university.edu", yearOfStudy: "2.1", meanScore: 83, schoolId: 0, schoolName: "School of Engineering", departmentId: 3, departmentName: "Civil Engineering", departmentCode: "CE/" },
  
  // Engineering - ME
  { registrationNumber: "ME/2024/001", name: "Ahmed Hassan", email: "ahmed.hassan@university.edu", yearOfStudy: "4.1", meanScore: 79, schoolId: 0, schoolName: "School of Engineering", departmentId: 4, departmentName: "Mechanical Engineering", departmentCode: "ME/" },
  { registrationNumber: "ME/2024/002", name: "Jennifer Park", email: "jennifer.park@university.edu", yearOfStudy: "1.1", meanScore: 71, schoolId: 0, schoolName: "School of Engineering", departmentId: 4, departmentName: "Mechanical Engineering", departmentCode: "ME/" },
  
  // Business - BBA
  { registrationNumber: "BBA/2024/001", name: "Emma Martinez", email: "emma.martinez@university.edu", yearOfStudy: "3.1", meanScore: 77, schoolId: 1, schoolName: "School of Business", departmentId: 5, departmentName: "Business Administration", departmentCode: "BBA/" },
  { registrationNumber: "BBA/2024/002", name: "Chris Taylor", email: "chris.taylor@university.edu", yearOfStudy: "1.1", meanScore: 48, schoolId: 1, schoolName: "School of Business", departmentId: 5, departmentName: "Business Administration", departmentCode: "BBA/" },
  { registrationNumber: "BBA/2024/003", name: "Nina Rodriguez", email: "nina.rodriguez@university.edu", yearOfStudy: "2.1", meanScore: 84, schoolId: 1, schoolName: "School of Business", departmentId: 5, departmentName: "Business Administration", departmentCode: "BBA/" },
  
  // Business - ECO
  { registrationNumber: "ECO/2024/001", name: "Ryan Clark", email: "ryan.clark@university.edu", yearOfStudy: "3.1", meanScore: 81, schoolId: 1, schoolName: "School of Business", departmentId: 6, departmentName: "Economics", departmentCode: "ECO/" },
  { registrationNumber: "ECO/2024/002", name: "Sophia White", email: "sophia.white@university.edu", yearOfStudy: "4.1", meanScore: 42, schoolId: 1, schoolName: "School of Business", departmentId: 6, departmentName: "Economics", departmentCode: "ECO/" },
  
  // Business - MKT
  { registrationNumber: "MKT/2024/001", name: "Kevin Moore", email: "kevin.moore@university.edu", yearOfStudy: "2.1", meanScore: 76, schoolId: 1, schoolName: "School of Business", departmentId: 7, departmentName: "Marketing", departmentCode: "MKT/" },
  { registrationNumber: "MKT/2024/002", name: "Grace Hall", email: "grace.hall@university.edu", yearOfStudy: "1.2", meanScore: 89, schoolId: 1, schoolName: "School of Business", departmentId: 7, departmentName: "Marketing", departmentCode: "MKT/" },
  
  // Business - FIN
  { registrationNumber: "FIN/2024/001", name: "Marcus Johnson", email: "marcus.johnson@university.edu", yearOfStudy: "3.1", meanScore: 87, schoolId: 1, schoolName: "School of Business", departmentId: 8, departmentName: "Finance", departmentCode: "FIN/" },
  { registrationNumber: "FIN/2024/002", name: "Isabella Wong", email: "isabella.wong@university.edu", yearOfStudy: "2.1", meanScore: 74, schoolId: 1, schoolName: "School of Business", departmentId: 8, departmentName: "Finance", departmentCode: "FIN/" },
  
  // Arts & Sciences - PSY
  { registrationNumber: "PSY/2024/001", name: "Daniel Young", email: "daniel.young@university.edu", yearOfStudy: "3.1", meanScore: 58, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 9, departmentName: "Psychology", departmentCode: "PSY/" },
  { registrationNumber: "PSY/2024/002", name: "Olivia King", email: "olivia.king@university.edu", yearOfStudy: "2.1", meanScore: 85, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 9, departmentName: "Psychology", departmentCode: "PSY/" },
  
  // Arts & Sciences - ENG
  { registrationNumber: "ENG/2024/001", name: "James Wright", email: "james.wright@university.edu", yearOfStudy: "4.1", meanScore: 78, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 10, departmentName: "English Literature", departmentCode: "ENG/" },
  { registrationNumber: "ENG/2024/002", name: "Mia Lopez", email: "mia.lopez@university.edu", yearOfStudy: "1.1", meanScore: 39, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 10, departmentName: "English Literature", departmentCode: "ENG/" },
  
  // Arts & Sciences - MTH
  { registrationNumber: "MTH/2024/001", name: "Alex Turner", email: "alex.turner@university.edu", yearOfStudy: "3.1", meanScore: 92, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 11, departmentName: "Mathematics", departmentCode: "MTH/" },
  { registrationNumber: "MTH/2024/002", name: "Zoe Adams", email: "zoe.adams@university.edu", yearOfStudy: "2.2", meanScore: 67, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 11, departmentName: "Mathematics", departmentCode: "MTH/" },
  
  // Arts & Sciences - BIO
  { registrationNumber: "BIO/2024/001", name: "Samuel Green", email: "samuel.green@university.edu", yearOfStudy: "3.1", meanScore: 80, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 12, departmentName: "Biology", departmentCode: "BIO/" },
  { registrationNumber: "BIO/2024/002", name: "Rachel Kim", email: "rachel.kim@university.edu", yearOfStudy: "2.1", meanScore: 88, schoolId: 2, schoolName: "School of Arts & Sciences", departmentId: 12, departmentName: "Biology", departmentCode: "BIO/" },
  
  // Medicine - MED
  { registrationNumber: "MED/2024/001", name: "Dr. Michael Brown", email: "michael.brown@university.edu", yearOfStudy: "5.1", meanScore: 94, schoolId: 3, schoolName: "School of Medicine", departmentId: 13, departmentName: "General Medicine", departmentCode: "MED/" },
  { registrationNumber: "MED/2024/002", name: "Elena Vasquez", email: "elena.vasquez@university.edu", yearOfStudy: "4.1", meanScore: 91, schoolId: 3, schoolName: "School of Medicine", departmentId: 13, departmentName: "General Medicine", departmentCode: "MED/" },
  
  // Medicine - NUR
  { registrationNumber: "NUR/2024/001", name: "Patricia Miller", email: "patricia.miller@university.edu", yearOfStudy: "3.1", meanScore: 86, schoolId: 3, schoolName: "School of Medicine", departmentId: 14, departmentName: "Nursing", departmentCode: "NUR/" },
  { registrationNumber: "NUR/2024/002", name: "Carlos Rivera", email: "carlos.rivera@university.edu", yearOfStudy: "2.1", meanScore: 79, schoolId: 3, schoolName: "School of Medicine", departmentId: 14, departmentName: "Nursing", departmentCode: "NUR/" },
  
  // Medicine - PHM
  { registrationNumber: "PHM/2024/001", name: "Dr. Lisa Chen", email: "lisa.chen@university.edu", yearOfStudy: "4.1", meanScore: 89, schoolId: 3, schoolName: "School of Medicine", departmentId: 15, departmentName: "Pharmacy", departmentCode: "PHM/" },
  { registrationNumber: "PHM/2024/002", name: "Robert Thompson", email: "robert.thompson@university.edu", yearOfStudy: "3.1", meanScore: 82, schoolId: 3, schoolName: "School of Medicine", departmentId: 15, departmentName: "Pharmacy", departmentCode: "PHM/" },
  
  // Law - LAW
  { registrationNumber: "LAW/2024/001", name: "Victoria Stone", email: "victoria.stone@university.edu", yearOfStudy: "3.1", meanScore: 87, schoolId: 4, schoolName: "School of Law", departmentId: 16, departmentName: "Law", departmentCode: "LAW/" },
  { registrationNumber: "LAW/2024/002", name: "Benjamin Foster", email: "benjamin.foster@university.edu", yearOfStudy: "2.1", meanScore: 84, schoolId: 4, schoolName: "School of Law", departmentId: 16, departmentName: "Law", departmentCode: "LAW/" },
  
  // Law - ILW
  { registrationNumber: "ILW/2024/001", name: "Amara Okafor", email: "amara.okafor@university.edu", yearOfStudy: "4.1", meanScore: 90, schoolId: 4, schoolName: "School of Law", departmentId: 17, departmentName: "International Law", departmentCode: "ILW/" },
  { registrationNumber: "ILW/2024/002", name: "Hassan Ali", email: "hassan.ali@university.edu", yearOfStudy: "1.1", meanScore: 76, schoolId: 4, schoolName: "School of Law", departmentId: 17, departmentName: "International Law", departmentCode: "ILW/" },
  
  // Education - PED
  { registrationNumber: "PED/2024/001", name: "Mary Johnson", email: "mary.johnson@university.edu", yearOfStudy: "3.1", meanScore: 81, schoolId: 5, schoolName: "School of Education", departmentId: 18, departmentName: "Primary Education", departmentCode: "PED/" },
  { registrationNumber: "PED/2024/002", name: "Thomas Wilson", email: "thomas.wilson@university.edu", yearOfStudy: "2.1", meanScore: 73, schoolId: 5, schoolName: "School of Education", departmentId: 18, departmentName: "Primary Education", departmentCode: "PED/" },
  
  // Education - SED
  { registrationNumber: "SED/2024/001", name: "Linda Davis", email: "linda.davis@university.edu", yearOfStudy: "4.1", meanScore: 85, schoolId: 5, schoolName: "School of Education", departmentId: 19, departmentName: "Secondary Education", departmentCode: "SED/" },
  { registrationNumber: "SED/2024/002", name: "Jason Martinez", email: "jason.martinez@university.edu", yearOfStudy: "1.1", meanScore: 68, schoolId: 5, schoolName: "School of Education", departmentId: 19, departmentName: "Secondary Education", departmentCode: "SED/" },
  
  // Education - SPE
  { registrationNumber: "SPE/2024/001", name: "Angela White", email: "angela.white@university.edu", yearOfStudy: "3.1", meanScore: 88, schoolId: 5, schoolName: "School of Education", departmentId: 20, departmentName: "Special Education", departmentCode: "SPE/" },
  { registrationNumber: "SPE/2024/002", name: "Kevin Brown", email: "kevin.brown@university.edu", yearOfStudy: "2.1", meanScore: 77, schoolId: 5, schoolName: "School of Education", departmentId: 20, departmentName: "Special Education", departmentCode: "SPE/" }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    await Student.deleteMany({});
    await School.deleteMany({});
    await Department.deleteMany({});

    await School.insertMany(schools);
    console.log('Schools seeded');

    await Department.insertMany(departments);
    console.log('Departments seeded');

    await Student.insertMany(students);
    console.log('Students seeded');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
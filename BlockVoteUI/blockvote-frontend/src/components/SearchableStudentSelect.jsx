import React, { useState, useEffect, useRef } from 'react';

export const SearchableStudentSelect = ({ 
  students, 
  value, 
  onChange, 
  placeholder, 
  excludeIds = [],
  required = false,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const dropdownRef = useRef(null);

  // Filter available students
  const availableStudents = students.filter(student => 
    !excludeIds.includes(student._id)
  );

  // Filter students based on search term
  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update selected student when value changes
  useEffect(() => {
    if (value) {
      const student = students.find(s => s._id === value);
      setSelectedStudent(student);
      setSearchTerm(student ? `${student.name} (${student.registrationNumber})` : '');
    } else {
      setSelectedStudent(null);
      setSearchTerm('');
    }
  }, [value, students]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset search term to selected student if any
        if (selectedStudent) {
          setSearchTerm(`${selectedStudent.name} (${selectedStudent.registrationNumber})`);
        } else {
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedStudent]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.name} (${student.registrationNumber})`);
    setIsOpen(false);
    onChange(student._id);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(''); // Clear for easier searching
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full px-3 sm:px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
        required={required}
        disabled={disabled}
      />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="px-3 sm:px-4 py-3 text-gray-500 text-xs sm:text-sm">
              {searchTerm ? 'No students found' : 'No available students'}
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                onClick={() => handleStudentSelect(student)}
                className="px-3 sm:px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900 text-sm sm:text-base break-words">{student.name}</div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {student.registrationNumber} • Score: {student.meanScore}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { databases } from '../appwrite/config';
import { Query } from 'appwrite';
import conf from '../conf/conf';
import generateSchedule from '../utils/scheduler'; 
import ClassLogForm from './ClassLogForm';

export default function ScheduleView({ refreshKey, userId }) {
  const [schedule, setSchedule] = useState({});
  const [students, setStudents] = useState([]);
  const [classLogs, setClassLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, availabilityRes, logsRes] = await Promise.all([
          databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteStudentCollectionId,
            [Query.equal('tutorId', userId)]
          ),
          databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteAvailabilityCollectionId,
            [Query.equal('tutorId', userId)] 
          ),
          databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteLogsCollectionId
          )
        ]);

        const studentsData = studentsRes.documents.map(student => {
          let unavailableDays = [];
          
        
          if (student.blockedDays) {
            if (typeof student.blockedDays === 'string') {
              try {
                unavailableDays = JSON.parse(student.blockedDays);
              } catch {
                console.warn(`Failed to parse blockedDays for student ${student.name}:`, student.blockedDays);
                unavailableDays = [];
              }
            } else if (Array.isArray(student.blockedDays)) {
              unavailableDays = student.blockedDays;
            }
          }

          return {
            ...student,
            name: student.name,
            clsPerWeek: student.daysPerWeek || 0, // Map daysPerWeek to clsPerWeek for scheduler
            unavailableDays: unavailableDays
          };
        });

        setStudents(studentsData);
        setClassLogs(logsRes.documents);

        const availabilityDoc = availabilityRes.documents[0];
        if (!availabilityDoc) {
          console.warn("No availability document found - please set your tutor availability");
          return;
        }

        const availabilityData = {};
        
      
        let workingDays = availabilityDoc.workingDays;
        if (typeof workingDays === 'string') {
          try {
            workingDays = JSON.parse(workingDays);
          } catch {
            console.error("Failed to parse workingDays as JSON, trying alternative parsing");
            
            workingDays = workingDays.replace(/[["]]/g, '').split(',');
          }
        }

       
        let maxStudents = availabilityDoc.maxStudents;
        if (typeof maxStudents === 'string') {
          try {
            maxStudents = JSON.parse(maxStudents);
          } catch {
            console.error("Failed to parse maxStudents as JSON");
            maxStudents = {};
          }
        }

        
        if (Array.isArray(workingDays)) {
          workingDays.forEach(day => {
            availabilityData[day] = maxStudents[day] || 1;
          });
        } else {
          console.error("workingDays is not an array:", workingDays);
        }

        const generatedSchedule = generateSchedule(studentsData, availabilityData);
        setSchedule(generatedSchedule);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, [refreshKey, userId]);

  // Get progress for a student
  const getStudentProgress = (studentId) => {
    const student = students.find(s => s.$id === studentId);
    if (!student) return { completed: 0, total: 0 };
    
    const completed = classLogs.filter(
      log => log.studentId === studentId && log.status === 'completed'
    ).length;
    
    return {
      completed,
      total: student.daysPerWeek, 
      percentage: Math.round((completed / student.daysPerWeek) * 100) || 0
    };
  };

  
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
        📅 Weekly Class Schedule
      </h2>

      {/* Show debug info */}
      {Object.keys(schedule).every(day => schedule[day]?.length === 0) && students.length > 0 && (
        <div className="alert alert-warning mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.124 4.493c-.77-.833-2.186-.833-2.956 0L2.632 15.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <span>Students added but no classes scheduled. Please check:</span>
          <ul className="list-disc list-inside">
            <li>Have you set your tutor availability above?</li>
            <li>Do students' unavailable days conflict with your working days?</li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dayOrder.map((day) => (
          <div
            key={day}
            className="bg-white shadow-md rounded-xl p-4 border border-base-200 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold text-secondary mb-2">{day}</h3>
            <ul className="space-y-3">
              {schedule[day]?.length > 0 ? (
                schedule[day].map((studentName, idx) => {
                  const student = students.find(s => s.name === studentName);
                  if (!student) return null;
                  
                  const progress = getStudentProgress(student.$id);
                  
                  return (
                    <li
                      key={idx}
                      className="bg-base-100 rounded-md p-3 border border-base-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{studentName}</span>
                        <span className="badge badge-neutral badge-sm">
                          {progress.completed}/{progress.total}
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full h-2 mb-2"
                        value={progress.completed}
                        max={progress.total}
                      ></progress>
                      <ClassLogForm 
                        studentId={student.$id}
                        studentName={studentName}
                        onSuccess={() => window.location.reload()} // Simple refresh
                      />
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-gray-400 italic py-2">No classes scheduled</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
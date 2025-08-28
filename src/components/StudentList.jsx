import { useEffect, useState } from "react";
import conf from "../conf/conf";
import { databases } from "../appwrite/config";
import { Query } from "appwrite";

export default function StudentList({ userId, refreshKey }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteStudentCollectionId,
          [
            Query.equal('tutorId', userId) 
          ]
        );
        setStudents(res.documents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [refreshKey, userId]);

  const handleDelete = async (studentId) => {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteStudentCollectionId,
        studentId
      );
      setStudents(students.filter(student => student.$id !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-6 text-primary">Your Students</h2>
      {students.length === 0 ? (
        <p className="text-gray-500">No students added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.$id} className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition relative">
              <button 
                onClick={() => handleDelete(student.$id)}
                className="absolute top-2 right-2 btn btn-circle btn-ghost btn-sm text-error"
                aria-label="Delete student"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{student.name}</h3>
              <p className="text-gray-600 mb-1">Classes/Week: <strong>{student.daysPerWeek}</strong></p>
              <p className="text-gray-600 mb-1">Unavailable Days:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {(() => {
                  try {
                    const blockedDays = student.blockedDays ? JSON.parse(student.blockedDays) : [];
                    return blockedDays.length > 0 ? (
                      blockedDays.map((day, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full border border-red-300   "
                        >
                          {day}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">None</span>
                    );
                  } catch (error) {
                    console.error("Error parsing blocked days:", error);
                    return <span className="text-sm text-red-500 italic">Invalid data</span>;
                  }
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
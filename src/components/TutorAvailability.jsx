import { useState } from "react";
import conf from "../conf/conf";
import { databases } from "../appwrite/config";
import { ID, Query } from "appwrite";

export default function TutorAvailability({ onSuccess, userId }) {
  const [workingDays, setWorkingDays] = useState([]);
  const [maxStudents, setMaxStudents] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  const handleDayToggle = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
      const { [day]: _, ...rest } = maxStudents;
      setMaxStudents(rest);
    } else {
      setWorkingDays([...workingDays, day]);
      setMaxStudents({ ...maxStudents, [day]: 1 });
    }
  };

  const handleMaxStudentsChange = (day, value) => {
    setMaxStudents({ ...maxStudents, [day]: Math.max(1, Number(value)) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (workingDays.length === 0) {
      alert("Please select at least one working day");
      return;
    }

    setIsSubmitting(true);
    try {
      const existing = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteAvailabilityCollectionId,
        [
          Query.equal('tutorId', userId) 
        ]
      );

      if (existing.documents.length > 0) {
        await databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteAvailabilityCollectionId,
          existing.documents[0].$id
        );
      }

      await databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteAvailabilityCollectionId,
        ID.unique(),
        {
          workingDays: JSON.stringify(workingDays),
          maxStudents: JSON.stringify(maxStudents),
          tutorId: userId 
        }
      );

      alert("Availability saved successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Failed to save availability. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md p-6 mt-8 w-full">
      <h2 className="text-3xl font-bold mb-6 text-primary">🔧 Set Your Availability</h2>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Select your working days and max students per day to generate the schedule</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {days.map((day) => (
            <div key={day} className="flex items-start sm:items-center gap-3 p-2 border rounded-lg hover:shadow transition">
              <input
                type="checkbox"
                id={day}
                checked={workingDays.includes(day)}
                onChange={() => handleDayToggle(day)}
                className="checkbox checkbox-primary mt-1 sm:mt-0"
              />
              <div className="flex-1">
                <label htmlFor={day} className="text-lg font-medium">{day}</label>
                {workingDays.includes(day) && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm">Max:</span>
                    <input
                      type="number"
                      min="1"
                      value={maxStudents[day] || 1}
                      onChange={(e) => handleMaxStudentsChange(day, e.target.value)}
                      className="input input-bordered input-sm w-20"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting || workingDays.length === 0}
          >
            {isSubmitting ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      </form>
    </div>
  );
}

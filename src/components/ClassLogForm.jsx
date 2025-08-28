import { useState } from 'react';
import { databases, ID } from '../appwrite/config';
import conf from '../conf/conf';

export default function ClassLogForm({ studentId, studentName, date = new Date().toISOString().split('T')[0], onSuccess }) {
  const [status, setStatus] = useState('completed');
  const [isSubmitting, setIsSubmitting] = useState(false);


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required data
      if (!studentId || !date || !status) {
        throw new Error('Missing required fields');
      }

      const logData = { 
        studentId: String(studentId), 
        date: String(date),
        status: String(status)
      };

      console.log('Creating log with data:', logData);

      const result = await databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLogsCollectionId,
        ID.unique(),
        logData
      );

      console.log('Log created successfully:', result);
      alert('Class log saved successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving log:', error);
      
      // More specific error messages
      if (error.code === 400) {
        alert('Invalid data format. Please check the log collection attributes in Appwrite.');
      } else if (error.code === 401) {
        alert('Authentication error. Please refresh the page and try again.');
      } else if (error.code === 404) {
        alert('Collection not found. Please check your Appwrite configuration.');
      } else {
        alert(`Failed to save log: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-base-100 p-3 rounded-lg border border-base-300 mt-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{studentName}</h4>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
        <div className="flex-1 w-full">
          <label className="label label-text pb-0 pl-1">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered select-sm w-full"
            disabled={isSubmitting}
          >
            <option value="completed">✅ Completed</option>
            <option value="missed">❌ Missed</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-sm btn-primary mt-2 sm:mt-0 ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}


import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import AddStudent from './components/AddStudent';
import StudentList from './components/StudentList';
import TutorAvailability from './components/TutorAvailability';
import ScheduleView from "./components/ScheduleView";
import Auth from './components/Auth';
import { databases, account } from './appwrite/config';
import { Query } from 'appwrite';
import conf from './conf/conf';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasAvailability, setHasAvailability] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if tutor has set availability
  const checkAvailability = useCallback(async () => {
    if (!user) return;
    
    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteAvailabilityCollectionId,
        [
          Query.equal('tutorId', user.$id) 
        ]
      );
      setHasAvailability(res.documents.length > 0);
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setHasAvailability(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      checkAvailability();
    }
  }, [refreshKey, user, checkAvailability]);

  const refreshAll = () => setRefreshKey(prev => prev + 1);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Auth onLogin={checkAuth} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
      {/* Header with logout */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-center text-primary">
          TutorTrack
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
          <button 
            onClick={handleLogout}
            className="btn btn-sm btn-outline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Step 1: Tutor sets availability */}
      <TutorAvailability onSuccess={refreshAll} userId={user.$id} />

      {/* Step 2: Show student and schedule section only after availability is set */}
      {hasAvailability ? (
        <>
          <AddStudent onSuccess={refreshAll} userId={user.$id} />
          <StudentList refreshKey={refreshKey} userId={user.$id} />
          <ScheduleView refreshKey={refreshKey} userId={user.$id} />
        </>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <p className="text-lg">Please set your availability to proceed.</p>
        </div>
      )}
    </div>
  );
}

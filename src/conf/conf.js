const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteStudentCollectionId: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_STUDENT_ID
  ),
  appwriteAvailabilityCollectionId: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_AVAILABILITY_ID
  ),
  appwriteLogsCollectionId: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_LOGS_ID
  ),
};

export default conf;

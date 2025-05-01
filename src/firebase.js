// ... existing code ...
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with error handling
try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  const getPaginatedData = async (collectionName, limit = 10, lastDoc = null) => {
    try {
      let query = query(
        collection(db, collectionName),
        orderBy('createdAt'),
        limit(limit)
      );
      
      if (lastDoc) {
        query = query(query, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(query);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { data, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
    } catch (error) {
      console.error('Error getting paginated data:', error);
      throw error;
    }
  };
  
  module.exports = { auth, db, getPaginatedData };
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}
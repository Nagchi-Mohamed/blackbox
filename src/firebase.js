import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
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
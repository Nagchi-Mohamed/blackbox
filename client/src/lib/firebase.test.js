import { auth, db, storage } from './firebase';

describe('Firebase Configuration', () => {
  test('auth service is initialized', () => {
    expect(auth).toBeDefined();
    expect(auth.app).toBeDefined();
  });

  test('firestore service is initialized', () => {
    expect(db).toBeDefined();
    expect(db.app).toBeDefined();
  });

  test('storage service is initialized', () => {
    expect(storage).toBeDefined();
    expect(storage.app).toBeDefined();
  });

  test('all services share the same app instance', () => {
    expect(auth.app).toBe(db.app);
    expect(db.app).toBe(storage.app);
  });

  test('environment variables are properly configured', () => {
    const config = auth.app.options;
    expect(config.apiKey).toBeDefined();
    expect(config.authDomain).toBeDefined();
    expect(config.projectId).toBeDefined();
    expect(config.storageBucket).toBeDefined();
    expect(config.messagingSenderId).toBeDefined();
    expect(config.appId).toBeDefined();
  });
}); 
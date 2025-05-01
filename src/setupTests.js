import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Mock Firebase initialization
jest.mock('firebase/app');
jest.mock('firebase/firestore');

configure({ testIdAttribute: 'data-test-id' });

// Global test setup
beforeEach(() => {
  initializeApp.mockClear();
  getFirestore.mockClear();
});
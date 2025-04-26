const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const CLASSROOM_ID = 2; // From our test data

async function checkServer() {
  try {
    const response = await axios.get('http://localhost:3000/api/health');
    if (response.data.status === 'ok') {
      console.log('✅ Server is running');
      return true;
    }
    console.error('❌ Server health check failed:', response.data);
    return false;
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    return false;
  }
}

async function login() {
  try {
    console.log('Attempting login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'teacher1@test.com',
      password: 'password123'
    });
    console.log('Login successful');
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

async function testSearch() {
  // First check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ Cannot proceed with tests - server is not running');
    return;
  }

  try {
    // Login to get token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    
    // Test cases
    const testCases = [
      {
        name: 'Search by exact username',
        query: { username: 'testuser' }
      },
      {
        name: 'Search by partial username',
        query: { username: 'test' }
      },
      {
        name: 'Search by date range',
        query: { 
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }
      },
      {
        name: 'Empty search',
        query: {}
      },
      {
        name: 'No results expected',
        query: { username: 'nonexistentuser123' }
      }
    ];

    for (const test of testCases) {
      console.log(`\nRunning test: ${test.name}`);
      try {
        const response = await axios.get('http://localhost:3000/api/users/search', {
          params: test.query,
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Test passed');
        console.log('Results:', response.data);
      } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
          console.error('Response:', error.response.data);
        }
      }
    }
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testSearch()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 
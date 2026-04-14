const fetch = require('node-fetch'); // Or native fetch in Node 18+

const BASE_URL = 'http://localhost:3000/api/auth';
const TEST_USER = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123'
};

async function runTests() {
  console.log('Starting Authentication API Verification...');

  // 1. Test Registration
  console.log('\n--- 1. Testing Registration ---');
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });
    const data = await res.json();
    
    if (res.status === 201 && data.token) {
      console.log('✅ Registration Successful');
      console.log('Token received:', data.token.substring(0, 20) + '...');
    } else {
      console.error('❌ Registration Failed:', res.status, data);
      process.exit(1);
    }

    // Store token for protected route test
    const token = data.token;

     // 2. Test Login
    console.log('\n--- 2. Testing Login ---');
    const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: TEST_USER.email,
            password: TEST_USER.password
        })
    });
    const loginData = await loginRes.json();

    if (loginRes.status === 200 && loginData.token) {
        console.log('✅ Login Successful');
    } else {
        console.error('❌ Login Failed:', loginRes.status, loginData);
    }

    // 3. Test Invalid Login
    console.log('\n--- 3. Testing Invalid Login ---');
    const invalidLoginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: TEST_USER.email,
            password: 'wrongpassword'
        })
    });
    
    if (invalidLoginRes.status === 401) {
        console.log('✅ Invalid Login Handled Correctly (401)');
    } else {
        console.error('❌ Invalid Login Test Failed:', invalidLoginRes.status);
    }

    // 4. Test Protected Route
    console.log('\n--- 4. Testing Protected Route ---');
    const protectedRes = await fetch(`${BASE_URL}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (protectedRes.status === 200) {
        console.log('✅ Protected Route Accessed Successfully');
    } else {
        console.error('❌ Protected Route Failed:', protectedRes.status);
    }

  } catch (err) {
    console.error('❌ Test Script Error:', err);
  }
}

// Check if fetch is available (Node 18+) or needs polyfill
if (!globalThis.fetch) {
    console.log("Installing node-fetch for testing...");
    // Just a warning, assuming environment has fetch or user will run it where fetch exists
}

runTests();

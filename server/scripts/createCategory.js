// createCategory.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Enable axios request/response logging
axios.interceptors.request.use(request => {
  console.log('Request:', request.method, request.url);
  console.log('Headers:', request.headers);
  console.log('Data:', request.data);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response.status);
  console.log('Data:', response.data);
  return response;
}, error => {
  console.error('Response error:', {
    status: error.response?.status,
    data: error.response?.data,
    headers: error.response?.headers
  });
  return Promise.reject(error);
});

async function main() {
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'moniahcode1@gmail.com',
      password: 'MoniahCode'
    });
    
    // Generate a token using the same secret as the server
    const user = loginResponse.data.user;
    const token = jwt.sign(
      { id: user.id },
      'your_jwt_secret_here', // This matches the default in config.js
      { expiresIn: '7d' }
    );
    console.log('Generated fresh token:', token);

    // Create category
    const categoryResponse = await axios.post(
      'http://localhost:5000/api/v1/categories',
      {
        name: 'Cybersecurity & Awareness',
        description: 'Articles about digital security, online safety, and cybersecurity awareness'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Category created:', categoryResponse.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
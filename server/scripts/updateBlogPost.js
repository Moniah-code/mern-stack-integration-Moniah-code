const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

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
    
    const token = loginResponse.data.token;
    console.log('Login successful');

    // Create sample image
    const sampleImagePath = path.join(__dirname, 'cybersecurity.txt');
    fs.writeFileSync(sampleImagePath, 'This is a placeholder for an actual image file.');

    // Update blog post with image
    const formData = new FormData();
    formData.append('title', "Why Cybersecurity Awareness is Critical in Today's Digital World - Updated");
    formData.append('content', `
<h1>Why Cybersecurity Awareness is Critical in Today's Digital World</h1>

<img src="/uploads/cybersecurity-header.jpg" alt="Cybersecurity Concept" class="featured-image" />

<p>In an era where digital transformation is rapidly reshaping our world, cybersecurity awareness has become more crucial than ever. As we increasingly rely on digital technologies for both personal and professional activities, the importance of understanding and implementing proper security measures cannot be overstated.</p>

<h2>The Growing Threat Landscape</h2>

<p>Cyber threats are evolving at an unprecedented pace, with attackers constantly developing new methods to exploit vulnerabilities in our digital systems. From sophisticated phishing schemes to ransomware attacks, the threats we face today are more complex and dangerous than ever before.</p>

<h2>Key Areas of Focus</h2>

<ul>
  <li><strong>Password Security:</strong> Creating and maintaining strong, unique passwords for all accounts</li>
  <li><strong>Data Protection:</strong> Understanding how to properly handle and protect sensitive information</li>
  <li><strong>Social Engineering Awareness:</strong> Recognizing and avoiding manipulation tactics used by cybercriminals</li>
  <li><strong>Safe Browsing Habits:</strong> Knowing how to identify and avoid potentially dangerous websites and downloads</li>
</ul>

<h2>Best Practices for Individual Security</h2>

<ol>
  <li>Use multi-factor authentication whenever possible</li>
  <li>Keep software and systems updated regularly</li>
  <li>Back up important data frequently</li>
  <li>Be cautious with email attachments and links</li>
  <li>Use encrypted connections for sensitive transactions</li>
</ol>

<p>Remember: Cybersecurity is not just an IT issue - it's everyone's responsibility. By staying informed and implementing proper security measures, we can all contribute to a safer digital world.</p>

<h2>Taking Action</h2>

<p>Start your cybersecurity journey today by:</p>

<ul>
  <li>Reviewing and updating your security settings</li>
  <li>Learning about current cyber threats</li>
  <li>Sharing security awareness with others</li>
  <li>Implementing security best practices in your daily routine</li>
</ul>

<p>Together, we can create a more secure digital future for everyone.</p>

<p><em>Last updated: October 30, 2025</em></p>`);
    
    formData.append('featuredImage', fs.createReadStream(sampleImagePath), {
      filename: 'cybersecurity-header.jpg',
      contentType: 'image/jpeg'
    });
    
    formData.append('category', '6903112f637fb35af63706b1');
    formData.append('tags', JSON.stringify(['cybersecurity', 'digital safety', 'security awareness', 'best practices', 'updated']));
    formData.append('isPublished', 'true');

    const postResponse = await axios.put(
      'http://localhost:5000/api/v1/posts/69031250c45f08547ffe29a6',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Blog post updated:', postResponse.data);

    // Clean up the temporary file
    fs.unlinkSync(sampleImagePath);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
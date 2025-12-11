// Quick test to verify Cloudinary credentials
const { v2: cloudinary } = require('cloudinary');

// Manually set credentials from .env.local (CORRECTED - removed 'y' from cloud name)
const CLOUD_NAME = 'dq7t0dqsd';
const API_KEY = '765144248347856';
const API_SECRET = 'kqmMsAREL0dhYpACLUVLk5m2100';

console.log('Testing Cloudinary configuration...');
console.log('Cloud Name:', CLOUD_NAME);
console.log('API Key:', API_KEY ? '***exists***' : 'MISSING');
console.log('API Secret:', API_SECRET ? '***exists***' : 'MISSING');

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

// Test the connection by fetching account info
cloudinary.api.ping()
  .then((result) => {
    console.log('\n✓ Cloudinary connection successful!');
    console.log('Response:', result);
  })
  .catch((error) => {
    console.log('\n✗ Cloudinary connection failed!');
    console.log('Error:', error);
    console.log('\nPlease verify your credentials at: https://console.cloudinary.com/');
    console.log('Make sure:');
    console.log('1. Cloud name is correct');
    console.log('2. API Key is correct');
    console.log('3. API Secret is correct');
  });

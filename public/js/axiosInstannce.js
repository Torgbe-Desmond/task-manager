// axiosInstance.js
const axios = require('axios'); // Use `require` in Node.js environment

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('taskToken'))}`
  }
});

console.log('token',JSON.parse(localStorage.getItem('taskToken')) )

module.exports = axiosInstance; 



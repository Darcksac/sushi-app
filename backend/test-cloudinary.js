require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.api.ping()
  .then(res => console.log('Ping success', res))
  .catch(err => console.error('Ping error', err));

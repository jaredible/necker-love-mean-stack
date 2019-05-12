const express = require('express');

const UserController = require('../controllers/user');

const auth = require('../middleware/auth');
const image = require('../middleware/image');

const router = express.Router();

router.post('/register', UserController.register);

router.get('/validateEmail/:email', UserController.validateEmail);

router.post('/login', UserController.login);

router.get('/search', UserController.getProfiles);

router.get('/user/:id', auth, UserController.getProfile);

router.put('/profile/:id', auth, image, UserController.updateProfile);

module.exports = router;

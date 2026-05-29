const express = require('express');
const { registerUser, verifyOtp, loginUser, getMe } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware'); // 👈 Import middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verifyOtp);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getMe); 

module.exports = router;
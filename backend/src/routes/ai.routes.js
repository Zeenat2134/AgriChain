const express = require('express');
const { getCropAdvice } = require('../controllers/ai.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken); 

router.post('/ask', getCropAdvice);

module.exports = router;
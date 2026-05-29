const express = require('express');
const { addMarketPrice, getAllPrices } = require('../controllers/market.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/prices', getAllPrices);

router.post('/add', authenticateToken, addMarketPrice);

module.exports = router;
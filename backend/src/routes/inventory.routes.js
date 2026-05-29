const express = require('express');
const {
  addInventoryItem,
  getMyInventory,
  updateInventoryItem,
  deleteInventoryItem
} = require('../controllers/inventory.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();


router.use(authenticateToken);

router.post('/add', addInventoryItem);          
router.get('/my-items', getMyInventory);        
router.put('/update/:id', updateInventoryItem); 
router.delete('/delete/:id', deleteInventoryItem); 

module.exports = router;
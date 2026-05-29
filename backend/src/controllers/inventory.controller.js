const InventoryItem = require('../models/InventoryItem');

const addInventoryItem = async (req, res) => {
  try {
    const { cropName, quantity, pricePerKg } = req.body;
    const farmerId = req.user.id; 

    const existingItem = await InventoryItem.findOne({ farmerId, cropName });

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
      existingItem.pricePerKg = parseFloat(pricePerKg); 
      await existingItem.save();
      
      return res.status(200).json({ message: "Stock updated successfully!", item: existingItem });
    }

    const newItem = await InventoryItem.create({
      cropName,
      quantity: parseInt(quantity),
      pricePerKg: parseFloat(pricePerKg),
      farmerId
    });

    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
};

const getMyInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find({ farmerId: req.user.id });
    
    const formattedItems = items.map(item => ({
      id: item._id,
      cropName: item.cropName,
      quantity: item.quantity,
      pricePerKg: item.pricePerKg
    }));

    res.status(200).json(formattedItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json({ message: "Item updated", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};

module.exports = { addInventoryItem, getMyInventory, updateInventoryItem, deleteInventoryItem };
const MarketPrice = require('../models/MarketPrice');
const cron = require('node-cron');

cron.schedule('*/10 * * * * *', async () => {
  try {
    const crops = await MarketPrice.find();

    if (crops.length > 5) {
      await MarketPrice.deleteMany({});
      return;
    }

    if (crops.length === 0) {
      const baseCrops = [
        { cropName: "Red Tomatoes 🍅", mandiLocation: "Nashik Wholesale", price: 45 },
        { cropName: "Premium Wheat 🌾", mandiLocation: "Punjab Mandi", price: 32 },
        { cropName: "Basmati Rice 🍚", mandiLocation: "Karnal Mandi", price: 85 },
        { cropName: "Onions 🧅", mandiLocation: "Lasalgaon", price: 25 },
        { cropName: "Potatoes 🥔", mandiLocation: "Agra Mandi", price: 18 }
      ];
      await MarketPrice.insertMany(baseCrops);
      return;
    }

    for (let crop of crops) {
      const fluctuation = (Math.random() * 0.1) - 0.05;
      let newPrice = crop.price + (crop.price * fluctuation);
      
      newPrice = parseFloat(newPrice.toFixed(2));

      await MarketPrice.findByIdAndUpdate(crop._id, { 
        price: newPrice,
        dateUpdated: Date.now() 
      });
    }
  } catch (error) {
    console.error(error);
  }
});

const addMarketPrice = async (req, res) => {
  try {
    const { cropName, mandiLocation, price } = req.body;
    const newPrice = await MarketPrice.create({
      cropName,
      mandiLocation,
      price: parseFloat(price)
    });
    res.status(201).json({ message: "Market price updated successfully", data: newPrice });
  } catch (error) {
    res.status(500).json({ error: "Failed to add market price" });
  }
};

const getAllPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.find().sort({ cropName: 1 });
    res.status(200).json(prices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch market prices" });
  }
};

module.exports = { addMarketPrice, getAllPrices };
const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  mandiLocation: { type: String, required: true },
  price: { type: Number, required: true },
  dateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
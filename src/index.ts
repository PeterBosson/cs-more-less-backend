import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());

const CSFLOAT_API = 'https://csfloat.com/api/v1/listings';

app.get('/api/game-pair', async (req, res) => {
  try {
    
    const priceTiers = [
      { min: 500, max: 2000 },    // $5 - $20
      { min: 2000, max: 10000 },  // $20 - $100
      { min: 10000, max: 100000 }, // $100 - $1000
      { min: 100000, max: 10000000 } // $1000 - $100000
    ];
    const tier = priceTiers[Math.floor(Math.random() * priceTiers.length)]!;

    const response = await axios.get(CSFLOAT_API, {
      headers: { 'Authorization': process.env.CSFLOAT_API_KEY! },
      params: { limit: 50, sort_by: 'best_deal', type: 'buy_now', min_price: tier.min, max_price: tier.max }
    });
    const listings = response.data.data;
    console.log(`Fetched ${listings.length} listings from CSFloat in price range $${(tier.min/100).toFixed(2)} - $${(tier.max/100).toFixed(2)}`);
    
    do {
      var itemA = listings[Math.floor(Math.random() * listings.length)];
      var itemB = listings[Math.floor(Math.random() * listings.length)];
    } while (itemA.item.market_hash_name === itemB.item.market_hash_name);

    res.json({
      itemA: {
        name: itemA.item.market_hash_name,
        image: "https://community.akamai.steamstatic.com/economy/image/" + itemA.item.icon_url,
        price: itemA.price / 100 
      },
      itemB: {
        name: itemB.item.market_hash_name,
        image: "https://community.akamai.steamstatic.com/economy/image/" + itemB.item.icon_url,
        price: itemB.price / 100
      }
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch skins' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BFF running on http://localhost:${PORT}`));
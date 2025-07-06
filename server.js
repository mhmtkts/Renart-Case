require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { count } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const getProducts = () => {
    try{
        const data = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('JSON dosyası okunamadı:', error);
        return [];
    }
}

const getGoldPrice = async () => {
    try {
        const API_KEY = process.env.METALS_API_KEY;
        
        console.log('API_KEY var mı?', !!API_KEY);
        
        if (!API_KEY) {
            console.log('API key bulunamadı, fallback değer döndürülüyor');
            return 65;
        }
        
        const response = await fetch(`https://api.metals.dev/v1/metal/spot?api_key=${API_KEY}&metal=gold&currency=USD`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API yanıtı:', JSON.stringify(data, null, 2));
        
        let goldPrice;
        if (data.rate && data.rate.price) {
            goldPrice = data.rate.price;
        } else if (data.price) {
            goldPrice = data.price;
        } else {
            console.log('Fiyat bulunamadı, fallback değer kullanılıyor');
            return 65;
        }
        
        const pricePerGram = goldPrice / 31.1035;
        
        console.log('Altın fiyatı (ons):', goldPrice);
        console.log('Altın fiyatı (gram):', pricePerGram);
        
        return Math.round(pricePerGram * 100) / 100; // 2 ondalık basamak
        
    } catch (error) {
        console.error('Altın fiyatı alınamadı:', error.message);
        console.log('Fallback değer 65 döndürülüyor');
        return 65;
    }
}

const calculatePrice = (product, goldPrice) => {
    const price = (product.popularityScore +1) * (product.weight * goldPrice);
    return Math.round(price * 100) / 100;
}    

app.get('/api/products', async (req, res) => {
  try {
    const products = getProducts();
    const goldPrice = await getGoldPrice();
    
    const productsWithPrice = products.map(product => ({
      ...product,
      price: calculatePrice(product, goldPrice),
      goldPrice: goldPrice
    }));
    
    res.json({
      success: true,
      data: productsWithPrice,
      count: productsWithPrice.length,
      goldPrice: goldPrice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ürünler alınamadı'
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
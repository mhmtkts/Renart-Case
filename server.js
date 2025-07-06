require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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
        
        if (!API_KEY) {
            console.error('API key bulunamadı');
            return 65;
        }
        
        const response = await fetch(`https://api.metals.dev/v1/metal/spot?api_key=${API_KEY}&metal=gold&currency=USD`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.rate && data.rate.price) {
            const pricePerGram = data.rate.price / 31.1035;
            return Math.round(pricePerGram * 100) / 100;
        } else {
            console.error('API yanıtında fiyat bulunamadı');
            return 65;
        }
        
    } catch (error) {
        console.error('Altın fiyatı alınamadı:', error.message);
        return 65;
    }
}

const calculatePrice = (product, goldPrice) => {
    const price = (product.popularityScore + 1) * (product.weight * goldPrice);
    return Math.round(price * 100) / 100;
}

app.get('/api/products', async (req, res) => {
    try {
        const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
        
        const products = getProducts();
        
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Ürün bulunamadı'
            });
        }
        
        const goldPrice = await getGoldPrice();
        
        let productsWithPrice = products.map(product => ({
            ...product,
            price: calculatePrice(product, goldPrice)
        }));

        // Filtering logic
        if (minPrice) {
            productsWithPrice = productsWithPrice.filter(p => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            productsWithPrice = productsWithPrice.filter(p => p.price <= parseFloat(maxPrice));
        }
        if (minPopularity) {
            productsWithPrice = productsWithPrice.filter(p => p.popularityScore >= parseFloat(minPopularity));
        }
        if (maxPopularity) {
            productsWithPrice = productsWithPrice.filter(p => p.popularityScore <= parseFloat(maxPopularity));
        }
        
        res.json({
            success: true,
            data: productsWithPrice,
            count: productsWithPrice.length,
            goldPrice: goldPrice,
            ...(minPrice || maxPrice || minPopularity || maxPopularity ? {
                appliedFilters: { minPrice, maxPrice, minPopularity, maxPopularity }
            } : {})
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası oluştu'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
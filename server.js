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

app.get('/', (req, res) => {
    res.json({ message: 'API çalışıyor!' });
});

app.get('/api/products', (req, res) => {
    try {
        const products = getProducts();
        res.json({
            success: true,
            data: products,
            count: products.length
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ürünler alınamadı.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
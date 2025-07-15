const fs = require('fs');
const path = require('path');
const https = require('https');

const getProducts = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('JSON dosyası okunamadı:', error);
        return [];
    }
};

const getGoldPrice = async () => {
    try {
        const API_KEY = process.env.METALS_API_KEY;
        if (!API_KEY) return 107;

        // fetch yerine https ile istek
        return new Promise((resolve) => {
            https.get(`https://api.metals.dev/v1/metal/spot?api_key=${API_KEY}&metal=gold&currency=USD`, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.rate && parsed.rate.price) {
                            const pricePerGram = parsed.rate.price / 31.1035;
                            resolve(Math.round(pricePerGram * 100) / 100);
                        } else {
                            resolve(107);
                        }
                    } catch {
                        resolve(107);
                    }
                });
            }).on("error", () => resolve(107));
        });
    } catch {
        return 107;
    }
};

const calculatePrice = (product, goldPrice) => {
    const price = (product.popularityScore + 1) * (product.weight * goldPrice);
    return Math.round(price * 100) / 100;
};

module.exports = async (req, res) => {
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

        res.status(200).json({
            success: true,
            data: productsWithPrice,
            count: productsWithPrice.length,
            goldPrice: goldPrice,
            ...(minPrice || maxPrice || minPopularity || maxPopularity ? {
                appliedFilters: { minPrice, maxPrice, minPopularity, maxPopularity }
            } : {})
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası oluştu'
        });
    }
};
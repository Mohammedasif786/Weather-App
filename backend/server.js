import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({
    path: './src/.env'
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7001;

app.get('/search', async (req, res) => {
    const cityName = req.query.q || 'Gulbarga';
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json`;

    if (!cityName) {
        return res.status(400).json({
            error: 'City name is required'
        });
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "User-Agent": "User@gmail.com"
            }
        })
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log(`Error at: ${error}`);
    }

})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
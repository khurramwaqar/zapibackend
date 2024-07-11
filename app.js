const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const redisClient = require('./redis-server');


//Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
dotenv.config();



if (cluster.isMaster) {
    // Master process (parent)
    const numCPUs = require('os').cpus().length;

    console.log(`Master process ID: ${process.pid}`);

    // Fork worker processes for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died (exit code ${code}, signal ${signal})`);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    // Worker process (child)
    // ... (Your Express application code here)

    //Connect to DB
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_CONNECT)
        .catch((err) => console.log(err))
        .finally(() => console.log('Connected to DB along with pid: ' + process.pid));


    // ... (Your Express application code here)

    const port = process.env.PORT || 3001; // Use environment variable for port or default to 3000


    app.get('/api/v1/stats', async (req, res) => {

        mongoose.connect(process.env.DB_CONNECT)
            .catch((err) => console.log(err))
            .finally(() => console.log('Connected to DB along with PID = ' + process.pid));
        //Connect to DB
        try {
            const stats = await mongoose.connection.db.stats();
            res.json({ status: stats, pid: process.pid });
        } catch (err) {
            res.json({
                status: err
            });
        }


    });

    app.post('/api/pay/callback', async (req, res) => {

        try {

            res.json({ response: req });
        } catch (err) {
            res.json({
                error: err
            });
        }

    });

    app.get('/api/v1/dashboard', async (req, res) => {
        //Connect to DB
        try {
            const Series = require('./models/Series');
            const stats = await mongoose.connection.db.collection("series");
            var count = Series.find()
            res.json({
                status: count
            });
        } catch (err) {
            res.json({
                status: err.message
            });
        }


    });
    //Import Routes
    const appsRoute = require('./routes/Apps');
    const genresRoute = require('./routes/Genres');
    const agerRatingsRoutes = require('./routes/AgeRatings');
    const categoriesRoute = require('./routes/Categories');
    const seriesRoute = require('./routes/Series');
    const userRoute = require('./routes/Users');
    const episodeRoute = require('./routes/Episodes');
    const YTEpisodeRoute = require('./routes/YTEpisode');
    const PaymentRoute = require('./routes/PaymentRoute');

    const mediaRoute = require('./routes/Media');
    const mediaLogoRoute = require('./routes/MediaLogo');
    const mediaPosterRoute = require('./routes/MediaPoster');
    const mediaMobileRoute = require('./routes/MediaMobile');
    const mediaDesktopRoute = require('./routes/MediaDesktop');
    const mediaSliderRoute = require('./routes/MediaSlider');
    const mediaVODUpload = require('./routes/VODUpload');
    const geoPolicyRoute = require('./routes/GeoPolicy');
    const GetCountry = require('./routes/GetCountry');
    const VodContent = require('./routes/VodContent');
    const AdsManagerRoutes = require('./routes/AdsManager');
    const { stat } = require('fs');

    //for episode media upload

    const episodeLogoRoute = require('./routes/EpisodeMediaLogo');
    const episodePosterRoute = require('./routes/EpisodeMediaPoster');
    const episodeMobileRoute = require('./routes/EpisodeMediaMobile');
    const episodeDesktopRoute = require('./routes/EpisodeMediaDesktop');

    // Private Routes   --------------------------------

    const userSubscriberRoutes = require('./routes/UserSubscribers');
    const packages = require('./routes/Packages');
    const billings = require('./routes/Billings');
    const subscription = require('./routes/Subscriptions');
    const HomeRoutes = require('./routes/Home');
    const sliders = require('./routes/Slider');
    const HomeV2Routes = require('./routes/HomeV2');
    const { options } = require('apicache');


    //Route Middlewares
    app.use('/api/vod', VodContent);
    app.use('/api/apps', appsRoute);
    app.use('/api/genres', genresRoute);
    app.use('/api/ageratings', agerRatingsRoutes);
    app.use('/api/categories', categoriesRoute);
    app.use('/api/series', seriesRoute);
    app.use('/api/users', userRoute);
    app.use('/api/episodes', episodeRoute);
    app.use('/api/geo', geoPolicyRoute);
    app.use('/api/yt', YTEpisodeRoute);
    app.use('/api/payment', PaymentRoute);
    app.use('/api/cf', GetCountry);
    app.use('/api/media', mediaRoute);
    app.use('/api/media', mediaPosterRoute);
    app.use('/api/media', mediaMobileRoute);
    app.use('/api/media', mediaDesktopRoute);
    app.use('/api/media', mediaSliderRoute);
    app.use('/api/media', mediaLogoRoute);
    app.use('/api/media', mediaVODUpload);
    app.use('/api/ads', AdsManagerRoutes);

    app.use('/api/subuser', userSubscriberRoutes);
    app.use('/api/packages', packages);
    app.use('/api/billings', billings);
    app.use('/api/subscriptions', subscription);
    app.use('/api/slider', sliders);

    app.use('/api/home', HomeRoutes);
    app.use('/api/homev2', HomeV2Routes)

    // define media routed for espisode media
    app.use('/api/emedia', episodeDesktopRoute);
    app.use('/api/emedia', episodePosterRoute);
    app.use('/api/emedia', episodeLogoRoute);
    app.use('/api/emedia', episodeLogoRoute);


    // Serve static files from the 'public' folder
    app.use('/public', express.static('public'))

    // Clear Redis Cache

    app.get('/flush-cache', async (req, res) => {

        const cache = redisClient.FLUSHALL;
        if (cache) {
            res.send("Cache Cleared");
        }
    });


    // Enable file uploads
    app.use(fileUpload());


    app.listen(port, () => {
        console.log(`Worker ${process.pid} listening on port ${port}`);
    });
}


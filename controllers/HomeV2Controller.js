const Home = require('../models/Home');
const axios = require('axios');
const redisClient = require('../redis-server');


//Get all genres

const getAllHome = async (req, res) => {
    try {
        const home = await Home.find();
        res.json({ home: home[1] });
    } catch (err) {
        res.json({ message: err });
    }
}

const getAllHomeV2 = async (req, res) => {
    try {
        const home = await Home.find();
        res.json(home);
    } catch (err) {
        res.json({ message: err });
    }
}






//Get a specific genre

const getSpecificHome = async (req, res) => {
    let newData = [];


    const cacheId = req.params.homeId + '/' + req.params.cn;
    let results;
    let isCached = false;

    try {
        const cacheResults = await redisClient.get(cacheId);
        if (cacheResults) {
            isCached = true;
            results = JSON.parse(cacheResults);
            results.home["isCached"] = true

            res.json(results);
        } else {

            if (req.params.cn) {
                const home = await Home.findById(req.params.homeId);
                //const size = home.homeData.count();
                const size = home.homeData.length
                //create a loop of home.homeData then fetch each data
                for (let i = 0; i < size; i++) {

                    const objectIds = home.homeData[i].data

                    if (home.homeData[i].type == "ImageSlider") {
                        const resp = await axios.get(`https://node.aryzap.com/api/slider/${home.homeData[i].data}`);
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: 'Slider',
                            type: 'ImageSlider',
                            items: datas.slider.sliderData.length,
                            data: datas,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                    if (home.homeData[i].type == "SingleSeries") {
                        const resp = await axios.get(`https://node.aryzap.com/api/yt/${home.homeData[i].data}`);;
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: home.homeData[i].name ? home.homeData[i].name : "Single Series /NA",
                            type: 'SingleSeries',
                            items: datas?.episode?.length,
                            data: datas,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                    if (home.homeData[i].type == "Category") {
                        const resp = await axios.get(`https://node.aryzap.com/api/series/byCatID/${home.homeData[i].data}/${req.params.cn}`);
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: home.homeData[i].name,
                            type: 'Category',
                            items: datas.series.length,
                            data: datas,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                    if (home.homeData[i].type == "PromotionalBanner") {
                        const resp = await axios.get(`https://node.aryzap.com/api/pb/${home.homeData[i].data}`);
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: 'Promotional Banner',
                            type: 'PromotionalBanner',
                            items: datas.promotionalBanner.length,
                            data: datas.promotionalBanner,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                }
                const finalData = {
                    home: {
                        _id: home._id,
                        homeTitle: home.homeTitle,
                        homeAppId: home.homeAppId,
                        homeData: newData,
                        isCached: isCached
                    }
                };

                await redisClient.set(cacheId, JSON.stringify(finalData));
                res.json(finalData);
            } else {

                const home = await Home.findById(req.params.homeId);
                //const size = home.homeData.count();
                const size = home.homeData.length
                //create a loop of home.homeData then fetch each data
                for (let i = 0; i < size; i++) {

                    const objectIds = home.homeData[i].data

                    if (home.homeData[i].type == "ImageSlider") {
                        const resp = await axios.get(`https://node.aryzap.com/api/slider/${home.homeData[i].data}`);
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: 'Slider',
                            type: 'ImageSlider',
                            items: datas.slider.sliderData.length,
                            data: datas,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                    if (home.homeData[i].type == "SingleSeries") {
                        const resp = await axios.get(`https://node.aryzap.com/api/yt/${home.homeData[i].data}`);
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: 'Single Series',
                            type: 'SingleSeries',
                            items: datas?.episode?.length,
                            data: datas,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                    if (home.homeData[i].type == "Category") {
                        const resp = await axios.get(`https://node.aryzap.com/api/series/byCatID/${home.homeData[i].data}/PK`);
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: home.homeData[i].name,
                            type: 'Category',
                            items: datas.series.length,
                            data: datas,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                    if (home.homeData[i].type == "PromotionalBanner") {
                        const resp = await axios.get(`https://node.aryzap.com/api/pb/${home.homeData[i].data}`);
                        const datas = resp.data;
                        newData.push({
                            id: 1,
                            name: 'Promotional Banner',
                            type: 'PromotionalBanner',
                            items: datas.promotionalBanner.length,
                            data: datas.promotionalBanner,
                            chosen: false,
                            selected: false,
                            ui: home.homeData[i].ui ? home.homeData[i].ui : null
                        })
                    }
                }
                const finalData = {
                    home: {
                        _id: home._id,
                        homeTitle: home.homeTitle,
                        homeAppId: home.homeAppId,
                        homeData: newData,
                        isCached: isCached
                    }
                };

                await redisClient.set(cacheId, JSON.stringify(finalData));
                res.json(finalData);

            }

        }


    } catch (err) {
        res.json({ message: err });
    }
};

//Create a new genre

const createHome = async (req, res) => {

    const home = new Home({
        homeTitle: req.body.homeTitle,
        homeAppId: req.body.homeAppId,
        homeData: req.body.homeData
    });

    try {
        const savedhome = await home.save();
        res.json(savedhome);
    } catch (err) {
        res.json({ message: err });
    }
};

//Update a genre

const updateHome = async (req, res) => {

    try {

        const updatedhome = await Home.updateOne(
            { _id: req.params.homeId },
            {
                $set: {
                    homeTitle: req.body.homeTitle,
                    homeAppId: req.body.homeAppId,
                    homeData: req.body.homeData
                },
            }
        );
        res.json(updatedhome);
    } catch (err) {
        res.json({ message: err });
    }
};

//Delete a genre

const deleteHome = async (req, res) => {
    try {
        const removedhome = await Home.remove({ _id: req.params.homeId });
        res.json(removedhome);
    } catch (err) {
        res.json({ message: err });
    }
};

module.exports = {
    getAllHome,
    getSpecificHome,
    createHome,
    updateHome,
    deleteHome,
    getAllHomeV2
};

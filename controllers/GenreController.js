const Genres = require('../models/Genres');

//Get all genres

const getAllGenres = async (req, res) => {
    try {
        const genre = await Genres.find();
        res.json(genre);
    } catch (err) {
        res.json({ message: err });
    }
}

//Get a specific genre

const getSpecificGenre = async (req, res) => {
    try {
        const genre = await Genres.findById(req.params.genreId);
        res.json(genre);
    } catch (err) {
        res.json({ message: err });
    }
};

//Create a new genre

const createGenre = async (req, res) => {

    const genre = new Genres({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        appId: req.body.appId
    });

    try {
        const savedGenre = await genre.save();
        res.json(savedGenre);
    } catch (err) {
        res.json({ message: err });
    }
};

//Update a genre

const updateGenre = async (req, res) => {

    try {

        const updatedGenre = await Genres.updateOne(
            { _id: req.params.genreId },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    image: req.body.image,
                    appId: req.body.appId,
                },
            }
        );
        res.json(updatedGenre);
    } catch (err) {
        res.json({ message: err });
    }
};

//Delete a genre

const deleteGenre = async (req, res) => {
    try {
        const removedGenre = await Genres.remove({ _id: req.params.genreId });
        res.json(removedGenre);
    } catch (err) {
        res.json({ message: err });
    }
};

module.exports = {
    getAllGenres,
    getSpecificGenre,
    createGenre,
    updateGenre,
    deleteGenre,
};

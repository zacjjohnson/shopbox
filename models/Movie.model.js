const { Schema, model } = require("mongoose");


const movieSchema = new Schema(
    {
        title: String,
        director: String,
        runtime: String,
        genre: String,
        price: String,
        inventory: String,
        rating: String,
        relatedBooks: {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }
    },
    {
        timestamps: true,
    }
);

const Movie = model('Movie', movieSchema);

module.exports = Movie;
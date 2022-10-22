const { Schema, model } = require("mongoose");


const bookSchema = new Schema(
    {
        title: String,
        author: String,
        pages: String,
        price: String,
        genre: String,
        inventory: Number,
        relatedMovie: {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
},
{
    timestamps: true
}
)

const Book = model('Book', bookSchema);
module.exports = Book;
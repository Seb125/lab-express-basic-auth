const { Schema, model } = require("mongoose");

const celebritiesSchema = new Schema(
    {
        name: {
            type: String
        },
        occupation: {
            type: String
        },
        catchPhrase: {
            type: String
        },
        movies: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
        }

    }
)

const Celebritiy = model("Celebrity", celebritiesSchema);

module.exports = Celebritiy;

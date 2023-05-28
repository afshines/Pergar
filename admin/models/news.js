const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema(
    {

        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        visited: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

var News = mongoose.model("News", newsSchema);
module.exports = { News, newsSchema };

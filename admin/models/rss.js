const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema(
    {

        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        enclosure: {
            type: String,
        },
        category: {
            type: String,
        },
        pubDate: {
            type: String,
        },
        visited: {
            type: Number,
            default: 0,
        },
    }
);

const rssSchema = new Schema(
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
        max_new_feeds: {
            type: Number,
            default: 10,
        },
        feeds: [
            {
                type: feedSchema,
            },
        ],
        last_seen: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

var Rss = mongoose.model("Rss", rssSchema);
module.exports = { Rss, rssSchema };

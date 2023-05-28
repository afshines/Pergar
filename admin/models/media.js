const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const briefNewsSchema = new Schema(
    {
        title: {
            type: String,
        },
        url: {
            type: String,
        },
        status: {
            type: Boolean,
        },
    },
    {
    }
);

const briefRssSchema = new Schema(
    {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rss"
        },
        title:{
            type: String,
        },
        limit: {
            type: Number,
            default: 3,
        }
    },
    {
    }
);


briefRssSchema.virtual('feeds',{
    ref: 'Rss',
    localField: '_id',
    foreignField: '_id'
 } );

 briefRssSchema.set('toObject', {virtuals: true});
 briefRssSchema.set('toJSON', {virtuals: true});



const locationSchema = new Schema(
    {
        title: {
            type: String,
        },
        location: {
            type: String,
        },
        news: [
            {
                ref: "News",
                type: briefNewsSchema,
            },
        ],
        rss: [
            {
                ref: "Rss",
                type: briefRssSchema,
            },
        ],

    },
    {
    }
);

const mediaSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
        },
        locations: [locationSchema],
        status: {
            type: Boolean,
            default: true,
        },
    },
    {}
);



var Media = mongoose.model("Media", mediaSchema);
module.exports = { Media, mediaSchema };

const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const MarketSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now

    },
    markets: [{
        country: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        companies: [{
            name: {
                type: String,
                required: true
            },
            last: {
                type: Number,
                required: true
            },
            high: {
                type: Number,
                required: true
            },
            low: {
                type: Number,
                required: true
            },
            change: {
                type: String,
                required: true
            },
            changePerCent: {
                type: String,
                required: true
            },
            volume: {
                type: String,
                required: true
            },
            time: {
                type: String,
                required: true
            },
            purchase: {
                type: Boolean,
                required: true,
            },
            sale: {
                type: Boolean,
                required: true,
            },
        }]
    }]
});



const MarketModel = mongoose.model('market', MarketSchema);

module.exports = MarketModel;
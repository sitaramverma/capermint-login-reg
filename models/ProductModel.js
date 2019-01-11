const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    product_name:{
        type:String,
        required:true
    },
    price: {
        type:String
    },
    image:{
        type:String
    },
    description: {
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = ProductModel = mongoose.model('products', ProductSchema)
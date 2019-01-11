const express = require("express")
const products = express.Router()
const cors = require("cors")


const Product = require('../models/ProductModel')
var ObjectId = require('mongodb').ObjectID;

products.use(cors())


products.post('/createInventory', (req,res) =>{
    const today = new Date()

    const productDetails = {
        product_name: req.body.product_name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        created: today
    }
    Product.findOne({
        product_name: req.body.product_name
    })
    .then(product => {
        if(!product){
            Product.create(productDetails)
            .then(product => {
                res.json({status: product.product_name +' product inventory created'})
            })
            .catch(err => {
                res.send('error' + err)
            })
        }else{
            res.json({error : 'product already exist'})
        }
    })
    .catch(err => {
        res.send('error '+ err)
    })
})

products.get('/getInventoryList', (req,res) => {
    Product.find({})
    .then(products => {
        if(products){
            res.json(products)
        }else{
            res.send('Data not found.')
        }
    })
    .catch(err => {
        res.send('err :' + err)
    })
})

products.get('/getProductByName',(req,res) => {
    Product.findOne({
        product_name:req.query.product_name
    })
    .then(products => {
        if(products){
            console.log(products.price)
            const price = indianFormat(products.price)+' INR'
            // const price = '2 INR'
            products.price = price ? price : 0;
            const result = res.json(products)
        }else{
            res.send('This product not found in inventory.')
        }
    })
    .catch(err => {
        res.send('err :'+err)
    })
})

products.put('/updateProductDetails', (req,res) => {
    const today = new Date()
    const productDetails = {
        product_name: req.body.product_name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        updated: today
    }

    Product.find({
        '_id': new ObjectId(req.body._id)
    })
    .then(product => {
        if(product){
            Product.update({'_id':req.body._id},productDetails,{multi:true})
            .then(product => {
                res.json({status: req.body.product_name +' product details updated successfully'})
            })
            .catch(err => {
                res.send('error' + err)
            })
        }else{
            res.json({error : 'product does not exist'})
        }
    })
    .catch(err => {
        res.send('error '+ err)
    })
})

products.delete('/deleteProduct',(req,res) => {
    Product.find({
        '_id': new ObjectId(req.body._id)
    })
    .then(product => {
        if(product){
            Product.delete({'_id':req.body._id})
            .then(product => {
                res.json({status: req.body.product_name +' product details deleted successfully'})
            })
            .catch(err => {
                res.send('error' + err)
            })
        }else{
            res.json({error : 'product does not exist'})
        }
    })
    .catch(err => {
        res.send('error '+ err)
    })
})

products.get('/getProductDetailsByLimit',(req,res) => {
    let pageCount = req.query.pageCount ? req.query.pageCount : 0;
    let pagelimit = 2;
    let skipCnt = 2*pageCount;
    Product.find().skip(skipCnt).limit(pagelimit)
    .then(product => {
        if(product){
            product.forEach(element => {
                element.price = element.price ? indianFormat(element.price)+' INR' : 0;
            });
            const result = res.json(product)         
        }else{
            res.json({error : 'product does not exist'})
        }
   })
   .catch(err => {
        res.send('error '+ err)
    })

})

const indianFormat = (x) =>{
    var res= x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res;
}

module.exports = products
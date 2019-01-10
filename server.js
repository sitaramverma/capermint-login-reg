const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")

const PORT = process.env.PORT || 5000
app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended:false
    })
)

const mongoURI = 'mongodb://localhost:27017/db_capermint'

mongoose
.connect(mongoURI,{useNewUrlParser:true})
.then(() => console.log("MongoDB COnnected"))
.catch(err => console.log(err))

const Users = require('./routes/Users')
app.use('/users',Users)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
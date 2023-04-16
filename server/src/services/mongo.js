const mongoose = require('mongoose')

require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL
mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!')
})

mongoose.connection.once('error',(err)=>{
    console.log(`found error ${err}`)
})


async function connect(){
    await mongoose.connect(MONGO_URL)
}

async function disConnect(){
    await mongoose.disconnect(MONGO_URL)
}

module.exports = {
    connect,
    disConnect
}
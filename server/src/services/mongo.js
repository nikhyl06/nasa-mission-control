const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://nikhilshankhwar2003:nikhil2003@nasacluster.5ruqhbc.mongodb.net/nasa?retryWrites=true&w=majority"
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
const http = require('http')
const mongoose = require('mongoose')

const {app} = require('./app')
const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT || 8000;
const MONGO_URL = `mongodb+srv://nikhilshankhwar2003:nikhil2003@nasacluster.5ruqhbc.mongodb.net/nasa?retryWrites=true&w=majority`
const server = http.createServer(app)

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!')
})

mongoose.connection.once('error',(err)=>{
    console.log(`found error ${err}`)
})


async function startServer(){
    await mongoose.connect(MONGO_URL)
    await loadPlanetsData();
    server.listen(PORT, ()=>{
        console.log(`listening on port ${PORT}...`)
    })
}
startServer();
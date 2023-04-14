const express = require("express")
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')

const app = express()
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/planets',planetsRouter)
app.use('/launches',launchesRouter)
app.get('/*', (req, res)=>{
    res.status(404).json({message: "404 not found!"})
})


module.exports = {
    app  
}
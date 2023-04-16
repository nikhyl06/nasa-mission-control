const express = require("express")
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const api = require('./routes/api')


const app = express()
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', api)
// app.use('/v2', api2)

app.get('/*', (req, res)=>{
    res.status(404).json({message: "404 not found!"})
})


module.exports = {
    app  
}
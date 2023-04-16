const http = require('http')
const mongo = require('./services/mongo')


const {app} = require('./app')
const {loadPlanetsData} = require('./models/planets.model')
const {loadLaunchesData} = require('./models/launches.model')

const PORT = process.env.PORT || 8000;
const server = http.createServer(app)



async function startServer(){
    await mongo.connect()
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(PORT, ()=>{
        console.log(`listening on port ${PORT}...`)
    })
}
startServer();
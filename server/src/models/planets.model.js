const {parse} = require('csv-parse')
const path  = require('path')
const fs = require('fs')


let habitablePlanets = []

const isHabitable = (planet)=>{
    return (planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6)
    ;
}


function loadPlanetsData(){
    return new Promise((resolve, reject)=>{fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('data', (data)=>{
            if(isHabitable(data)){
                habitablePlanets.push({kepler_name: data.kepler_name})
            }
        })
        .on('error', (err)=>{
            console.log(err)
            reject(err)
        })
        .on('end', ()=>{
            console.log("found hebitable planets ")
            resolve();
        });
    });
}

function getAllPlanets(){
    return habitablePlanets
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
 
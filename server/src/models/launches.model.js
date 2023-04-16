const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require('axios')

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function downlaodLaunchData() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    } 
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });
    if(response.status !== 200) {
        console.log("Problem downloading launch data");
        throw new Error("Launch data download failed");
    }
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs) {
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            target: "Kepler-442 b", 

            customers: launchDoc.payloads.flatMap((payload) => {
                return payload.customers;
            }),
        }
        await saveLaunch(launch);
    } 
}

async function loadLaunchesData() {
    const fisrtLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });
    if(fisrtLaunch) {
        console.log("data already loaded");
    }else{
        console.log("downloading launch data...");
        await downlaodLaunchData();
    }
    
}



async function findLaunch(filter){
    return await launchesDB.findOne(filter);
}

async function existsLaunchWithId(id) {
    return await findLaunch({ flightNumber: id });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
    return latestLaunch ? latestLaunch.flightNumber : 100;
}

async function getAllLaunches({skip, limit}) {
    return await launchesDB.
    find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
    try {
        await launchesDB.updateOne(
            { flightNumber: launch.flightNumber },
            launch,
            { upsert: true }
        );
    } catch (err) {
        console.error(`Could not save launch ${err}`);
    }
}

async function ScheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error("No matching planet found");
    }
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["NASA", "IITD"],
        flightNumber: newFlightNumber,
    });
    saveLaunch(newLaunch);
}


async function abortLaunch(id) {
    const aborted = await launchesDB.updateOne({
        flightNumber: id,
    },{
        upcoming: false,
        success: false,
    });
    return aborted.acknowledged && aborted.modifiedCount === 1;


    // const aborted = launches.get(id);
    // aborted.upcoming = false; 
    // aborted.success = false;
    // return aborted;
}

module.exports = {
    getAllLaunches,
    ScheduleNewLaunch,
    existsLaunchWithId,
    abortLaunch,
    loadLaunchesData
};

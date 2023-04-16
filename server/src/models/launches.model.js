const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();

// const launch = {
//     flightNumber: 100,
//     mission: "Kepler Exploration X",
//     rocket: "Explorer IS1",
//     launchDate: new Date("December 27, 2030"),
//     target: "Kepler-442 b",
//     customers: ["NASA", "NIKHIL"],
//     upcoming: true,
//     success: true,
// };

// saveLaunch(launch);

async function existsLaunchWithId(id) {
    return await launchesDB.findOne({ flightNumber: id });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
    return latestLaunch ? latestLaunch.flightNumber : 100;
}

async function getAllLaunches() {
    return await launchesDB.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error("No matching planet found");
    }
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
};

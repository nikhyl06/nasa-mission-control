const {
    getAllLaunches,
    ScheduleNewLaunch,
    existsLaunchWithId,
    abortLaunch
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpPostLaunch(req, res) {
    const launch = req.body;
    if (
        !launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.target
    ) {
        return res.status(400).json({ error: "some data is missing" });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: "date is not in proper format" });
    }
    await ScheduleNewLaunch(launch);
    console.log(launch)
    return res.status(201).json(launch);
}

async function httpDeleteLaunch(req, res) {
    const LaunchId = Number(req.params.id);

    const existLaunch = await existsLaunchWithId(LaunchId);
    if (!existLaunch) {
        return res.status(404).json({
            error: "Lauch not found",
        });
    }
    const aborted = await abortLaunch(LaunchId)
    if(!aborted){
        return res.status(400).json({
            error: "Launch not aborted",
        });
    }
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpDeleteLaunch,
};

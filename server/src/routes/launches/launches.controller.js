const {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunch
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
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
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpDeleteLaunch(req, res) {
    const LaunchId = Number(req.params.id);

    if (!existsLaunchWithId(LaunchId)) {
        return res.status(404).json({
            error: "Lauch not found",
        });
    }
    const aborted = abortLaunch(LaunchId)
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpDeleteLaunch,
};

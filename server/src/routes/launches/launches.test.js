const request = require("supertest");
const { app } = require("../../app");
const { connect, disConnect } = require("../../services/mongo");

describe("Launches API", () => {

    beforeAll(async () => {
        await connect();
    });
    afterAll(async () => {
        await disConnect();
    })
    describe("Test GET /launches", () => {
        test("It should respond with 200 success", async () => {
            const response = await request(app)
                .get("/v1/launches")
                .expect("Content-Type", /json/)
                .expect(200);
        });
    });
    describe("Test POST /v1/launches", () => {
        const completeLaunchData = {
            mission: "USS Enterprise",
            rocket: "NCC-1701-D",
            target: "Kepler-62 f",
            launchDate: "January 4, 2028",
        };

        const InvalidDate = {
            mission: "USS Enterprise",
            rocket: "NCC-1701-D",
            target: "Kepler-62 f",
            launchDate: "anuy 4, 2028",
        };

        const launchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "NCC-1701-D",
            target: "Kepler-62 f",
        };

        test("It should respond with 201 created", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(completeLaunchData)
                .expect("Content-Type", /json/)
                .expect(201);
            const requestDate = new Date(
                completeLaunchData.launchDate
            ).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        test("It should catch missing required properties", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithoutDate)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "some data is missing",
            });
        });
        test("Catch invalid dates", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(InvalidDate)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "date is not in proper format",
            });
        });
    });
});

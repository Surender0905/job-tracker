const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/init");

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe("POST /applications", () => {
    it("should create a new job application", async () => {
        const res = await request(app).post("/applications").send({
            role: "Software Engineer",
            company: "Google",
            jdUrl: "https://google.com",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
    });

    ///Return 400 if required fields are missing
    it("should return 400 if role or company is missing", async () => {
        const res = await request(app).post("/applications").send({
            role: "Software Engineer",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    //GET /applications

    it("should return all job applications", async () => {
        const res = await request(app).get("/applications");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    //Return 200 OK with an empty array when no applications exist
    // it("should return an empty array when no applications exist", async () => {
    //     const res = await request(app).get("/applications");
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body).toHaveLength(0);
    // });

    //GET /applications/:id
    it("should return a job application by id", async () => {
        const res = await request(app).get("/applications/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id");
    });

    //Return 404 if job application is not found
    it("should return 404 if job application is not found", async () => {
        const res = await request(app).get("/applications/2");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    //Update a job application successfully

    it("should update a job application successfully", async () => {
        const res = await request(app).put("/applications/1").send({
            status: "Interview",
            interviewRounds: 2,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Interview");
        expect(res.body).toHaveProperty("interviewRounds", 2);
    });

    //Return 404 if job application is not found for update
    it("should return 404 if job application is not found for update", async () => {
        const res = await request(app).put("/applications/2").send({
            status: "Interview",
            interviewRounds: 2,
        });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    //Return 400 if invalid data is provided for update
    it("should return 400 if invalid data is provided for update", async () => {
        const res = await request(app).put("/applications/1").send({
            status: "Interview",
            interviewRounds: "2",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    //Delete a job application successfully
    it("should delete a job application successfully", async () => {
        const res = await request(app).delete("/applications/1");
        expect(res.statusCode).toBe(204);
    });

    //Return 404 if job application is not found for deletion
    it("should return 404 if job application is not found for deletion", async () => {
        const res = await request(app).delete("/applications/1");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});

import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import dbConnect from "../../src/db/dbConnect";
import userModel from "../../src/model/user";

// Before all tests
beforeAll(async () => {
    await dbConnect();
    await userModel.deleteMany({});
});

// After all tests
afterAll(async () => {
    await mongoose.disconnect();
});

// Test user details
const testUser = {
    Name: "Test User",
    Email: "testuser@example.com",
    Password: "Password123",
};

let token = "";

describe("Auth Routes", () => {
    it("should register a new user", async () => {
        const res = await request(app).post("/api/users/register").send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe(true);
        expect(res.body.data.Email).toBe(testUser.Email);
    });

    it("should login the user", async () => {
        const res = await request(app).post("/api/users/login").send({
            Email: testUser.Email,
            Password: testUser.Password,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.token).toBeDefined();
        token = res.body.data.token;
    });

    it("should return 401 for invalid credentials", async () => {
        const res = await request(app).post("/api/users/login").send({
            Email: testUser.Email,
            Password: "wrongpassword",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe(false);
    });

    it("should get user profile with token", async () => {
        const res = await request(app)
            .get("/api/users/profile")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.Email).toBe(testUser.Email);
    });

    it("should deny access to profile without token", async () => {
        const res = await request(app).get("/api/users/profile");
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe(false);
    });

    it("should logout the user", async () => {
        const res = await request(app)
            .delete("/api/users/logout")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
    });

    it("should reject profile after logout", async () => {
        const res = await request(app)
            .get("/api/users/profile")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe(false);
    });
});

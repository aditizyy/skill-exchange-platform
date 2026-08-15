const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../src/app");
const connectDB = require("../src/config/db");

const User = require("../src/models/User");
const Request = require("../src/models/Request");

describe("Match and Request API", () => {
  let userA;
  let userB;
  let userC;

  let tokenA;
  let tokenB;
  let tokenC;

  let pendingRequestId;

  beforeAll(async () => {
    // Use the separate test database.
    if (!process.env.MONGODB_TEST_URI) {
      throw new Error("MONGODB_TEST_URI is not defined in backend/.env");
    }

    process.env.MONGODB_URI = process.env.MONGODB_TEST_URI;

    await connectDB();

    // Clean test collections before starting.
    await Request.deleteMany({});
    await User.deleteMany({});

    // Create test users.
    userA = await User.create({
      name: "Test User A",
      email: "match-test-a@example.com",
      password: "hashed-password-a",
      skillsToTeach: ["Java", "React"],
      skillsToLearn: ["Python", "MongoDB"],
    });

    userB = await User.create({
      name: "Test User B",
      email: "match-test-b@example.com",
      password: "hashed-password-b",
      skillsToTeach: ["Python", "MongoDB"],
      skillsToLearn: ["Java", "React"],
    });

    userC = await User.create({
      name: "Test User C",
      email: "match-test-c@example.com",
      password: "hashed-password-c",
      skillsToTeach: ["C++"],
      skillsToLearn: ["JavaScript"],
    });

    // Generate JWTs directly for API authentication.
    tokenA = jwt.sign(
      { id: userA._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    tokenB = jwt.sign(
      { id: userB._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    tokenC = jwt.sign(
      { id: userC._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  afterAll(async () => {
    await Request.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("GET /api/matches/suggested", () => {
    test("should return matching users based on complementary skills", async () => {
      const response = await request(app)
        .get("/api/matches/suggested")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.matches).toHaveLength(1);

      const match = response.body.matches[0];

      expect(match.name).toBe("Test User B");
      expect(match.matchScore).toBe(4);
      expect(match.theyTeachMeWant).toEqual(
        expect.arrayContaining(["Python", "MongoDB"])
      );
      expect(match.iTeachTheyWant).toEqual(
        expect.arrayContaining(["Java", "React"])
      );

      // Email must not be exposed for suggested matches.
      expect(match.email).toBeUndefined();
    });

    test("should reject unauthenticated access", async () => {
      const response = await request(app)
        .get("/api/matches/suggested");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/matches/request", () => {
    test("should successfully send a request", async () => {
      const response = await request(app)
        .post("/api/matches/request")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          receiverId: userB._id.toString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Request sent");
      expect(response.body.request.status).toBe("pending");

      pendingRequestId = response.body.request._id;
    });

    test("should reject a request without receiverId", async () => {
      const response = await request(app)
        .post("/api/matches/request")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({});

      expect(response.status).toBe(400);
    });

    test("should reject an invalid receiverId", async () => {
      const response = await request(app)
        .post("/api/matches/request")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          receiverId: "12345",
        });

      expect(response.status).toBe(400);
    });

    test("should reject sending a request to yourself", async () => {
      const response = await request(app)
        .post("/api/matches/request")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          receiverId: userA._id.toString(),
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "You cannot send a request to yourself"
      );
    });

    test("should reject a duplicate request", async () => {
      const response = await request(app)
        .post("/api/matches/request")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          receiverId: userB._id.toString(),
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    test("should reject unauthenticated requests", async () => {
      const response = await request(app)
        .post("/api/matches/request")
        .send({
          receiverId: userB._id.toString(),
        });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/matches/inbox", () => {
    test("should return received requests", async () => {
      const response = await request(app)
        .get("/api/matches/inbox")
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.requests).toHaveLength(1);

      const receivedRequest = response.body.requests[0];

      expect(receivedRequest.status).toBe("pending");
      expect(receivedRequest.from.name).toBe("Test User A");

      // Email should not be exposed while request is pending.
      expect(receivedRequest.from.email).toBeUndefined();
    });
  });

  describe("GET /api/matches/sent", () => {
    test("should return requests sent by the current user", async () => {
      const response = await request(app)
        .get("/api/matches/sent")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.requests).toHaveLength(1);

      const sentRequest = response.body.requests[0];

      expect(sentRequest.status).toBe("pending");
      expect(sentRequest.to.name).toBe("Test User B");
      expect(sentRequest.to.email).toBeUndefined();
    });
  });

  describe("PATCH /api/matches/:id", () => {
    test("should reject an invalid request id", async () => {
      const response = await request(app)
        .patch("/api/matches/12345")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          status: "accepted",
        });

      expect(response.status).toBe(400);
    });

    test("should reject an invalid status", async () => {
      const response = await request(app)
        .patch(`/api/matches/${pendingRequestId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          status: "pending",
        });

      expect(response.status).toBe(400);
    });

    test("should prevent the sender from responding to the request", async () => {
      const response = await request(app)
        .patch(`/api/matches/${pendingRequestId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          status: "accepted",
        });

      expect(response.status).toBe(403);
    });

    test("should allow the recipient to accept the request", async () => {
      const response = await request(app)
        .patch(`/api/matches/${pendingRequestId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          status: "accepted",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.request.status).toBe("accepted");

      // Contact information should now be visible.
      expect(response.body.request.from.email).toBe(
        "match-test-a@example.com"
      );
    });

    test("should reject responding to an already accepted request", async () => {
      const response = await request(app)
        .patch(`/api/matches/${pendingRequestId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          status: "declined",
        });

      expect(response.status).toBe(409);
    });
  });

  describe("Accepted request contact visibility", () => {
    test("should expose contact information after acceptance", async () => {
      const inboxResponse = await request(app)
        .get("/api/matches/inbox")
        .set("Authorization", `Bearer ${tokenB}`);

      expect(inboxResponse.status).toBe(200);

      const acceptedRequest = inboxResponse.body.requests[0];

      expect(acceptedRequest.status).toBe("accepted");
      expect(acceptedRequest.from.email).toBe(
        "match-test-a@example.com"
      );
    });

    test("should expose accepted request contact information in sent requests", async () => {
      const sentResponse = await request(app)
        .get("/api/matches/sent")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(sentResponse.status).toBe(200);

      const acceptedRequest = sentResponse.body.requests[0];

      expect(acceptedRequest.status).toBe("accepted");
      expect(acceptedRequest.to.email).toBe(
        "match-test-b@example.com"
      );
    });
  });
});
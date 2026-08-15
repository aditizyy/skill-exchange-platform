const request = require("supertest");
const app = require("../src/app"); // Points from backend/test/ to backend/src/app.js


describe("Express App Setup and Routes", () => {
  
  test("GET / should return root API message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Skill Exchange Backend API is Running");
  });

  test("GET /api/health should return health check status", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Backend is running");
  });

  test("GET /api/non-existent-route should trigger 404 handler", async () => {
    const response = await request(app).get("/api/non-existent-route");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Route not found");
  });

  test("Security headers from Helmet should be present", async () => {
    const response = await request(app).get("/");
    // Helmet adds headers like X-DNS-Prefetch-Control, X-Frame-Options, etc.
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

});
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authControllers");
const { authenticate, requireAdmin } = require("../middleware/auth");

jest.mock("jsonwebtoken");

describe("Auth Controllers", () => {
  let mockReq, mockRes, mockUser;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockUser = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "user",
      password: "hashed",
      comparePassword: jest.fn(),
    };
  });

  describe("register", () => {
    it("should return 400 if fields missing", async () => {
      mockReq = { body: {}, models: { User: {} } };
      await register(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 409 if email already exists", async () => {
      mockReq = {
        body: { name: "User", email: "test@example.com", password: "secret" },
        models: { User: { findOne: jest.fn().mockResolvedValue(mockUser) } },
      };
      await register(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(409);
    });

    it("should return 201 and user data if successful", async () => {
      mockReq = {
        body: { name: "User", email: "test@example.com", password: "secret" },
        models: {
          User: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      };
      await register(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "user",
      });
    });
  });

  describe("login", () => {
    it("should return 400 if fields missing", async () => {
      mockReq = { body: {}, models: { User: {} } };
      await login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 401 if user not found", async () => {
      mockReq = {
        body: { email: "nope@example.com", password: "secret" },
        models: { User: { findOne: jest.fn().mockResolvedValue(null) } },
      };
      await login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it("should return 200 and token if successful", async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fake-token");
      mockReq = {
        body: { email: "test@example.com", password: "secret" },
        models: { User: { findOne: jest.fn().mockResolvedValue(mockUser) } },
      };
      await login(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({ token: "fake-token" });
    });
  });
});

describe("Auth Middleware", () => {
  let mockReq, mockRes, next;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("authenticate should reject if no token", async () => {
    mockReq = { headers: {}, models: { User: {} } };
    await authenticate(mockReq, mockRes, next);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it("authenticate should attach user if valid", async () => {
    jwt.verify.mockReturnValue({ id: 1 });
    const fakeUser = { id: 1, role: "admin" };
    mockReq = {
      headers: { authorization: "Bearer token" },
      models: { User: { findByPk: jest.fn().mockResolvedValue(fakeUser) } },
    };
    await authenticate(mockReq, mockRes, next);
    expect(mockReq.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
  });

  it("requireAdmin should reject if not admin", () => {
    mockReq = { user: { role: "user" } };
    requireAdmin(mockReq, mockRes, next);
    expect(mockRes.status).toHaveBeenCalledWith(403);
  });

  it("requireAdmin should call next if admin", () => {
    mockReq = { user: { role: "admin" } };
    requireAdmin(mockReq, mockRes, next);
    expect(next).toHaveBeenCalled();
  });
});

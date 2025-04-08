const crypto = require("crypto");
const { encryptData, decryptData } = require("./wallet");

describe("Wallet Encryption Module", () => {
  beforeEach(() => {
    // Clear all mocks and reset implementations
    jest.clearAllMocks();

    // Set up the mock return values for randomBytes for each test
    jest
      .spyOn(crypto, "randomBytes")
      .mockReturnValueOnce(Buffer.from("mock-salt-buffer"))
      .mockReturnValueOnce(Buffer.from("mock-iv-buffer"));
    jest
      .spyOn(crypto, "pbkdf2Sync")
      .mockImplementation((password, salt, iterations, keyLength, digest) =>
        Buffer.from("mock-key")
      );
    jest.spyOn(crypto, "createCipheriv").mockReturnValue({
      update: jest.fn().mockReturnValue("mock-encrypted-data"),
      final: jest.fn().mockReturnValue("mock-final-data"),
      getAuthTag: jest.fn().mockReturnValue(Buffer.from("mock-auth-tag")),
    });
    jest.spyOn(crypto, "createDecipheriv").mockReturnValue({
      update: jest.fn().mockReturnValue('{"mock":"decrypted-data"}'),
      final: jest.fn().mockReturnValue(""),
      setAuthTag: jest.fn(),
    });
  });

  describe("encryptData", () => {
    test("should encrypt data with provided password", () => {
      const data = { seed: "test seed phrase" };
      const password = "test-password";

      const result = encryptData(data, password);

      // Check that crypto functions were called correctly
      expect(crypto.randomBytes).toHaveBeenCalledTimes(2);
      expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
        password,
        expect.any(Buffer),
        100000,
        32,
        "sha256"
      );
      expect(crypto.createCipheriv).toHaveBeenCalledWith(
        "aes-256-gcm",
        expect.any(Buffer),
        expect.any(Buffer)
      );

      // Check the returned encrypted data structure
      expect(result).toEqual({
        salt: expect.any(String),
        iv: expect.any(String),
        encryptedSeed: "mock-encrypted-datamock-final-data",
        authTag: expect.any(String),
      });
    });
  });

  describe("decryptData", () => {
    test("should decrypt data with correct password", () => {
      const encryptedData = {
        salt: "mock-salt",
        iv: "mock-iv",
        encryptedSeed: "mock-encrypted-data",
        authTag: "mock-auth-tag",
      };
      const password = "test-password";

      const result = decryptData(encryptedData, password);

      // Check that crypto functions were called correctly
      expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
        password,
        expect.any(Buffer),
        100000,
        32,
        "sha256"
      );
      expect(crypto.createDecipheriv).toHaveBeenCalledWith(
        "aes-256-gcm",
        expect.any(Buffer),
        expect.any(Buffer)
      );

      // Check the returned decrypted data
      expect(result).toEqual({ mock: "decrypted-data" });
    });

    test("should throw error when decryption fails", () => {
      const encryptedData = {
        salt: "mock-salt",
        iv: "mock-iv",
        encryptedSeed: "mock-encrypted-data",
        authTag: "mock-auth-tag",
      };
      const password = "wrong-password";

      // Make decipher.update throw an error
      const mockDecipher = {
        update: jest.fn().mockImplementation(() => {
          throw new Error("Decryption failed");
        }),
        setAuthTag: jest.fn(),
      };
      crypto.createDecipheriv.mockReturnValue(mockDecipher);

      expect(() => {
        decryptData(encryptedData, password);
      }).toThrow("Decryption failed");
    });
  });
});

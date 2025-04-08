const crypto = require("crypto");

const encryptData = (data, password) => {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encryptedSeed = cipher.update(JSON.stringify(data), "utf8", "hex");
  encryptedSeed += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return {
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    encryptedSeed,
    authTag: authTag.toString("hex"),
  };
};

const decryptData = (encryptedData, password) => {
  const salt = Buffer.from(encryptedData.salt, "hex");
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  const iv = Buffer.from(encryptedData.iv, "hex");
  const authTag = Buffer.from(encryptedData.authTag, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decryptedSeed = decipher.update(
    encryptedData.encryptedSeed,
    "hex",
    "utf8"
  );
  decryptedSeed += decipher.final("utf8");

  return JSON.parse(decryptedSeed);
};

module.exports = {
  encryptData,
  decryptData
};

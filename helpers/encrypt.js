require("dotenv").config();
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.ENCRYPT_SECRET);

class Encryptr {
  encrypt(value) {
    const encryptedString = cryptr.encrypt(value);
    return encryptedString;
  }

  decrypt(value) {
    const decryptedString = cryptr.decrypt(value);
    return decryptedString;
  }
}

module.exports = new Encryptr();

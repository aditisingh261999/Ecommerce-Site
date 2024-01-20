const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
  try {
    const objectId = new mongoose.Types.ObjectId(id);
    if (!objectId) {
      throw new Error("Invalid id");
    }
  } catch (error) {
    throw new Error("Invalid id");
  }
};

module.exports = { validateMongoDbId };

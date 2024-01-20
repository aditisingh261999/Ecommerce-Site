const { default: mongoose } = require("mongoose");

const dbConnnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("Connected to Database Successfully");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnnect;

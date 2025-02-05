const { Sequelize } = require("sequelize");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, process.env.DB_FILE),

    logging: process.env.NODE_ENV !== "test",
});

const connectDb = async () => {
    try {
        await sequelize.sync();
        await sequelize.authenticate();
        console.log(
            "Database connection has been established successfully." +
                process.env.NODE_ENV,
        );
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = { connectDb, sequelize };

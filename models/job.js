const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../db/init");
const Interview = require("./interview");

const JobApplication = sequelize.define("JobApplication", {
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jdUrl: {
        type: DataTypes.STRING,
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["no reply", "rejected", "interview", "selected", "accepted"],
        defaultValue: "no reply",
    },
    interviewRounds: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Default to 0 rounds
    },
});

module.exports = JobApplication;

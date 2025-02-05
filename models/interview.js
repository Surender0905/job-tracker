const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/init");
const JobApplication = require("./Job");

const Interview = sequelize.define("Interview", {
    // Foreign key referencing the JobApplication model
    applicationId: {
        type: DataTypes.INTEGER,

        allowNull: false, // Interview should be tied to a job application
    },

    // Interview round number
    roundNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // Type of the interview (e.g., telephonic, offline, online)
    roundType: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Date of the interview
    interviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    // Optional: List of interview questions asked
    questions: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Optional: Role offered during the interview
    roleOffered: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Optional: Compensation details offered during the interview
    compensationOffered: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Auto-generated timestamp for when the interview was created
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Interview;

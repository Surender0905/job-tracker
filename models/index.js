const Interview = require("./interview");
const JobApplication = require("./Job");

// Set associations after both models are defined
JobApplication.hasMany(Interview, {
    foreignKey: "applicationId",
    onDelete: "CASCADE",
});

Interview.belongsTo(JobApplication, {
    foreignKey: "applicationId",
    onDelete: "CASCADE",
});

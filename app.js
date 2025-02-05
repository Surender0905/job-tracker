const express = require("express");

const app = express();
//connect database
const { connectDb, sequelize } = require("./db/init");
const JobApplication = require("./models/Job");
const { Op } = require("sequelize");

connectDb();

app.use(express.json());

///health check
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Job Application Tracker API" });
});

///routes
app.use("/applications", require("./routes/job"));
app.get("/report/applications", async (req, res) => {
    try {
        const { from, to } = req.query;

        // Validate the 'from' and 'to' date formats
        if (from && isNaN(Date.parse(from))) {
            return res
                .status(400)
                .json({ error: "Invalid 'from' date format." });
        }
        if (to && isNaN(Date.parse(to))) {
            return res.status(400).json({ error: "Invalid 'to' date format." });
        }

        //date range filter
        const dateRangeFilter = {};
        if (from && to) {
            dateRangeFilter.appliedAt = {
                [Op.between]: [new Date(from), new Date(to)],
            };
        } else if (from) {
            dateRangeFilter.appliedAt = { [Op.gte]: new Date(from) };
        } else if (to) {
            dateRangeFilter.appliedAt = { [Op.lte]: new Date(to) };
        }

        const totalApplication = await JobApplication.count({
            where: dateRangeFilter,
        });

        //application by status

        const applicationByStatus = await JobApplication.findAll({
            where: dateRangeFilter,
            attributes: [
                "status",
                [sequelize.fn("COUNT", sequelize.col("status")), "count"],
            ],
            group: "status",
        });
        res.status(200).json({
            totalApplication,
            applicationByStatus,
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({
            error: "Server error while generating report.",
        });
    }
});

module.exports = app;

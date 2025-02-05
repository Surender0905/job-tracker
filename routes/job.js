const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { Op } = require("sequelize");
const Interview = require("../models/interview");
const { sequelize } = require("../db/init");

router.get("/", async (req, res) => {
    const { company, status, from, to } = req.query;
    try {
        let where = {};
        if (company) {
            where.company = company;
        }
        if (status) {
            where.status = status;
        }
        if (from && to) {
            where.appliedAt = {
                [Op.between]: [from, to],
            };
        }
        const jobs = await Job.findAll({
            where,
            order: [["appliedAt", "DESC"]],
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /applications - Create a job application
router.post("/", async (req, res) => {
    try {
        const { role, company, jdUrl, appliedAt } = req.body;

        if (!role || !company) {
            return res
                .status(400)
                .json({ error: "Role and company are required." });
        }

        const jobApplication = await Job.create({
            role,
            company,
            jdUrl,
            appliedAt: appliedAt || new Date(),
        });

        return res.status(201).json(jobApplication);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//get by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const application = await Job.findByPk(id);
        if (!application) {
            return res.status(404).json({ error: "Job application not found" });
        } else {
            return res.status(200).json(application);
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//update job application

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { status, interviewRounds } = req.body;
    try {
        const application = await Job.findByPk(id);
        if (!application) {
            return res.status(404).json({ error: "Job application not found" });
        }
        application.status = status || application.status;
        application.interviewRounds =
            interviewRounds || application.interviewRounds;
        await application.save();
        return res.status(200).json(application);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params; // Extract the application ID from the URL params

    try {
        // Find the job application by ID
        const application = await Job.findByPk(id);

        if (!application) {
            return res.status(404).json({ error: "Job application not found" });
        }

        // Delete the application from the database
        await application.destroy();

        // Return 204 No Content on successful deletion
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting the job application" });
    }
});

// POST /applications/:id/interview - Create an interview
router.post("/:id/interview", async (req, res) => {
    const { id } = req.params;
    const { roundNum, roundType, interviewDate, questions } = req.body;

    if (!roundNum || !roundType || !interviewDate) {
        return res
            .status(400)
            .json({ error: "Round number, type, and date are required." });
    }
    try {
        const application = await Job.findByPk(id);

        if (!application) {
            return res.status(404).json({ error: "Job application not found" });
        }

        const interview = await Interview.create({
            applicationId: id,
            roundNum,
            roundType,
            interviewDate,
            questions,
        });

        return res.status(201).json(interview);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//GET /applications/:id/interview

router.get("/:id/interview", async (req, res) => {
    const { id } = req.params;

    try {
        const interviews = await Interview.findAll({
            where: {
                applicationId: id,
            },
        });
        if (interviews.length === 0) {
            return res.status(400).json({
                message: "Interviews not found",
            });
        }

        req.status(200).json(interviews);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;

import express from "express";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
const router = express.Router();

router.get("/ai-plugin.json", async (req, res) => {
    const filePath = path.join(__dirname, "..", "..", "ai-plugin.json");
  
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found: " + filePath });
    }
  
    const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });

    const expandedContent = fileContent.replace(/\$(\w+)|\${(\w+)}/g, (match, varName1, varName2) => {
        const varName = varName1 || varName2;
        return process.env[varName] || "";
    });

    res.setHeader("Cache-Control", process.env.NODE_ENV === "test" ? "no-store" : "max-age=86400");
    res.json(JSON.parse(expandedContent));
});

export default router;

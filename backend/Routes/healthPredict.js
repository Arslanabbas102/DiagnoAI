import express from "express";
import { spawn } from "child_process";
const router = express.Router({ mergeParams: true });

const pythonScriptPathForSymptoms = "./symptoms.py";
const symptomsModel = "./aimodels/svc.pkl";

router.post("/symptoms", (req, res) => {
  let responseSent = false; // Flag to track if response has been sent
  try {
    const data = req.body.data;
    console.log({ dataInString: JSON.stringify({ data }) });
    const pythonProcess = spawn(process.env.PYTHON || "python", [
      pythonScriptPathForSymptoms,
      "--loads",
      symptomsModel,
      JSON.stringify({ data }),
    ]);
    let prediction;
    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      // symptoms.py prints debug lines before the JSON result
      try {
        prediction = JSON.parse(output.slice(output.indexOf("{")));
      } catch (error) {
        console.error("Could not parse Python output:", output);
        if (!responseSent) {
          res.status(500).send("Internal Server Error");
          responseSent = true;
        }
        return;
      }
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ data: prediction });
        responseSent = true;
      }
    });
    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      responseSent = true;
      return res.status(500).send("Internal Server Error");
    }
  }
});

export default router;

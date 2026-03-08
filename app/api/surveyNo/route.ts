import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "surveys.json");

  const fileData = fs.readFileSync(filePath, "utf-8");
  const surveys = JSON.parse(fileData);

  if (surveys.length === 0) {
    return Response.json({ nextSurveyNo: 1 });
  }

  const lastSurvey = surveys[surveys.length - 1];

  return Response.json({
    nextSurveyNo: lastSurvey.surveyNo + 1
  });
}

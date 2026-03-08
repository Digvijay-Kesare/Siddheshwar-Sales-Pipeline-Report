import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surveyNo = searchParams.get("surveyNo");

  const filePath = path.join(process.cwd(), "data", "surveys.json");

  const fileData = fs.readFileSync(filePath, "utf-8");
  const surveys = JSON.parse(fileData);

  const survey = surveys.find(
    (s: any) => s.surveyNo == surveyNo
  );

  return Response.json(survey || null);
}
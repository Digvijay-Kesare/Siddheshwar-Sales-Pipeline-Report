import fs from "fs";
import path from "path";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const filePath = path.join(process.cwd(), "data", "surveys.json");

    let surveys: any[] = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      surveys = fileData ? JSON.parse(fileData) : [];
    }

    // 🔥 Ensure unique survey number
    const lastSurveyNo =
      surveys.length > 0
        ? Math.max(...surveys.map((s: any) => Number(s.surveyNo || 0)))
        : 0;

    const newSurvey = {
      ...body,
      surveyNo: lastSurveyNo + 1
    };

    surveys.push(newSurvey);

    fs.writeFileSync(filePath, JSON.stringify(surveys, null, 2));

    return Response.json({ success: true });

  } catch (error) {

    console.log("SAVE SURVEY ERROR:", error);

    return Response.json({ success: false });

  }

}
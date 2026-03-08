import fs from "fs";
import path from "path";

export async function DELETE(req: Request) {

  try {

    const { searchParams } = new URL(req.url);
    const surveyNo = searchParams.get("surveyNo");

    const filePath = path.join(process.cwd(), "data", "surveys.json");

    const fileData = fs.readFileSync(filePath, "utf-8");

    const surveys = fileData ? JSON.parse(fileData) : [];

    const updatedSurveys = surveys.filter(
      (s: any) => String(s.surveyNo) !== String(surveyNo)
    );

    fs.writeFileSync(filePath, JSON.stringify(updatedSurveys, null, 2));

    return Response.json({ success: true });

  } catch (error) {

    console.log("DELETE ERROR:", error);

    return Response.json({ success: false });

  }

}
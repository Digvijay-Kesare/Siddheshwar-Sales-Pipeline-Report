import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {

  try {

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, "SECRET_KEY");

    const body = await request.json();

    const filePath = path.join(process.cwd(), "data", "surveys.json");

    // Ensure file exists
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }

    const fileData = fs.readFileSync(filePath, "utf-8");

    let surveys = JSON.parse(fileData || "[]");

    // 🔥 Ensure surveys is always an array
    if (!Array.isArray(surveys)) {
      surveys = [];
    }

    const nextSurveyNo =
      surveys.length > 0
        ? Math.max(...surveys.map((s: any) => Number(s.surveyNo || 0))) + 1
        : 1;

    const newSurvey = {
      surveyNo: nextSurveyNo,
      customer: body.customer,
      village: body.village,
      discharge: body.discharge,
      staticHeight: body.staticHeight,
      rows: body.rows || [],
      totalHead: body.totalHead || 0,
      userId: decoded.userId
    };

    surveys.push(newSurvey);

    fs.writeFileSync(filePath, JSON.stringify(surveys, null, 2));

    return Response.json({
      message: "Survey saved successfully",
      survey: newSurvey
    });

  } catch (error) {

    console.error("CREATE SURVEY ERROR:", error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );

  }

}
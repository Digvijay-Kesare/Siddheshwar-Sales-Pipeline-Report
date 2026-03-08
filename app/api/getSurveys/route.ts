import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {

  try {

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json([]);
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, "SECRET_KEY");

    const filePath = path.join(process.cwd(), "data", "surveys.json");

    if (!fs.existsSync(filePath)) {
      return Response.json([]);
    }

    const fileData = fs.readFileSync(filePath, "utf-8");

    const surveys = fileData ? JSON.parse(fileData) : [];

    if (!Array.isArray(surveys)) {
      return Response.json([]);
    }

    const userSurveys = surveys.filter(
      (s: any) => s.userId === decoded.userId
    );

    return Response.json(userSurveys);

  } catch (error) {

    console.log("GET SURVEYS ERROR:", error);

    return Response.json([]);

  }

}
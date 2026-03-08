import fs from "fs";
import path from "path";

export async function PUT(request: Request) {

  const body = await request.json();
  const { surveyNo } = body;

  const filePath = path.join(process.cwd(),"data","surveys.json");

  const fileData = fs.readFileSync(filePath,"utf-8");
  const surveys = JSON.parse(fileData);

  const updated = surveys.map((s:any) =>
    s.surveyNo == surveyNo ? body : s
  );

  fs.writeFileSync(filePath, JSON.stringify(updated,null,2));

  return Response.json({message:"Survey updated"});
}
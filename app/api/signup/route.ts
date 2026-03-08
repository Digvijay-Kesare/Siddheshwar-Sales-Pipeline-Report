import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  const filePath = path.join(process.cwd(), "data", "users.json");

  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password
  };

  users.push(newUser);

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return Response.json({ message: "User registered successfully" });
}

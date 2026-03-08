import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

  const user = users.find(
    (u: any) => u.email === email && u.password === password
  );

  if (!user) {
    return Response.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

 const token = jwt.sign(
  {
    userId: user.id,
    email: user.email
  },
  "SECRET_KEY",
  { expiresIn: "1h" }
);

return Response.json({
  message: "Login successful",
  token
});

}

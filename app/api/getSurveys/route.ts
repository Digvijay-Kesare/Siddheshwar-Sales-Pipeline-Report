import { supabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

interface TokenPayload {
  userId: string;
  email?: string;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json([]);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return Response.json([]);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const { data, error } = await supabaseServer
      .from("surveys")
      .select("*")
      .eq("userid", decoded.userId);

    if (error) {
      console.error("Fetch surveys DB error:", error);
      return Response.json([]);
    }

    return Response.json(data || []);
  } catch (error: unknown) {
    console.error("GET SURVEYS ERROR:", error);
    return Response.json([]);
  }
}

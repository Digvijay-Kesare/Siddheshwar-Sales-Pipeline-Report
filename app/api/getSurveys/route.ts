import { supabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {

  try {

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json([]);
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, "SECRET_KEY");

    const { data, error } = await supabaseServer
      .from("surveys")
      .select("*")
      .eq("userid", decoded.userId);

    if (error) {
      console.log(error);
      return Response.json([]);
    }

    return Response.json(data);

  } catch (error) {

    console.log("GET SURVEYS ERROR:", error);
    return Response.json([]);

  }

}
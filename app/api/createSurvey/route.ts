import { supabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, "SECRET_KEY");

    const body = await req.json();

    const { data, error } = await supabaseServer
      .from("surveys")
      .insert([
        {
          surveyno: body.surveyNo,
          customer: body.customer,
          village: body.village,
          discharge: body.discharge,
          staticheight: body.staticHeight,
          rows: body.rows,
          totalhead: body.totalHead,
          userid: decoded.userId
        }
      ])
      .select();

    if (error) {
      console.log(error);
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
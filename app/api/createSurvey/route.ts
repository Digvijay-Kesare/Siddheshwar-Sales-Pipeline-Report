import { supabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // Get Authorization Header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    // Verify Token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY"
    );

    // Get Request Body
    const body = await req.json();

    console.log("BODY:", body);

    // Insert Survey
    const { data, error } = await supabaseServer
      .from("surveys")
      .insert({
        customer: body.customer || "",
        village: body.village || "",
        discharge: body.discharge || "",
        staticheight: body.staticHeight || "",
        rows: body.rows || [],
        totalHead: body.totalHead || 0,
        userid: decoded.userId,
      })
      .select()
      .single();

    // Handle Database Error
    if (error) {
      console.error("INSERT ERROR:", error);

      return Response.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log("INSERTED DATA:", data);

    // Success Response
    return Response.json(
      {
        success: true,
        message: "Survey created successfully",
        surveyno: data.surveyno, // Auto-generated survey number
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE SURVEY ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error",
      },
      {
        status: 500,
      }
    );
  }
}
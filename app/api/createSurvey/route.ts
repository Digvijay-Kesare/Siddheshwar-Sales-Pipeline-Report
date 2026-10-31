import { supabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

interface TokenPayload {
  userId: string;
  email?: string;
}

export async function POST(req: Request) {
  try {
    // Get Authorization Header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized - No token provided",
        },
        {
          status: 401,
        }
      );
    }

    // Extract Token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized - Malformed token",
        },
        {
          status: 401,
        }
      );
    }

    // Verify Token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Get Request Body
    const body = await req.json();

    // Insert Survey
    const { data, error } = await supabaseServer
      .from("surveys")
      .insert({
        customer: body.customer || "",
        village: body.village || "",
        discharge: body.discharge || "",
        staticheight: body.staticHeight || body.staticheight || "",
        rows: body.rows || [],
        totalHead: body.totalHead || 0,
        userid: decoded.userId,
      })
      .select()
      .single();

    // Handle Database Error
    if (error) {
      console.error("INSERT SURVEY ERROR:", error);
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

    // Success Response
    return Response.json(
      {
        success: true,
        message: "Survey created successfully",
        surveyno: data.surveyno,
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.error("CREATE SURVEY ERROR:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Server error",
      },
      {
        status: 500,
      }
    );
  }
}

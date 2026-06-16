import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // Get request body
    const body = await req.json();

    console.log("BODY:", body);

    // Create survey object
    const newSurvey = {
      customer: body.customer || "",
      village: body.village || "",
      discharge: body.discharge || "",
      staticheight: body.staticHeight || "",
      rows: body.rows || [],
      totalHead: body.totalHead || 0,
      userid: body.userid || null,
    };

    console.log("NEW SURVEY:", newSurvey);

    // Insert survey
    const { data, error } = await supabase
      .from("surveys")
      .insert(newSurvey)
      .select()
      .single();

    // Handle insert error
    if (error) {
      console.log("INSERT ERROR:", error);

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

    // Success response
    return Response.json(
      {
        success: true,
        message: "Survey saved successfully",
        surveyno: data.surveyno, // Auto-generated value
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("FULL ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
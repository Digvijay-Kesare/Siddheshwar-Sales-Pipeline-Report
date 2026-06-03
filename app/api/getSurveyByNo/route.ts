import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);

    const surveyNo = searchParams.get("surveyNo");

    // Validation
    if (!surveyNo) {

      return Response.json(
        {
          success: false,
          message: "Survey number required"
        },
        {
          status: 400
        }
      );

    }

    // Fetch survey
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("surveyno", Number(surveyNo))
      .limit(1);

    // Error handling
    if (error) {

      console.log("GET SURVEY ERROR:", error);

      return Response.json(
        {
          success: false,
          message: error.message
        },
        {
          status: 500
        }
      );

    }

    // Get first survey safely
    const survey =
      data && data.length > 0
        ? data[0]
        : null;

    // Not found
    if (!survey) {

      return Response.json(
        {
          success: false,
          message: "Survey not found"
        },
        {
          status: 404
        }
      );

    }

    // Success
    return Response.json(survey);

  } catch (error: any) {

    console.log("FULL GET SURVEY ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error"
      },
      {
        status: 500
      }
    );

  }

}
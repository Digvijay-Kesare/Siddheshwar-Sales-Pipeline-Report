import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);

    const surveyno = searchParams.get("surveyno");

    // Validation
    if (!surveyno) {

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

    // Get survey from Supabase
    const { data: survey, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("surveyno", Number(surveyno))
      .single();

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

    return Response.json(survey || null);

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
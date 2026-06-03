import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {

  try {

    // Get latest survey number
    const { data: surveys, error } = await supabase
      .from("surveys")
      .select('"surveyNo"')
      .order("surveyNo", { ascending: false })
      .limit(1);

    // Error handling
    if (error) {

      console.log("SURVEY NO ERROR:", error);

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

    // If no surveys exist
    if (!surveys || surveys.length === 0) {

      return Response.json({
        nextSurveyNo: 1
      });

    }

    // Get latest survey number
    const lastSurveyNo = Number(surveys[0].surveyNo);

    return Response.json({
      nextSurveyNo: lastSurveyNo + 1
    });

  } catch (error: any) {

    console.log("FULL SURVEY NO ERROR:", error);

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
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  try {

    // Get frontend body
    const body = await req.json();

    console.log("BODY:", body);

    // Get latest survey number
    const { data: surveys, error: fetchError } = await supabase
      .from("surveys")
      .select('"surveyNo"')
      .order("surveyNo", { ascending: false })
      .limit(1);

    // Fetch error
    if (fetchError) {

      console.log("FETCH ERROR:", fetchError);

      return Response.json(
        {
          success: false,
          message: fetchError.message
        },
        {
          status: 500
        }
      );

    }

    // Last survey number
    const lastsurveyNo =
      surveys && surveys.length > 0
        ? Number(surveys[0].surveyNo)
        : 0;

    // Create new survey object
    const newSurvey = {

      surveyNo: lastsurveyNo + 1,

      customer: body.customer || "",

      village: body.village || "",

      discharge: body.discharge || "",

      staticheight: body.staticHeight || "",

      rows: body.rows || [],

      totalHead: body.totalHead || 0,

      userid: body.userid || null

    };

    console.log("NEW SURVEY:", newSurvey);

    // Insert into Supabase
    const { data, error: insertError } = await supabase
      .from("surveys")
      .insert([newSurvey])
      .select();

    // Insert error
    if (insertError) {

      console.log("INSERT ERROR:", insertError);

      return Response.json(
        {
          success: false,
          message: insertError.message
        },
        {
          status: 500
        }
      );

    }

    console.log("INSERTED DATA:", data);

    // Success response
    return Response.json(
      {
        success: true,
        message: "Survey saved successfully",
        data
      },
      {
        status: 200
      }
    );

  } catch (error: any) {

    console.log("FULL ERROR:", error);

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
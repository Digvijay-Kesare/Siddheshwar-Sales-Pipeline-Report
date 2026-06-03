import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    // Get latest survey number
    const { data: surveys, error: fetchError } = await supabase
      .from("surveys")
      .select("surveyno")
      .order("surveyno", { ascending: false })
      .limit(1);

    if (fetchError) {

      console.log(fetchError);

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

    // Generate next survey number
    const lastSurveyNo =
      surveys && surveys.length > 0
        ? Number(surveys[0].surveyno)
        : 0;

    // Create survey object
    const newSurvey = {

      surveyno: lastSurveyNo + 1,

      customer: body.customer || "",

      village: body.village || "",

      discharge: body.discharge || "",

      staticheight: body.staticheight || "",

      rows: body.rows || [],

      totalHead: body.totalHead || 0,

      userid: body.userid || null

    };

    // Insert survey
    const { error: insertError } = await supabase
      .from("surveys")
      .insert([newSurvey]);

    if (insertError) {

      console.log(insertError);

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

    return Response.json(
      {
        success: true,
        message: "Survey saved successfully"
      },
      {
        status: 200
      }
    );

  } catch (error: any) {

    console.log("SAVE SURVEY ERROR:", error);

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

}
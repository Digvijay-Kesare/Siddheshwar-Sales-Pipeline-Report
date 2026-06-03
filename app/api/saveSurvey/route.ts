import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    // Get last survey number
    const { data: surveys } = await supabase
      .from("surveys")
      .select("surveyNo")
      .order("surveyNo", { ascending: false })
      .limit(1);

    const lastSurveyNo =
      surveys && surveys.length > 0
        ? Number(surveys[0].surveyNo)
        : 0;

    // New survey object
    const newSurvey = {
      ...body,
      surveyNo: lastSurveyNo + 1
    };

    // Insert into Supabase
    const { error } = await supabase
      .from("surveys")
      .insert([newSurvey]);

    if (error) {

      console.log(error);

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

    return Response.json(
      {
        success: true
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
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: Request) {

  try {

    const { searchParams } = new URL(req.url);

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

    // Delete survey from Supabase
    const { error } = await supabase
      .from("surveys")
      .delete()
      .eq("surveyNo", Number(surveyNo));

    // Error handling
    if (error) {

      console.log("DELETE ERROR:", error);

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
        success: true,
        message: "Survey deleted successfully"
      },
      {
        status: 200
      }
    );

  } catch (error: any) {

    console.log("FULL DELETE ERROR:", error);

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
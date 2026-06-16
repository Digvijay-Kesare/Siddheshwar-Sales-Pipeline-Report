import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    console.log("UPDATE BODY:", body);

    const { surveyno } = body;

    if (!surveyno) {
      return Response.json(
        {
          success: false,
          message: "Survey number is required",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("surveys")
      .update({
        customer: body.customer,
        village: body.village,
        discharge: body.discharge,
        staticheight: body.staticHeight,
        rows: body.rows,
        totalHead: body.totalHead,
        userid: body.userid || null,
      })
      .eq("surveyno", Number(surveyno))
      .select()
      .single();

    if (error) {
      console.log("UPDATE ERROR:", error);

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

    console.log("UPDATED DATA:", data);

    return Response.json(
      {
        success: true,
        message: "Survey updated successfully",
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("FULL UPDATE ERROR:", error);

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
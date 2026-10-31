import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: Request) {
  try {
    const body = await request.json();

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
        customer: body.customer || "",
        village: body.village || "",
        discharge: body.discharge || "",
        staticheight: body.staticHeight || body.staticheight || "",
        rows: body.rows || [],
        totalHead: body.totalHead || 0,
        userid: body.userid || null,
      })
      .eq("surveyno", Number(surveyno))
      .select()
      .single();

    if (error) {
      console.error("UPDATE SURVEY ERROR:", error);
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
    console.error("FULL UPDATE ERROR:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

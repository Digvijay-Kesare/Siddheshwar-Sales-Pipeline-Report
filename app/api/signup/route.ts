import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {

      return Response.json(
        {
          success: false,
          message: "All fields are required"
        },
        {
          status: 400
        }
      );

    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {

      return Response.json(
        {
          success: false,
          message: "User already exists"
        },
        {
          status: 400
        }
      );

    }

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password
        }
      ])
      .select();

    if (error) {

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
        message: "Signup successful",
        user: data
      },
      {
        status: 201
      }
    );

  } catch (err: any) {

    console.log(err);

    return Response.json(
      {
        success: false,
        message: err.message
      },
      {
        status: 500
      }
    );

  }

}
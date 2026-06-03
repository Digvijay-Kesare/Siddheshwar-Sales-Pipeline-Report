import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const { email, password } = body;

    // Validation
    if (!email || !password) {

      return Response.json(
        {
          success: false,
          message: "Email and password required"
        },
        {
          status: 400
        }
      );

    }

    // Find user in Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // User not found
    if (error || !user) {

      return Response.json(
        {
          success: false,
          message: "Invalid email or password"
        },
        {
          status: 401
        }
      );

    }

    // Password check
    if (user.password !== password) {

      return Response.json(
        {
          success: false,
          message: "Invalid email or password"
        },
        {
          status: 401
        }
      );

    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      "SECRET_KEY",
      {
        expiresIn: "1h"
      }
    );

    // Success
    return Response.json(
      {
        success: true,
        message: "Login successful",
        token
      },
      {
        status: 200
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
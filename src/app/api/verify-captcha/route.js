import { NextResponse } from "next/server";

export async function POST(req) {
  const { token } = await req.json();
  const secretKey = "6Le0arsrAAAAADPLZOrPozj7VrEb3dKBBHcPXAZX";

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: "POST" }
  );

  const data = await response.json();

  if (data.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({
      success: false,
      errors: data["error-codes"] || [],
    });
  }
}

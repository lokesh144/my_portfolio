import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";

export const runtime = "nodejs";

// Keep below Netlify's effective binary request limit
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_EXTENSIONS = [
  "txt",
  "html",
  "zip",
  "rar",
];

const CONTENT_TYPES = {
  txt: "text/plain",
  html: "text/html",
  zip: "application/zip",
  rar: "application/vnd.rar",
};

export async function POST(request) {
  let uploadedPath = null;

  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const rollNo = formData.get("rollNo");
    const submissionUrl = formData.get("submissionUrl");
    const file = formData.get("file");

    // -----------------------------------
    // 1. Validate basic fields
    // -----------------------------------

    if (
      typeof name !== "string" ||
      typeof rollNo !== "string" ||
      !file ||
      typeof file.arrayBuffer !== "function"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, roll number and file are required.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanName = name.trim();
    const cleanRoll = rollNo.trim();

    if (!cleanName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name.",
        },
        {
          status: 400,
        }
      );
    }

    if (cleanName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------
    // 2. Validate roll number
    // -----------------------------------

    const numericRoll = Number(cleanRoll);

    if (
      !Number.isInteger(numericRoll) ||
      numericRoll < 1 ||
      numericRoll > 40
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Roll number must be between 1 and 40.",
        },
        {
          status: 400,
        }
      );
    }

    // Store normalized roll
    const normalizedRoll = String(numericRoll);

    // -----------------------------------
    // 3. Validate optional URL
    // -----------------------------------

    let cleanUrl = null;

    if (
      typeof submissionUrl === "string" &&
      submissionUrl.trim() !== ""
    ) {
      try {
        const parsedUrl = new URL(
          submissionUrl.trim()
        );

        if (
          parsedUrl.protocol !== "http:" &&
          parsedUrl.protocol !== "https:"
        ) {
          throw new Error("Invalid protocol");
        }

        cleanUrl = parsedUrl.toString();
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please enter a valid URL beginning with http:// or https://.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // -----------------------------------
    // 4. Validate file
    // -----------------------------------

    const originalFileName = file.name;

    if (!originalFileName) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file.",
        },
        {
          status: 400,
        }
      );
    }

    const extension = originalFileName
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      !extension ||
      !ALLOWED_EXTENSIONS.includes(extension)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only .txt, .html, .zip and .rar files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected file is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The assignment file must be 2 MB or smaller.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------
    // 5. Check existing roll number
    // -----------------------------------

    const {
      data: existingSubmission,
      error: checkError,
    } = await supabaseAdmin
      .from("assignments")
      .select("id")
      .eq("roll_no", normalizedRoll)
      .maybeSingle();

    if (checkError) {
      console.error(
        "Duplicate check error:",
        checkError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to verify your submission.",
        },
        {
          status: 500,
        }
      );
    }

    if (existingSubmission) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An assignment has already been submitted for this roll number.",
        },
        {
          status: 409,
        }
      );
    }

    // -----------------------------------
    // 6. Generate secure Storage filename
    // -----------------------------------

    const uniqueId = randomUUID();

    const storageFileName =
      `roll-${normalizedRoll}-${uniqueId}.${extension}`;

    uploadedPath =
      `submissions/${storageFileName}`;

    // -----------------------------------
    // 7. Convert file to Buffer
    // -----------------------------------

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    // -----------------------------------
    // 8. Upload file to Supabase Storage
    // -----------------------------------

    const {
      data: uploadData,
      error: uploadError,
    } = await supabaseAdmin.storage
      .from("assignments")
      .upload(
        uploadedPath,
        buffer,
        {
          contentType:
            CONTENT_TYPES[extension] ||
            "application/octet-stream",

          upsert: false,
        }
      );

    if (uploadError) {
      console.error(
        "Storage upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to upload your assignment file.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------
    // 9. Save student information
    // -----------------------------------

    const {
      data: submission,
      error: databaseError,
    } = await supabaseAdmin
      .from("assignments")
      .insert({
        name: cleanName,
        roll_no: normalizedRoll,

        submission_url: cleanUrl,

        file_name: originalFileName,
        file_path: uploadedPath,
        file_type: extension,
        file_size: file.size,
      })
      .select("id")
      .single();

    if (databaseError) {
      console.error(
        "Database insert error:",
        databaseError
      );

      // If database save fails,
      // remove already-uploaded file
      await supabaseAdmin.storage
        .from("assignments")
        .remove([uploadedPath]);

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to save your submission.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------
    // 10. Success
    // -----------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Assignment submitted successfully.",
        submissionId: submission.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Assignment API error:",
      error
    );

    // Clean up uploaded file
    // if something unexpected happens
    if (uploadedPath) {
      try {
        await supabaseAdmin.storage
          .from("assignments")
          .remove([uploadedPath]);
      } catch (cleanupError) {
        console.error(
          "Cleanup error:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
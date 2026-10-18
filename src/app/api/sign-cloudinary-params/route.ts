import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth-guard";
import { CLOUDINARY_UPLOAD_FOLDER } from "@/lib/constants";
import { env, isCloudinaryUploadEnabled } from "@/lib/env";

// Signs the upload parameters of next-cloudinary's <CldUploadWidget>.
// The API secret never leaves the server.

const bodySchema = z.object({
  paramsToSign: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    // Only sign uploads into our folder, so the endpoint can't sign arbitrary params.
    .refine((params) => params.folder === CLOUDINARY_UPLOAD_FOLDER, "Invalid folder."),
});

export async function POST(request: Request) {
  // Route handlers return 401 instead of redirecting (the caller is fetch()).
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryUploadEnabled()) {
    return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 503 });
  }

  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const signature = cloudinary.utils.api_sign_request(
    body.data.paramsToSign,
    env.CLOUDINARY_API_SECRET ?? ""
  );

  return NextResponse.json({ signature });
}

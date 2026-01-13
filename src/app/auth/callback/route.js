import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const code = requestUrl.searchParams.get("code");

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component cookie setting will fail, ignore
          }
        },
      },
    }
  );

  let sessionData = null;
  let sessionError = null;

  // Handle email verification dengan token_hash
  if (token_hash && type) {
    const result = await supabase.auth.verifyOtp({
      token_hash,
      type: type,
    });
    sessionData = result.data;
    sessionError = result.error;

    if (sessionError) {
      console.error("Error verifying token:", sessionError);
      return NextResponse.redirect(
        `${requestUrl.origin}/signup/verification-email/error`
      );
    }
  }
  // Handle OAuth callback (Google, etc) dengan code
  else if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    sessionData = result.data;
    sessionError = result.error;

    if (sessionError) {
      console.error("Error exchanging code:", sessionError);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_failed`
      );
    }
  }

  // Proses user data jika session berhasil dibuat
  if (sessionData?.user) {
    const userId = sessionData.user.id;
    const userEmail = sessionData.user.email;

    // Cek apakah user sudah ada di public_user
    const { data: existingUser } = await supabase
      .from("public_user")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    // Jika belum ada, buat entry baru
    if (!existingUser) {
      // Generate username unik
      const username = await generateUniqueUsername(supabase);

      const { error: insertError } = await supabase.from("public_user").insert({
        id: userId,
        email: userEmail,
        username,
      });

      if (insertError) {
        console.error("Error inserting user to public_user:", insertError);
      } else {
        console.log("✅ User berhasil dibuat di public_user:", username);
      }
    } else {
      console.log("✅ User sudah ada di public_user");
    }

    // Redirect langsung ke home karena user sudah login
    return NextResponse.redirect(`${requestUrl.origin}/`);
  }

  // Jika tidak ada parameter yang valid, redirect ke login
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}

// Helper function untuk generate username unik
const generateMVNUsername = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";

  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `user-MVN-${random}`;
};

const generateUniqueUsername = async (supabase) => {
  let username;
  let exists = true;

  while (exists) {
    username = generateMVNUsername();

    const { data, error } = await supabase
      .from("public_user")
      .select("username")
      .eq("username", username)
      .single();

    if (error && error.code === "PGRST116") {
      exists = false;
    } else if (!error && data) {
      exists = true;
    } else if (error) {
      throw error;
    }
  }

  return username;
};

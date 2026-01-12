import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
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

    // Exchange code untuk session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Error exchanging code:", sessionError);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_failed`
      );
    }

    if (sessionData?.user) {
      const userId = sessionData.user.id;
      const userEmail = sessionData.user.email;

      // Cek apakah user sudah ada di public_user
      const { data: existingUser, error: checkError } = await supabase
        .from("public_user")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      // Jika belum ada, buat entry baru
      if (!existingUser) {
        // Generate username unik
        const username = await generateUniqueUsername(supabase);

        const { error: insertError } = await supabase
          .from("public_user")
          .insert({
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
    }
  }

  // Redirect ke homepage setelah berhasil
  return NextResponse.redirect(`${requestUrl.origin}/`);
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

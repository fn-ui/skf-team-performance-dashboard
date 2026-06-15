import { supabase } from "../lib/supabase";


// GET ADMIN PROFILE SETTINGS
export async function getProfileSettings(
  userId
) {

  const { data, error } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        role,
        bio,
        avatar_url,
        phone,
        notifications_enabled,
        dark_mode
      `)
      .eq("id", userId)
      .single();

  if (error) throw error;

  return data;
}


// UPDATE ADMIN PROFILE SETTINGS
export async function updateProfileSettings(
  userId,
  updates
) {

  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        full_name:
          updates.full_name,

        bio:
          updates.bio,

        phone:
          updates.phone,

        avatar_url:
          updates.avatar_url,

        notifications_enabled:
          updates.notifications_enabled,

        dark_mode:
          updates.dark_mode,
      })
      .eq("id", userId)
      .select()
      .single();

  if (error) throw error;

  return data;
}


// UPDATE PASSWORD
export async function updatePassword(
  newPassword
) {

  const { data, error } =
    await supabase.auth.updateUser({
      password: newPassword,
    });

  if (error) throw error;

  return data;
}


// UPLOAD AVATAR
export async function uploadAvatar(
  file,
  userId
) {

  const fileExt =
    file.name.split(".").pop();

  const fileName =
    `${userId}-${Date.now()}.${fileExt}`;

  const filePath =
    `avatars/${fileName}`;

  // UPLOAD FILE
  const {
    error: uploadError,
  } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError)
    throw uploadError;

  // GET PUBLIC URL
  const { data } = supabase
    .storage
    .from("avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
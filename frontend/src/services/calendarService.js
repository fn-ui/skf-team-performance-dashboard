import { supabase } from "../lib/supabase";

// 📦 GET EVENTS
export async function getEvents() {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error(
      "GET EVENTS ERROR:",
      error
    );

    throw error;
  }

  return data;
}

// ➕ CREATE EVENT
export async function createEvent(
  eventData
) {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert([eventData])
    .select()
    .single();

  if (error) {
    console.error(
      "CREATE EVENT ERROR:",
      error
    );

    throw error;
  }

  return data;
}

// ✏️ UPDATE EVENT
export async function updateEvent(
  id,
  updates
) {
  const { data, error } = await supabase
    .from("calendar_events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "UPDATE EVENT ERROR:",
      error
    );

    throw error;
  }

  return data;
}

// 🗑 DELETE EVENT
export async function deleteEvent(id) {
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "DELETE EVENT ERROR:",
      error
    );

    throw error;
  }

  return true;
}
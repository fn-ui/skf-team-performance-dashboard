import { supabase } from "../lib/supabase";

// ========================================
// GET USER NOTIFICATIONS
// ========================================

export const getNotifications =
  async (userId) => {
    try {
      const { data, error } =
        await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        error.message
      );

      return [];
    }
  };

// ========================================
// CREATE NOTIFICATION
// ========================================

export const createNotification =
  async ({
    user_id,
    title,
    message,
    type = "info",
    related_id = null,
    related_type = null,
  }) => {
    try {
      const { data, error } =
        await supabase
          .from("notifications")
          .insert([
            {
              user_id,
              title,
              message,
              type,
              related_id,
              related_type,
            },
          ])
          .select()
          .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(
        "CREATE NOTIFICATION ERROR:",
        error.message
      );

      throw error;
    }
  };

// ========================================
// MARK ONE AS READ
// ========================================

export const markNotificationAsRead =
  async (
    notificationId
  ) => {
    try {
      const { data, error } =
        await supabase
          .from("notifications")
          .update({
            is_read: true,
          })
          .eq("id", notificationId)
          .select()
          .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(
        "MARK AS READ ERROR:",
        error.message
      );

      throw error;
    }
  };

// ========================================
// MARK ALL AS READ
// ========================================

export const markAllNotificationsAsRead =
  async (userId) => {
    try {
      const { error } =
        await supabase
          .from("notifications")
          .update({
            is_read: true,
          })
          .eq("user_id", userId)
          .eq("is_read", false);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(
        "MARK ALL READ ERROR:",
        error.message
      );

      return false;
    }
  };

// ========================================
// DELETE NOTIFICATION
// ========================================

export const deleteNotification =
  async (
    notificationId
  ) => {
    try {
      const { error } =
        await supabase
          .from("notifications")
          .delete()
          .eq("id", notificationId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        error.message
      );

      return false;
    }
  };

// ========================================
// DELETE ALL USER NOTIFICATIONS
// ========================================

export const clearNotifications =
  async (userId) => {
    try {
      const { error } =
        await supabase
          .from("notifications")
          .delete()
          .eq("user_id", userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error(
        "CLEAR NOTIFICATIONS ERROR:",
        error.message
      );

      return false;
    }
  };

// ========================================
// REALTIME SUBSCRIPTION
// ========================================

export const subscribeToNotifications =
  (
    userId,
    callback
  ) => {
    return supabase
      .channel(
        `notifications-${userId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  };
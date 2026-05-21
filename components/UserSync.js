"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    if (user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kindeId: user.id,
          name: `${user.given_name} ${user.family_name}`,
          email: user.email,
        }),
      });
    }
  }, [user]);

  return null;
}
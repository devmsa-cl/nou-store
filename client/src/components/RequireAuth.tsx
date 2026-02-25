import React from "react";
import { useUserStore } from "../store/useStore";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user } = useUserStore();
  if (token && user) {
    return children;
  } else {
    return null;
  }
}

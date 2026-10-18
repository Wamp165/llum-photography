"use client";

import { createContext, useContext } from "react";

const UploadEnabledContext = createContext(false);

/** Set once in the admin layout: true when the Cloudinary variables are configured. */
export function UploadEnabledProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <UploadEnabledContext.Provider value={enabled}>{children}</UploadEnabledContext.Provider>
  );
}

export function useUploadEnabled(): boolean {
  return useContext(UploadEnabledContext);
}

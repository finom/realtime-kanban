"use client";
import { Toaster } from "sonner";
import { ConfirmModalProvider } from "./ConfirmModal";

export default function JsonRenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfirmModalProvider>
      <Toaster position="top-center" richColors />
      {children}
    </ConfirmModalProvider>
  );
}

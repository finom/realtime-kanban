"use client";
import { ConfirmModalProvider } from "./ConfirmModal";

export default function JsonRenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConfirmModalProvider>{children}</ConfirmModalProvider>;
}

"use client";
import { componentsRegistry } from "./registry";
import NoSSR from "react-no-ssr";
import {
  asyncLines,
  claudeLines,
  countLines,
  formLines,
  listLines,
  tableLines,
} from "./examples";
import { getPrompt } from "./getPrompt";

export default function Page() {
  return (
    <NoSSR>
      <pre className="p-4">{getPrompt()}</pre>
      <componentsRegistry.Renderer lines={countLines} />
      <componentsRegistry.Renderer lines={formLines} />
      <componentsRegistry.Renderer lines={listLines} />
      <componentsRegistry.Renderer lines={tableLines} />
      <componentsRegistry.Renderer lines={asyncLines} />
      <componentsRegistry.Renderer lines={claudeLines} />
    </NoSSR>
  );
}

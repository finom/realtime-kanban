"use client";
import { componentRenderers } from "./registry/renderers";
import NoSSR from "react-no-ssr";
import {
  asyncLines,
  claudeLines,
  countLines,
  formLines,
  listLines,
  tableLines,
} from "./examples/index";
import { getPrompt } from "./getPrompt";

export default function Page() {
  return (
    <NoSSR>
      <pre className="p-4">{getPrompt()}</pre>
      <componentRenderers.Renderer lines={countLines} />
      <componentRenderers.Renderer lines={formLines} />
      <componentRenderers.Renderer lines={listLines} />
      <componentRenderers.Renderer lines={tableLines} />
      <componentRenderers.Renderer lines={asyncLines} />
      <componentRenderers.Renderer lines={claudeLines} />
    </NoSSR>
  );
}

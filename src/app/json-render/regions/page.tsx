"use client";
import { componentRenderers } from "../registry/renderers";
import NoSSR from "react-no-ssr";
import { regions } from "../examples/regions";

export default function Page() {
  return (
    <NoSSR>
      <div className="m-8">
      <componentRenderers.Renderer lines={regions.lines} />
      </div>
    </NoSSR>
  );
}

"use client";
import { componentRenderers } from "../registry/renderers";
import NoSSR from "react-no-ssr";
import { regions2 } from "../examples/regions2";

export default function Page() {
  return (
    <NoSSR>
      <div className="m-8">
      <componentRenderers.Renderer lines={regions2.lines} />
      </div>
    </NoSSR>
  );
}

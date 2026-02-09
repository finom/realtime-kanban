"use client";
import { componentRenderers } from "../registry/renderers";
import NoSSR from "react-no-ssr";
import { JsonRenderRPC } from 'vovk-client'
import { useQuery, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';

export default function Page() {
const { data } = useQuery({
    queryKey: JsonRenderRPC.render.queryKey(),
    queryFn: streamedQuery({
      streamFn: async () => await JsonRenderRPC.render({
        interpretAs: 'application/jsonlines',
      }),
    }),
  });
  console.log("data:", data);
  return (
    <NoSSR>
      <componentRenderers.Renderer lines={data ?? []} />
    </NoSSR>
  );
}

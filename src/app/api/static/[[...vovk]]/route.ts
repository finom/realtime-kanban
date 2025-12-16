import { initSegment, generateStaticAPI, get, operation } from "vovk";
import { openapi } from "vovk-client/openapi";

class OpenApiController {
  @operation({
    summary: "OpenAPI spec",
    description: "Get the OpenAPI spec for the app API",
  })
  @get("openapi.json")
  static getSpec = () => openapi;

  @operation({
    summary: "Hello World",
    description: "Get a hello world message",
  })
  @get("hello.json")
  static helloWorld = () => ({ message: "Hello, World!" });
}

const controllers = {
  OpenApiRPC: OpenApiController,
};

export type Controllers = typeof controllers;
console.log('generateStaticAPI(controllers)', generateStaticAPI(controllers));
export function generateStaticParams() {
  return generateStaticAPI(controllers);
}
export const { GET } = initSegment({
  segmentName: "static",
  emitSchema: true,
  controllers,
});

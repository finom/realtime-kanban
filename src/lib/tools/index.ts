import { createLLMTools, type VovkLLMTool } from "vovk";
import { TaskRPC, UserRPC } from "vovk-client";
import timeFunction from "./timeFunction";
import partyFunction from "./partyFunction";

const tools: VovkLLMTool[] = [
  ...createLLMTools({
    modules: { TaskRPC, UserRPC },
  }).tools,
  {
    type: "function",
    name: "get_current_time",
    description: "Gets the current time in the user's timezone",
    parameters: {},
    execute: timeFunction,
  },
  {
    type: "function",
    name: "party_mode",
    description: "Triggers a confetti animation on the page",
    parameters: {},
    execute: partyFunction,
  },
];

export default tools;

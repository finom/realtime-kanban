"use client";
import { useRouter } from "next/navigation";
import { TaskRPC, UserRPC } from "vovk-client";
import { createTool, deriveTools } from "vovk";
import z from "zod";
import useWebRTCAudioSession from "@/hooks/useWebRTCAudioSession";
import getCurrentTime from "@/lib/tools/getCurrentTime";
import partyMode from "@/lib/tools/partyMode";
import Floaty from "./Floaty";


const RealTimeDemo = () => {
  const router = useRouter();
  const { isActive, isTalking, toggleSession } = useWebRTCAudioSession("ash", [
    ...deriveTools({
      modules: { TaskRPC, UserRPC },
    }).tools,
    createTool({
      name: "getCurrentTime",
      description: "Gets the current time in the user's timezone",
      outputSchema: z.object({ time: z.string(), timezone: z.string(), message: z.string() }).meta({ description: "Current time info." }),
      execute: getCurrentTime,
    }),
    createTool({
      name: "partyMode",
      description: "Triggers a confetti animation on the page",
      execute: partyMode,
    }),
    createTool({
      name: "navigateTo",
      description: "Navigates the user to a specified URL within the application.",
      inputSchema: z.object({
        url: z.enum(["/", "/openapi"]).meta({ description: "The URL to navigate to." }),
      }),
      outputSchema: z.string().meta({ description: "Navigation confirmation message." }),
      execute: async ({ url }: { url: string }) => {
        router.push(url);
        return `Navigating to ${url}`;
      },
    }),
    createTool({
      name: "scroll",
      description:
        "Scrolls the page up or down.",
      inputSchema: z.object({
        direction: z.enum(["up", "down"]).meta({ description: "The direction to scroll" }),
        px: z.number().optional().meta({ description: "The number of pixels to scroll. If not provided, scrolls by one viewport height." }),
      }),
      outputSchema: z.object({
        message: z.string().meta({ description: "Scroll action confirmation message." }),
        __preventResponseCreate: z.boolean().meta({ description: "Flag to prevent response creation." }),
      }),
      execute: async ({ direction, px }: { direction: "up" | "down"; px?: number }) => {
        console.log("Scrolling", direction);
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const pxToScroll = px ?? windowHeight;

        window.scrollBy({
          top: direction === "up" ? -pxToScroll : pxToScroll,
          behavior: "smooth",
        });
        return {
          message: `Scrolling ${direction}`,
          __preventResponseCreate: true,
        };
      },
    }),
    createTool({
      name: "getVisiblePageSection",
      description: "Gets the currently visible section of the page",
      outputSchema: z.string().meta({ description: "Visible text content from the page." }),
      execute: async () => {
        function getVisibleText() {
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;

          // Check if an element or its ancestors are hidden from accessibility tree
          function isAccessibilityHidden(element: Element | null): boolean {
            while (element) {
              if (element.getAttribute("aria-hidden") === "true") return true;
              if (element.hasAttribute("hidden")) return true;
              const role = element.getAttribute("role");
              if (role === "presentation" || role === "none") return true;
              const style = window.getComputedStyle(element);
              if (style.display === "none" || style.visibility === "hidden") return true;
              element = element.parentElement;
            }
            return false;
          }

          // Get accessible name from aria-label or aria-labelledby
          function getAccessibleName(element: Element): string {
            const ariaLabel = element.getAttribute("aria-label");
            if (ariaLabel) return ariaLabel;

            const labelledBy = element.getAttribute("aria-labelledby");
            if (labelledBy) {   
              return labelledBy
                .split(/\s+/)
                .map((id) => document.getElementById(id)?.textContent?.trim() || "")
                .filter(Boolean)
                .join(" ");
            }
            
            // For images, use alt text
            if (element.tagName === "IMG") {
              const alt = element.getAttribute("alt");
              if (alt) return alt;
            }

            return "";
          }

          // Get aria-describedby text
          function getDescription(element: Element): string {
            const describedBy = element.getAttribute("aria-describedby");
            if (describedBy) {
              return describedBy
                .split(/\s+/)
                .map((id) => document.getElementById(id)?.textContent?.trim() || "")
                .filter(Boolean)
                .join(" ");
            }
            return "";
          }

          const visibleTexts: string[] = [];
          const processedElements = new Set<Element>();

          // First, collect accessible names and descriptions from elements
          const allElements = document.body.querySelectorAll("*");
          for (const element of allElements) {
            if (isAccessibilityHidden(element)) continue;

            const rect = element.getBoundingClientRect();
            const isInViewport =
              rect.top < viewportHeight &&
              rect.bottom > 0 &&
              rect.left < viewportWidth &&
              rect.right > 0;

            if (!isInViewport) continue;

            const accessibleName = getAccessibleName(element);
            if (accessibleName && !processedElements.has(element)) {
              visibleTexts.push(accessibleName);
              processedElements.add(element);
            }

            const description = getDescription(element);
            if (description) {
              visibleTexts.push(description);
            }
          }

          // Then collect visible text nodes
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode(node) {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                if (isAccessibilityHidden(parent)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
              },
            },
          );

          let node;
          while ((node = walker.nextNode())) {
            const range = document.createRange(); 
            range.selectNode(node);
            const rect = range.getBoundingClientRect();

            if (
              rect.top < viewportHeight &&
              rect.bottom > 0 &&
              rect.left < viewportWidth &&
              rect.right > 0
            ) {
              const text = node.textContent?.trim();
              if (text) {
                visibleTexts.push(text);
              }
            }
          }

          return visibleTexts.join(" ").replace(/\s+/g, " ").trim();
        }

        return getVisibleText();
      },
    }),
    /*createTool({
    /*{
      type: "function",
      name: "getCurrentTime",
      description: "Gets the current time in the user's timezone",
      parameters: {},
      // @ts-ignore
      execute: getCurrentTime,
    },
    {
      type: "function",
      name: "partyMode",
      description: "Triggers a confetti animation on the page",
      parameters: {},
      // @ts-ignore
      execute: partyMode,
    },
    {
      type: "function",
      name: "navigateTo",
      description:
        "Navigates the user to a specified URL within the application.",
      parameters: {
        type: "object",
        properties: {
          body: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "The URL to navigate to.",
                enum: ["/", "/openapi"],
              },
            },
            required: ["url"],
          },
        },
      },

      // @ts-ignore
      execute: async ({ body }: { body: { url: string } }) => {
        router.push(body.url);
        return `Navigating to ${body.url}`;
      },
    },
    {
      type: "function",
      name: "scroll",
      description:
        "Scrolls the page up or down. After executing this, never respond to the user, keep silent!",
      parameters: {
        type: "object",
        properties: {
          body: {
            type: "object",
            properties: {
              direction: {
                type: "string",
                description: "The direction to scroll",
                enum: ["up", "down"],
              },
              px: {
                type: "number",
                description:
                  "The number of pixels to scroll. If not provided, scrolls by one viewport height.",
              },
            },
            required: ["direction"],
          },
        },
        required: ["body"],
      },
      // @ts-ignore
      execute: async ({
        body: { direction, px },
      }: {
        body: { direction: "up" | "down", px?: number };
      }) => {
        console.log("Scrolling", direction);
            const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const pxToScroll = px ?? windowHeight;
 
        window.scrollBy({
          top: direction === "up" ? -pxToScroll : pxToScroll,
          behavior: "smooth",
        });
        return {
          message: `Scrolling ${direction}`,
          __preventResponseCreate: true,
        };
      },
    },
    {
      type: "function",
      name: "getVisiblePageSection",
      description: "Gets the currently visible section of the page",
      parameters: {},
      // @ts-ignore
      execute: async () => {
        function getVisibleText() {
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;

          // Check if an element or its ancestors are hidden from accessibility tree
          function isAccessibilityHidden(element: Element | null): boolean {
            while (element) {
              if (element.getAttribute("aria-hidden") === "true") return true;
              if (element.hasAttribute("hidden")) return true;
              const role = element.getAttribute("role");
              if (role === "presentation" || role === "none") return true;
              const style = window.getComputedStyle(element);
              if (style.display === "none" || style.visibility === "hidden") return true;
              element = element.parentElement;
            }
            return false;
          }

          // Get accessible name from aria-label or aria-labelledby
          function getAccessibleName(element: Element): string {
            const ariaLabel = element.getAttribute("aria-label");
            if (ariaLabel) return ariaLabel;

            const labelledBy = element.getAttribute("aria-labelledby");
            if (labelledBy) {
              return labelledBy
                .split(/\s+/)
                .map((id) => document.getElementById(id)?.textContent?.trim() || "")
                .filter(Boolean)
                .join(" ");
            }

            // For images, use alt text
            if (element.tagName === "IMG") {
              const alt = element.getAttribute("alt");
              if (alt) return alt;
            }

            return "";
          }

          // Get aria-describedby text
          function getDescription(element: Element): string {
            const describedBy = element.getAttribute("aria-describedby");
            if (describedBy) {
              return describedBy
                .split(/\s+/)
                .map((id) => document.getElementById(id)?.textContent?.trim() || "")
                .filter(Boolean)
                .join(" ");
            }
            return "";
          }

          const visibleTexts: string[] = [];
          const processedElements = new Set<Element>();

          // First, collect accessible names and descriptions from elements
          const allElements = document.body.querySelectorAll("*");
          for (const element of allElements) {
            if (isAccessibilityHidden(element)) continue;

            const rect = element.getBoundingClientRect();
            const isInViewport =
              rect.top < viewportHeight &&
              rect.bottom > 0 &&
              rect.left < viewportWidth &&
              rect.right > 0;

            if (!isInViewport) continue;

            const accessibleName = getAccessibleName(element);
            if (accessibleName && !processedElements.has(element)) {
              visibleTexts.push(accessibleName);
              processedElements.add(element);
            }

            const description = getDescription(element);
            if (description) {
              visibleTexts.push(description);
            }
          }

          // Then collect visible text nodes
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode(node) {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                if (isAccessibilityHidden(parent)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
              },
            },
          );

          let node;
          while ((node = walker.nextNode())) {
            const range = document.createRange();
            range.selectNode(node);
            const rect = range.getBoundingClientRect();

            if (
              rect.top < viewportHeight &&
              rect.bottom > 0 &&
              rect.left < viewportWidth &&
              rect.right > 0
            ) {
              const text = node.textContent?.trim();
              if (text) {
                visibleTexts.push(text);
              }
            }
          }

          return visibleTexts.join(" ").replace(/\s+/g, " ").trim();
        }

        return getVisibleText();
      },
    }, */
  ]);

  return (
    <Floaty
      isActive={isActive}
      isTalking={isTalking}
      handleClick={toggleSession}
    />
  );
};

export default RealTimeDemo;

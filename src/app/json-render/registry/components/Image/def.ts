import z from "zod";
import { createAIComponentDef } from "../../../createAIComponentDef";
import { onClickSchema } from "../../shared";

export const ImageDef = createAIComponentDef({
  description:
    "An image component for displaying pictures, photos, or illustrations. Renders an img element with configurable sizing and rounded corners. Use Image for product photos, user-uploaded images, hero banners, thumbnails, or any visual content.",
  propDefs: z.strictObject({
    src: z.string().meta({
      description: "The image URL/source",
    }),
    alt: z.string().default("").meta({
      description: "Alt text for accessibility and fallback display",
    }),
    width: z.string().optional().meta({
      description: "CSS width, e.g. '100%', '200px', '16rem'",
    }),
    height: z.string().optional().meta({
      description: "CSS height, e.g. 'auto', '200px', '16rem'",
    }),
    rounded: z
      .enum(["none", "sm", "md", "lg", "full"])
      .default("md")
      .meta({ description: "Border radius: none, sm, md, lg, full (circle)" }),
    objectFit: z
      .enum(["cover", "contain", "fill", "none"])
      .default("cover")
      .meta({ description: "How the image fits its container" }),
  }),
  callbackDefs: {
    onClick: onClickSchema,
  },
});

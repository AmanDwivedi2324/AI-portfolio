import { z } from "zod";

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const text = (max = 200) => z.string().trim().max(max);
export const requiredText = (max = 200) => z.string().trim().min(1, "Required").max(max);

/**
 * A link or asset reference: empty, an absolute http(s) URL, or a site path
 * such as /uploads/x.webp. Blocks javascript:, data: and protocol-relative URLs.
 */
export const urlOrPath = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v) || (v.startsWith("/") && !v.startsWith("//")),
    "Must be a full URL (https://…) or a path starting with /",
  );

export const stringList = (maxItems, maxLength) =>
  z.array(z.string().trim().min(1).max(maxLength)).max(maxItems);

/** Fields shared by every orderable collection. */
export const orderableFields = {
  order: z.number().int().min(0).optional(),
  visible: z.boolean().optional(),
};

export const idParams = z.object({ id: objectId });

export const reorderBody = z.strictObject({
  ids: z.array(objectId).min(1).max(500),
});

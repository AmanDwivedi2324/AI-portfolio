/**
 * Validate request parts with zod schemas. Parsed (trimmed, typed) values
 * replace the raw input, so controllers only ever see clean data.
 * A ZodError is turned into a 400 response by the error handler.
 *
 *   router.post("/", validate({ body: projectSchema }), controller.create)
 */
export const validate =
  ({ body, params, query }) =>
  (req, _res, next) => {
    if (params) req.params = params.parse(req.params);
    if (body) req.body = body.parse(req.body ?? {});
    // Express 5 makes req.query read-only, so parsed queries live here.
    if (query) req.validQuery = query.parse(req.query);
    next();
  };

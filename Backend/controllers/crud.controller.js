import ApiError from "../utils/ApiError.js";

/**
 * Standard admin CRUD handlers for an orderable collection
 * (projects, skills, experience, education, process steps).
 *
 * @param {import('mongoose').Model} Model
 * @param {string} label  human name used in error messages, e.g. "Project"
 */
export function createCrudController(Model, label) {
  const findOr404 = async (id) => {
    const doc = await Model.findById(id);
    if (!doc) throw ApiError.notFound(`${label} not found`);
    return doc;
  };

  return {
    async list(_req, res) {
      res.json(await Model.find().sort({ order: 1, createdAt: 1 }));
    },

    async get(req, res) {
      res.json(await findOr404(req.params.id));
    },

    async create(req, res) {
      const data = { ...req.body };
      data.order ??= await Model.nextOrder();
      const doc = await Model.create(data);
      res.status(201).json(doc);
    },

    async update(req, res) {
      const doc = await findOr404(req.params.id);
      doc.set(req.body);
      await doc.save();
      res.json(doc);
    },

    async remove(req, res) {
      const doc = await findOr404(req.params.id);
      await doc.deleteOne();
      res.status(204).end();
    },

    /** PATCH /reorder { ids: [...] } — saves the given order (1, 2, 3, …). */
    async reorder(req, res) {
      const { ids } = req.body;
      const found = await Model.countDocuments({ _id: { $in: ids } });
      if (found !== ids.length) throw ApiError.badRequest(`Some ${label.toLowerCase()} ids do not exist`);
      await Model.bulkWrite(
        ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { $set: { order: index + 1 } } } })),
      );
      res.json(await Model.find().sort({ order: 1, createdAt: 1 }));
    },
  };
}

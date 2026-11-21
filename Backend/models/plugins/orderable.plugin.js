/**
 * Adds the fields every CRM collection shares:
 *  - order   position on the site (ascending)
 *  - visible hide an item without deleting it
 * and strips `__v` from JSON output.
 */
export default function orderablePlugin(schema) {
  schema.add({
    order: { type: Number, default: 0, index: true },
    visible: { type: Boolean, default: true },
  });

  schema.set("toJSON", {
    versionKey: false,
    transform: (_doc, ret) => ret,
  });

  schema.statics.nextOrder = async function nextOrder() {
    const last = await this.findOne().sort({ order: -1 }).select("order").lean();
    return (last?.order ?? 0) + 1;
  };
}

import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";

// POST /api/contact — public
export async function createMessage(req, res) {
  const { website, ...data } = req.body;
  // Honeypot filled in → almost certainly a bot. Pretend it worked, store nothing.
  if (website) return res.status(201).json({ ok: true });

  await Message.create(data);
  res.status(201).json({ ok: true });
}

// GET /api/admin/messages?status=all|unread|read
export async function listMessages(req, res) {
  const { status } = req.validQuery;
  const filter = status === "all" ? {} : { read: status === "read" };
  res.json(await Message.find(filter).sort({ createdAt: -1 }).limit(500));
}

// PATCH /api/admin/messages/:id  { read }
export async function updateMessage(req, res) {
  const message = await Message.findByIdAndUpdate(req.params.id, { read: req.body.read }, { returnDocument: "after" });
  if (!message) throw ApiError.notFound("Message not found");
  res.json(message);
}

// DELETE /api/admin/messages/:id
export async function deleteMessage(req, res) {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw ApiError.notFound("Message not found");
  res.status(204).end();
}

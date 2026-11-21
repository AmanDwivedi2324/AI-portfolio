import { getPublicPortfolio } from "../services/portfolio.service.js";

// GET /api/portfolio — public
export async function getPortfolio(_req, res) {
  const payload = await getPublicPortfolio();
  // Let browsers revalidate every time (Express adds an ETag → cheap 304s).
  res.set("Cache-Control", "no-cache");
  res.json(payload);
}

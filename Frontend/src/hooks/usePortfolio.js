import { useContext } from "react";
import { PortfolioContext } from "../contexts/portfolioContext";

/** Portfolio content loaded by <PortfolioProvider>. */
export default function usePortfolio() {
  const value = useContext(PortfolioContext);
  if (!value) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return value;
}

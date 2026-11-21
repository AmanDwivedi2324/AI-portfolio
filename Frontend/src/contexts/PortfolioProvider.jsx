import { useEffect, useState } from "react";
import { PortfolioContext } from "./portfolioContext";
import { getPortfolio } from "../services/portfolio.service";

export default function PortfolioProvider({ children }) {
  const [value, setValue] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    getPortfolio()
      .then((data) => !cancelled && setValue({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setValue({ data: null, loading: false, error }));
    return () => {
      cancelled = true;
    };
  }, []);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

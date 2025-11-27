import MarketOverview from "@/components/Dashboard/MarketOverview";
import PortfolioStats from "@/components/Dashboard/PortfolioStats";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <PortfolioStats />
      <MarketOverview />
    </div>
  );
}

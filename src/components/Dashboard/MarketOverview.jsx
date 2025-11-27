import { mockMarketData } from "@/data/mockMarketData";

export default function MarketOverview() {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Market Overview</h2>
      <div className="space-y-2">
        {mockMarketData.map((item) => (
          <div key={item.name} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span className={item.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
              {item.price.toFixed(2)} ({item.change})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

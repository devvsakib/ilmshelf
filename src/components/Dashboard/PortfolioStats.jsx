export default function PortfolioStats() {
  const stats = [
    { title: "Total Balance", value: "$25,432" },
    { title: "Invested", value: "$18,210" },
    { title: "Profit", value: "+$3,870" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.title} className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">{stat.title}</h3>
          <p className="text-lg font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

import { Users, Trophy, ListChecks, ShieldCheck } from "lucide-react";

export default function OverviewCards() {
  const cards = [
    { title: "Total Teams", value: 16, icon: Users, color: "bg-blue-500" },
    {
      title: "Total Players",
      value: 220,
      icon: ShieldCheck,
      color: "bg-green-500",
    },
    { title: "Matches", value: 48, icon: ListChecks, color: "bg-orange-500" },
    { title: "Active Scorers", value: 6, icon: Trophy, color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 flex items-center gap-4 transition"
        >
          <div className={`p-3 rounded-lg text-white ${card.color}`}>
            <card.icon className="w-6 h-6" />
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              {card.title}
            </p>
            <h2 className="text-2xl font-bold">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

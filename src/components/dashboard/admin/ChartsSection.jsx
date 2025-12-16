import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ChartsSection() {
  // Pie chart — Team win %
  const pieData = {
    labels: ["Team A", "Team B", "Team C", "Team D"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"],
      },
    ],
  };

  // Bar chart — Top run-scoring teams
  const barData = {
    labels: ["Team A", "Team B", "Team C", "Team D"],
    datasets: [
      {
        label: "Runs",
        data: [3200, 2800, 2500, 2100],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold mb-4">Team Win Percentage</h2>
        <Pie data={pieData} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold mb-4">Top Run-Scoring Teams</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}

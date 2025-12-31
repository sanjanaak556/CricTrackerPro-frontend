import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ChartsSection({ charts }) {
  // Pie chart — Team Win Percentage
  const pieData = {
    labels: charts?.teamWinPercentage?.map(item => item._id) || [],
    datasets: [
      {
        data: charts?.teamWinPercentage?.map(item => item.percentage) || [],
        backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
      },
    ],
  };

  // Bar chart — Top Run-Scoring Teams
  const barData = {
    labels: charts?.topRunScoring?.map(item => item.teamName) || [],
    datasets: [
      {
        label: "Total Runs",
        data: charts?.topRunScoring?.map(item => item.totalRuns) || [],
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

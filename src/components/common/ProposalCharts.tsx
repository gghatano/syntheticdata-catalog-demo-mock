import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { DatasetGraph } from "../../types/models";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

function GraphRenderer({ graph }: { graph: DatasetGraph }) {
  const data = { labels: graph.labels, datasets: graph.datasets };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: graph.title } } };

  return (
    <div style={{ height: 300 }}>
      {graph.type === "bar" && <Bar data={data} options={options} />}
      {graph.type === "line" && <Line data={data} options={options} />}
      {graph.type === "pie" && <Pie data={data} options={options} />}
      {graph.type === "doughnut" && <Doughnut data={data} options={options} />}
    </div>
  );
}

export function ProposalCharts({ charts }: { charts: DatasetGraph[] }) {
  if (charts.length === 0) return null;

  return (
    <section className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">分析結果の図表</h2>
      <div className={charts.length === 1 ? "" : "grid gap-6 md:grid-cols-2"}>
        {charts.map((chart) => (
          <div key={chart.id} className="border border-gray-100 rounded-lg p-4">
            <GraphRenderer graph={chart} />
          </div>
        ))}
      </div>
    </section>
  );
}

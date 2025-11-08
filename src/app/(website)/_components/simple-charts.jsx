"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", visitors: 400 },
  { month: "Feb", visitors: 700 },
  { month: "Mar", visitors: 600 },
  { month: "Apr", visitors: 300 },
  { month: "May", visitors: 500 },
  { month: "Jun", visitors: 550 },
];

export default function BarChartCard() {
  return (
    <div className="bg-orange-50 rounded-2xl shadow p-6 w-full max-w-7xl">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900">
        Bar Chart - Multiple
      </h2>
      <p className="text-sm text-gray-500 mb-4">January - June 2025</p>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            barGap={4}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip />
            <Bar
              dataKey="visitors"
              fill="#1e3a8a"
              radius={[6, 6, 0, 0]}
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer text */}
      <div className="mt-4 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <span>
          Trending up by{" "}
          <span className="font-medium text-green-600">5.2%</span> this month
          &#8599;
        </span>
        <span className="mt-1 sm:mt-0 text-gray-400">
          Showing total visitors for the last 6 months
        </span>
      </div>
    </div>
  );
}
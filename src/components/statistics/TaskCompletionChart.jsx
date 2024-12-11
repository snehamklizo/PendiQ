import React from 'react'
import { Line } from 'react-chartjs-2'

const TaskCompletionChart = ({ data, growth }) => {
  const lastWeekAverage = data[data.length - 2]
  const currentTasks = data[data.length - 1]
  const lineColor = currentTasks > lastWeekAverage ? '#4ade80' : '#ef4444'

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: data,
      borderColor: lineColor,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    }]
  }

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false }
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-2 items-center">
        <div className="col-span-2">
          <h6 className="text-md text-gray-500 font-medium mb-1">Task completed</h6>
          <h2 className="text-3xl font-extrabold">{currentTasks}</h2>
          <p className={`text-sm ${growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growth > 0 ? '+' : ''}{growth}% from last week
          </p>
        </div>
        <div className="h-14 w-full">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}

export default TaskCompletionChart 
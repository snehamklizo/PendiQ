import React from 'react'
import { Bar } from 'react-chartjs-2'

const PendingTaskChart = ({ data, growth }) => {
  const currentPendingTasks = data[data.length - 1]
  const pendingTasksColor = '#ff4a00'

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: data,
      backgroundColor: pendingTasksColor,
      borderRadius: 4,
    }]
  }

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `Tasks: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-2 items-end">
        <div className="col-span-2">
          <h6 className="text-md text-gray-500 font-medium mb-1">Pending Tasks</h6>
          <h2 className="text-3xl font-extrabold">{currentPendingTasks}</h2>
          <p className={`text-sm ${growth > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {growth > 0 ? '+' : ''}{growth}% from last week
          </p>
        </div>
        <div className="h-14 w-full">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}

export default PendingTaskChart 
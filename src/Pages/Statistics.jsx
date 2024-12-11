import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
)

import LayoutWithSidebar from '../layouts/LayoutWithSidebar'
import TaskCompletionChart from '../components/statistics/TaskCompletionChart'
import ActiveTasksChart from '../components/statistics/ActiveTasksChart'
import TopTaskCompleter from '../components/statistics/TopTaskCompleter'
import PendingTaskChart from '../components/statistics/PendingTaskChart'
import TaskTrendChart from '../components/statistics/TaskTrendChart'
import TaskTable from '../components/statistics/TaskTable'

const Statistics = () => {
  // Sample data for the last 7 days
  const previousWeekTasks = [12, 13, 12, 13, 14, 13, 15]
  const activeTasksData = [3, 4, 5, 4, 6, 5, 4]
  const pendingTasksData = [5, 6, 4, 7, 5, 8, 6]
  
  // Calculate growth percentages
  const calculateGrowth = (data) => {
    const previous = data[data.length - 2]
    const current = data[data.length - 1]
    return ((current - previous) / previous * 100).toFixed(1)
  }

  return (
    <LayoutWithSidebar>
      <div className="p-1 md:p-4 xl:p-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-6">Statistics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 lg:pb-4">
          <TaskCompletionChart 
            data={previousWeekTasks}
            growth={calculateGrowth(previousWeekTasks)}
          />
          <ActiveTasksChart 
            data={activeTasksData}
            growth={calculateGrowth(activeTasksData)}
          />
          <PendingTaskChart 
            data={pendingTasksData}
            growth={calculateGrowth(pendingTasksData)}
          />
          <TopTaskCompleter />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
          <TaskTrendChart/>
          <TaskTable/>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default Statistics

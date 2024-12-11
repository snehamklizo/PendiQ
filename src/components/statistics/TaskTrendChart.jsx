import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TaskTrendChart = ({ data }) => {
  // Get last 7 days for labels
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };

  const sampleData = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'In Progress',
        data: [4, 3, 5, 2, 6, 3, 4],  // Updated with 7 sample points
        borderColor: '#ffa726',
        backgroundColor: 'rgba(255, 167, 38, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Completed',
        data: [2, 5, 7, 9, 4, 6, 8],  // Updated with 7 sample points
        borderColor: '#66bb6a',
        backgroundColor: 'rgba(102, 187, 106, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Pending',
        data: [3, 2, 4, 1, 5, 2, 3],  // Updated with 7 sample points
        borderColor: '#ef5350',
        backgroundColor: 'rgba(239, 83, 80, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        title: {
            display: true,
            padding: 5,
          },
        labels: {
            usePointStyle: true,  
            pointStyle: 'circle',
            font: {
                family: "'Roboto', sans-serif"
            }
        }
      },
      title: {
        display: false,
        text: 'Task Trends Over Time',
        font: {
          family: "'Roboto', sans-serif"
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks',
          font: {
            family: "'Roboto', sans-serif"
          }
        },
        ticks: {
          font: {
            family: "'Roboto', sans-serif"
          }
        }
      },
      x: {
        title: {
          display: false,
          text: 'Month',
          font: {
            family: "'Roboto', sans-serif"
          }
        },
        ticks: {
          font: {
            family: "'Roboto', sans-serif"
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }} className='mb-6 xl:mb-0 pb-5 xl:pb-0'>
      <h1 className="text-xl font-bold mb-2 md:mb-6">Task Trends</h1>
      <Line options={options} data={data || sampleData} />
    </div>
  );
};

export default TaskTrendChart;
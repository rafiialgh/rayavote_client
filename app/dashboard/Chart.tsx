'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  labels: string[];
  data: number[];
}

function Chart({ labels, data }: ChartProps) {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });
  
  const [chartOptions, setChartOptions] = useState<ChartOptions<'bar'>>({});

  useEffect(() => {
    // Konfigurasi Data
    const formattedData: ChartData<'bar'> = {
      labels: labels,
      datasets: [
        {
          label: 'Total Votes',
          data: data,
          backgroundColor: '#FF8D1D',
          hoverBackgroundColor: '#e0760e',
          borderRadius: 8,
          barThickness: 'flex',
          maxBarThickness: 60,
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#000',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#6b7280',
            font: {
              weight: 'bold'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6',
            tickLength: 10,
          },
          ticks: {
            stepSize: 1,
            color: '#9ca3af',
          },
          border: {
             display: false
          }
        },
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
    };

    setChartData(formattedData);
    setChartOptions(options);
  }, [labels, data]);

  return (
    <div className='w-full h-full'>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default Chart;
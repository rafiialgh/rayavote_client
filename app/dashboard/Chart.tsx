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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataType {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface ChartProps {
  labels: string[];
  data: number[];
}

function Chart({ labels, data }: ChartProps) {
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Data untuk Chart.js
    const chartData = {
      labels: labels, // Menggunakan labels dari props
      datasets: [
        {
          label: 'Voters',
          data: data, // Menggunakan data dari props
          backgroundColor: 'rgba(153, 102, 255, 0.5)', // Warna bar
        },
      ],
    };

    // Opsi untuk Chart.js
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Elections Overview',
        },
      },
    };

    setChartData(chartData); // Set data untuk chart
    setChartOptions(chartOptions); // Set opsi untuk chart
  }, [labels, data]); // Hanya dijalankan ulang jika labels atau data berubah

  return (
    <>
      <div className='w-full max-w-3xl mx-auto'>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
}

export default Chart;

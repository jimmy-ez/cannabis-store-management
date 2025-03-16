"use client";

import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { fetchDataFromFirestore } from '@/service/firestoreService';
import { IProduct } from '@/interface/product.interface';
import { useEffect, useState } from 'react';

Chart.register(...registerables);

export default function Home() {
  const [cannabis, setCannabis] = useState<IProduct[]>([]);

  const [typeCount, setTypeCount] = useState<{ indica: number, sativa: number, hybrid: number }>({ indica: 0, sativa: 0, hybrid: 0 });
  const [isActiveCount, setIsActiveCount] = useState<{ active: number, inactive: number }>({ active: 0, inactive: 0 });

  const fetchProducts = async () => {
    const fetchedProducts = await fetchDataFromFirestore("products");
    const cannabisProducts = fetchedProducts.filter((product: IProduct) => product.isStrain);
    const avaiLable = cannabisProducts.filter((product) => product.isActive);

    setCannabis(cannabisProducts);
    setTypeCount({
      indica: avaiLable.filter((product) => product.cannabis?.type === 'indica').length,
      sativa: avaiLable.filter((product) => product.cannabis?.type === 'sativa').length,
      hybrid: avaiLable.filter((product) => product.cannabis?.type === 'hybrid').length,
    });
    setIsActiveCount({
      active: avaiLable.length,
      inactive: cannabisProducts.length - avaiLable.length,
    });
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const eachTypeData = {
    labels: ["Indica", "Sativa", "Hybrid"],
    datasets: [
      {
        backgroundColor: ['#c2410a', '#0fab79', '#7e22ce'],
        data: [typeCount.indica, typeCount.sativa, typeCount.hybrid],
      },
    ],
  }

  const availableData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        backgroundColor: ["green", "red"],
        data: [isActiveCount.active, isActiveCount.inactive],
      },
    ],
  }

  const doughnutOptions = {
    cutout: '50%', // Donut hole size
    borderAlign: 'inner', // Align the border inside the donut
    borderJoinStyle: 'round', // Rounded corners for the border
    borderCapStyle: 'butt', // No border at the start and end of the arc
    borderDash: [], // No dashes
    borderDashOffset: 0.0, // No offset for dashes
    borderWidth: 0, // No border width
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className={`text-2xl text-white border-b-2 border-cannabis`}>{"DASHBOARD"}</h1>
      </div>
      <div className="mt-4 flex flex-col md:flex-row justify-center gap-16">
        <div>
          <Doughnut data={eachTypeData} options={doughnutOptions} />
        </div>
        <div>
          <Doughnut data={availableData} options={doughnutOptions} />
        </div>
        <div>
          <Doughnut data={eachTypeData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}
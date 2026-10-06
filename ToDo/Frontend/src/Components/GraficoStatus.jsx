import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default function GraficoStatus({ todos }) {
  // 1. Calcula dinamicamente a quantidade de tarefas por situação com base na sua lista real
  const concluidas = todos.filter((t) => t.situacao === "CONCLUIDA").length;
  const pendentes = todos.filter((t) => t.situacao === "PENDENTE").length;
  const canceladas = todos.filter((t) => t.situacao === "CANCELADA").length;

  // Se houver outros status no seu sistema que não sejam esses, você pode tratar aqui ou usar um genérico.

  const [state] = React.useState({
    options: {
      chart: {
        width: 480,
        type: 'pie',
      },
      // 2. Rótulos adaptados para o status das suas tarefas
      labels: ['Concluídas', 'Pendentes', 'Canceladas'],
      // 3. Cores personalizadas para combinar com os badges do seu TodoItem (Verde, Amarelo/Laranja, Vermelho)
      colors: ['#10B981', '#F59E0B', '#EF4444'],
      title: {
        text: 'Status Geral das Tarefas',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#374151',
        },
      },
      legend: {
        position: 'bottom',
        show: true, // Mostramos a legenda para facilitar a leitura das cores
      },
      plotOptions: {
        pie: {
          dataLabels: {
            external: {
              show: true,
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 320,
            },
          },
        },
      ],
    },
  });

  // 4. As séries agora usam os números reais calculados das suas tarefas
  const series = [concluidas, pendentes, canceladas];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 shadow-xs flex flex-col items-center">
      {todos.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">Sem dados suficientes para exibir o gráfico.</p>
      ) : (
        <div id="chart">
          <ReactApexChart
            options={state.options}
            series={series}
            type="pie"
            width={480}
          />
        </div>
      )}
    </div>
  );
}
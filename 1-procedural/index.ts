// Задача: грани кубика => график бросков для 6-24
// Array<number>(6) => chart.js

interface ChartData {
  type: "bar";
  data: {
    datasets: {
      data: number[]; // Array<number>
      label: string;
      backgroundColor: string[];
      borderColor: string[];
    }[];
    labels: string[];
  };
}
interface GroupedResults {
  [rollsToFail: number]: number;
}

const numberOfTries = 1000;
const morales: number[] = new Array(18).fill(null).map((_, i) => i + 6); // 6-24
const die = [1, 1, 2, 2, 3, 3];
const roll = () => die[Math.floor(Math.random() * 6)];

for (let totalMorale = 6; totalMorale <= 24; totalMorale++) {
  const rollsToFail: number[] = [];
  for (let tryNumber = 0; tryNumber < numberOfTries; tryNumber++) {
    let rollToFail: number = 0;
    let morale: number = totalMorale;
    while (morale > 0) {
      morale -= roll();
      rollToFail++;
    }
    rollsToFail.push(rollToFail);
  }
  const rollsToFailGrouped: GroupedResults = rollsToFail.reduce(
    (acc, rollsToFail, index) => {
      const key = String(rollsToFail);
      if (acc[rollsToFail]) {
        acc[key]++;
      } else {
        acc[key] = 1;
      }
      return acc;
    },
    {}
  );
  const labels: string[] = Object.keys(rollsToFailGrouped).sort((key: string) =>
    Number(key)
  );
  const chartData: ChartData = {
    type: "bar",
    data: {
      datasets: [
        {
          data: labels.map((label: string) => rollsToFailGrouped[label]), // Array<number>
          label: "flat",
          backgroundColor: labels.map(() => "rgba(255, 99, 132, 0.2)"),
          borderColor: labels.map(() => "rgba(255,99,132,1)")
        }
      ],
      labels
    }
  };
  const container: HTMLElement = document.getElementById("container");
  const header: HTMLHeadingElement = document.createElement("h2");
  header.innerText = "Мораль: " + totalMorale;
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  container.appendChild(header);
  container.appendChild(canvas);
  const Chart = window["Chart"];
  const chart = new Chart(canvas.getContext("2d"), chartData);
}

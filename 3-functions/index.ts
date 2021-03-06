// Разделим на функции

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
type Roll = () => number;

const numberOfTries = 1000;
const morales: number[] = new Array(18).fill(null).map((_, i) => i + 6); // 6-24

function getRoller(die: number[]): Roll {
  return () => die[Math.floor(Math.random() * 6)];
}

function getRollsToFail(totalMorale: number, roll: Roll): number[] {
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
  return rollsToFail;
}

function getGroupedRolls(rollsToFail: number[]): GroupedResults {
  return rollsToFail.reduce((acc, rollsToFail, index) => {
    const key = String(rollsToFail);
    if (acc[rollsToFail]) {
      acc[key]++;
    } else {
      acc[key] = 1;
    }
    return acc;
  }, {});
}

function getLabels(rollsToFailGrouped: GroupedResults): string[] {
  return Object.keys(rollsToFailGrouped).sort((key: string) => Number(key));
}

function getChartDatas(roll: Roll): ChartData[] {
  return morales.map((totalMorale: number) => {
    const rollsToFail = getRollsToFail(totalMorale, roll);
    const rollsToFailGrouped: GroupedResults = getGroupedRolls(rollsToFail);
    const labels: string[] = getLabels(rollsToFailGrouped);
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
    return chartData;
  });
}

function drawCharts(chartDatas: ChartData[]): void {
  const oldContainer: HTMLElement = document.getElementById("container");
  if (oldContainer) {
    document.body.removeChild(oldContainer);
  }
  const container: HTMLElement = document.createElement("div");
  container.id = "container";
  const Chart = window["Chart"];
  chartDatas.forEach((chartData: ChartData, index: number) => {
    const header: HTMLHeadingElement = document.createElement("h2");
    header.innerText = "Мораль: " + morales[index];
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    container.appendChild(header);
    container.appendChild(canvas);
    const chart = new Chart(canvas.getContext("2d"), chartData);
  });

  document.body.appendChild(container);
}

function onParamsChange(die: number[]): void {
  const roller = getRoller(die);
  const chartDatas: ChartData[] = getChartDatas(roller);
  drawCharts(chartDatas);
}

const faces = [1, 1, 2, 2, 3, 3];
onParamsChange(faces);

for (let face = 0; face <= 5; face++) {
  const input: HTMLElement = document.getElementById(`face${face}`);
  input.addEventListener("input", event => onInputChange(event, face));
}

function onInputChange(event: Event, faceIndex: number): void {
  const value = Number((event.target as HTMLInputElement).value);
  faces[faceIndex] = value;
  onParamsChange(faces);
}

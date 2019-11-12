// Дадим пользователю возможность менять параметры

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

function onParamsChange(die: number[]): void {
  const roll = () => die[Math.floor(Math.random() * 6)];
  const chartDatas: ChartData[] = [];
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
    const labels: string[] = Object.keys(rollsToFailGrouped).sort(
      (key: string) => Number(key)
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
    chartDatas.push(chartData);
  }
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

const faces = [1, 1, 2, 2, 3, 3];
onParamsChange(faces);

for (let face = 0; face <= 5; face++) {
  const input: HTMLElement = document.getElementById(`face${face}`);
  console.log(face, `face${face}`, input);
  input.addEventListener("input", event => onInputChange(event, face));
}

function onInputChange(event: Event, faceIndex: number) {
  const value = Number((event.target as HTMLInputElement).value);
  faces[faceIndex] = value;
  onParamsChange(faces);
}

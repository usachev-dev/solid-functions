// Новое требование: хотим сравнивать несколько кубиков на одном графике

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
type Faces = [number, number, number, number, number, number];
type Roll = () => number;

const numberOfTries = 1000;
const morales: number[] = new Array(18).fill(null).map((_, i) => i + 6); // 6-24

function rand(max: number): number {
  return Math.floor(Math.random() * max + 1);
}

function getRoller(die: Faces): Roll {
  return () => die[Math.floor(Math.random() * 6)];
}

function getRollers(dice: Faces[]): Roll[] {
  return dice.map(getRoller);
}

function getRollToFail(totalMorale: number, roll: Roll): number {
  let rollToFail: number = 0;
  let morale: number = totalMorale;
  while (morale > 0) {
    morale -= roll();
    rollToFail++;
  }
  return rollToFail;
}

function getRollsToFail(totalMorale: number, roll: Roll): number[] {
  const rollsToFail: number[] = [];
  for (let tryNumber = 0; tryNumber < numberOfTries; tryNumber++) {
    rollsToFail.push(getRollToFail(totalMorale, roll));
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

function getGroupedArrayRolls(
  groupedResults: GroupedResults[]
): GroupedResults[] {
  let min = Math.max(...morales),
    max = 1;
  groupedResults.forEach((groupedResult: GroupedResults) => {
    const keys: number[] = Object.keys(groupedResult).map(Number);
    const minKey: number = Math.min(...keys);
    const maxKey: number = Math.max(...keys);
    if (minKey < min) {
      min = minKey;
    }
    if (maxKey > max) {
      max = maxKey;
    }
  });
  const normalizedResults: GroupedResults[] = [];

  groupedResults.forEach((groupedResults: GroupedResults, index: number) => {
    normalizedResults.push({});
    for (let i = min; i <= max; i++) {
      normalizedResults[index][i] = groupedResults[i] || 0;
    }
  });
  return normalizedResults;
}

function getLabels(rollsToFailGrouped: GroupedResults): string[] {
  return Object.keys(rollsToFailGrouped).sort((key: string) => Number(key));
}

function getChartDatas(rolls: Roll[]): ChartData[] {
  const colors: string[] = rolls.map(
    _ => `rgba(${rand(255)}, ${rand(99)}, ${rand(132)}, 0.2)`
  );
  return morales.map((totalMorale: number) => {
    const rollsToFailGrouped: GroupedResults[] = getGroupedArrayRolls(
      rolls.map(roll => getGroupedRolls(getRollsToFail(totalMorale, roll)))
    );
    const labels: string[] = getLabels(rollsToFailGrouped[0]);
    const chartData: ChartData = {
      type: "bar",
      data: {
        datasets: rollsToFailGrouped.map(
          (rolls: GroupedResults, index: number) => ({
            data: labels.map((label: string) => rolls[label]),
            label: `${index}`,
            backgroundColor: labels.map(() => colors[index]),
            borderColor: labels.map(() => `rgba(255,99,132,1)`)
          })
        ),
        labels
      }
    };
    return chartData;
  });
}

function createHeader(totalMorale: number): HTMLHeadingElement {
  const heading: HTMLHeadingElement = document.createElement("h2");
  heading.innerText = `Мораль: ${totalMorale}`;
  return heading;
}

function getContainer(): HTMLElement {
  return document.getElementById("container");
}

function createCanvas(): HTMLCanvasElement {
  return document.createElement("canvas");
}

function createInput(index: number, value: number = 1): HTMLInputElement {
  const input: HTMLInputElement = document.createElement("input");
  input.className = `face${index}`;
  input.type = "number";
  input.value = String(value);
  input.min = String(1);
  return input;
}

function createInputGroup(faces: Faces): HTMLDivElement {
  const group: HTMLDivElement = document.createElement("div");
  faces.forEach((face: number, index: number) => {
    group.appendChild(createInput(index, face));
  });
  group.className = "inputGroup";
  return group;
}

function bindToInputGroup(
  inputGroup: HTMLDivElement,
  onInputChange: (event: Event, faceIndex: number) => void
): void {
  for (let face = 0; face <= 5; face++) {
    const input: HTMLElement = inputGroup.querySelector(`.face${face}`);
    input.addEventListener("input", event => onInputChange(event, face));
  }
}

function bindToInputGroups(
  inputGroups: HTMLDivElement[],
  onInputGroupChange: (
    event: Event,
    groupIndex: number,
    faceIndex: number
  ) => void
) {
  inputGroups.forEach((inputGroup: HTMLDivElement, groupIndex: number) => {
    bindToInputGroup(inputGroup, (event: Event, faceIndex: number) =>
      onInputGroupChange(event, groupIndex, faceIndex)
    );
  });
}

function createContainer(chartDatas: ChartData[]): HTMLDivElement {
  const Chart = window["Chart"];
  const container: HTMLDivElement = document.createElement("div");
  container.id = "container";
  chartDatas.forEach((chartData: ChartData, index: number) => {
    const header = createHeader(morales[index]);
    const canvas: HTMLCanvasElement = createCanvas();
    container.appendChild(header);
    container.appendChild(canvas);
    const chart = new Chart(canvas.getContext("2d"), chartData);
  });
  return container;
}

function createInputGroups(faces: Faces[]): HTMLDivElement[] {
  return faces.map(createInputGroup);
}

function createAddButton(onClick: (event: Event) => void): HTMLButtonElement {
  const button: HTMLButtonElement = document.createElement("button");
  button.addEventListener("click", onClick);
  button.innerText = "добавить кубик";
  return button;
}

function renderFaces(faces: Faces[]): void {
  function renderContainer(chartDatas: ChartData[]): void {
    const container: HTMLDivElement = createContainer(chartDatas);
    const oldContainer: HTMLElement = getContainer();
    if (oldContainer) {
      document.body.removeChild(oldContainer);
    }
    document.body.appendChild(container);
  }
  function renderInputGroups(inputGrups: HTMLDivElement[]): void {
    const oldGroups: NodeListOf<HTMLDivElement> = document.querySelectorAll<
      HTMLDivElement
    >(".inputGroup");
    if (oldGroups) {
      oldGroups.forEach((inputGroup: HTMLDivElement) =>
        document.body.removeChild(inputGroup)
      );
    }
    inputGrups.forEach(g => document.body.appendChild(g));
  }

  function onInputGroupChange(
    event: Event,
    groupIndex: number,
    faceIndex: number
  ): void {
    const value = Number((event.target as HTMLInputElement).value);
    faces[groupIndex][faceIndex] = value;
    onParamsChange(faces);
  }
  function onParamsChange(dice: Faces[]): void {
    renderContainer(getChartDatas(getRollers(dice)));
  }
  const inputGroups: HTMLDivElement[] = createInputGroups(faces);
  renderInputGroups(inputGroups);
  bindToInputGroups(inputGroups, onInputGroupChange);
  onParamsChange(faces);
}

function main() {
  const defaultDie: Faces = [1, 1, 2, 2, 3, 3];
  const dice: Faces[] = [[1, 1, 2, 2, 3, 3], [1, 2, 2, 2, 2, 3]];
  function onAddClick() {
    dice.push(defaultDie);
    renderFaces(dice);
  }
  function renderAddButton(): void {
    document.body.appendChild(createAddButton(onAddClick));
  }

  renderAddButton();
  renderFaces(dice);
}
main();

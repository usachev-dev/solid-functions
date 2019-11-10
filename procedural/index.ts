// Задача: грани кубика => график бросков
// Array<number>[6] => chart.js

function rand(n: number): number {
  return Math.floor(Math.random() * n);
}

function rollFlat(): number {
  const result = [1, 2, 3][rand(3)];
  return result;
}

function rollSkewed(): number {
  return [1, 2, 2, 2, 2, 3][rand(6)];
}

const morales: number[] = new Array(18).fill(null).map((_, i) => i + 6); //6-24

function getRollsToFail(startMorale: number, roll: () => number): number {
  let result: number = 0;
  let morale: number = startMorale;
  while (morale > 0) {
    morale -= roll();
    result++;
  }
  return result;
}

const numberOfTries = 1000;

function getRollsToFailSkewed(startMorale: number): number[] {
  return new Array(numberOfTries)
    .fill(null)
    .map(() => getRollsToFail(startMorale, rollSkewed));
}

function getRollsToFailFlat(startMorale: number): number[] {
  return new Array(numberOfTries)
    .fill(null)
    .map(() => getRollsToFail(startMorale, rollFlat));
}

type Results = { [startMorale: number]: number[] };

function getResults(getRolls: (startMorale: number) => number[]): Results {
  return morales.reduce((acc, startMorale, index) => {
    return {
      ...acc,
      [startMorale]: getRolls(startMorale)
    };
  }, {});
}

function getResultsFlat(): Results {
  return getResults(getRollsToFailFlat);
}

function getResultsSkewed(): Results {
  return getResults(getRollsToFailSkewed);
}

type Report = { [startMorale: number]: { [rolls: number]: number } };

function getReport(getResults: () => Results): Report {
  const results: Results = getResults();
  return Object.keys(results)
    .map(Number)
    .reduce((acc, startMorale: number, index: number) => {
      return {
        ...acc,
        [startMorale]: results[startMorale].reduce(
          (ac, rolls: number, index: number) => {
            if (Object.keys(ac).includes(rolls.toString())) {
              ac[rolls]++;
            } else {
              ac[rolls] = 1;
            }
            return ac;
          },
          {}
        )
      };
    }, {});
}

const reportFlat = getReport(getResultsFlat);
const reportSkewed = getReport(getResultsSkewed);
console.log(reportFlat);
console.log(reportSkewed);

const Chart = window["Chart"];

const container: HTMLElement = document.getElementById("container");

Object.keys(reportFlat).forEach((startMorale: string) => {
  const header: HTMLHeadingElement = document.createElement("h2");
  header.innerText = "Мораль: " + startMorale;
  const canvas: HTMLCanvasElement = document.createElement("canvas");

  container.appendChild(header);
  container.appendChild(canvas);

  const dataFlat: number[] = Object.keys(reportFlat[startMorale]).map(
    key => reportFlat[startMorale][key]
  );
  const dataSkewed: number[] = Object.keys(reportSkewed[startMorale]).map(
    key => reportSkewed[startMorale][key]
  );
  const labels: string[] = Object.keys(reportFlat[startMorale]);

  console.log(dataFlat, labels);

  const chart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      datasets: [
        {
          data: dataFlat, // Array<number>
          label: "flat",
          backgroundColor: labels.map(() => "rgba(255, 99, 132, 0.2)"),
          borderColor: labels.map(() => "rgba(255,99,132,1)")
        },
        {
          data: dataSkewed, // Array<number>
          label: "skewed",
          backgroundColor: labels.map(() => "rgba(54, 162, 235, 0.2)"),
          borderColor: labels.map(() => "rgba(54, 162, 235)")
        }
      ],
      labels
    }
  });
});

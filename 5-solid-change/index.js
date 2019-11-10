// Новое требование: хотим сравнивать несколько кубиков на одном графике
var numberOfTries = 1000;
var morales = new Array(18).fill(null).map(function (_, i) { return i + 6; }); // 6-24
function rand(max) {
    return Math.floor(Math.random() * max + 1);
}
function getRoller(die) {
    return function () { return die[Math.floor(Math.random() * 6)]; };
}
function getRollers(dice) {
    return dice.map(getRoller);
}
function getRollToFail(totalMorale, roll) {
    var rollToFail = 0;
    var morale = totalMorale;
    while (morale > 0) {
        morale -= roll();
        rollToFail++;
    }
    return rollToFail;
}
function getRollsToFail(totalMorale, roll) {
    var rollsToFail = [];
    for (var tryNumber = 0; tryNumber < numberOfTries; tryNumber++) {
        rollsToFail.push(getRollToFail(totalMorale, roll));
    }
    return rollsToFail;
}
function getGroupedRolls(rollsToFail) {
    return rollsToFail.reduce(function (acc, rollsToFail, index) {
        var key = String(rollsToFail);
        if (acc[rollsToFail]) {
            acc[key]++;
        }
        else {
            acc[key] = 1;
        }
        return acc;
    }, {});
}
function getGroupedArrayRolls(groupedResults) {
    var min = Math.max.apply(Math, morales), max = 1;
    groupedResults.forEach(function (groupedResult) {
        var keys = Object.keys(groupedResult).map(Number);
        var minKey = Math.min.apply(Math, keys);
        var maxKey = Math.max.apply(Math, keys);
        if (minKey < min) {
            min = minKey;
        }
        if (maxKey > max) {
            max = maxKey;
        }
    });
    var normalizedResults = [];
    groupedResults.forEach(function (groupedResults, index) {
        normalizedResults.push({});
        for (var i = min; i <= max; i++) {
            normalizedResults[index][i] = groupedResults[i] || 0;
        }
    });
    return normalizedResults;
}
function getLabels(rollsToFailGrouped) {
    return Object.keys(rollsToFailGrouped).sort(function (key) { return Number(key); });
}
function getChartDatas(rolls) {
    var colors = rolls.map(function (_) { return "rgba(" + rand(255) + ", " + rand(99) + ", " + rand(132) + ", 0.2)"; });
    return morales.map(function (totalMorale) {
        var rollsToFailGrouped = getGroupedArrayRolls(rolls.map(function (roll) { return getGroupedRolls(getRollsToFail(totalMorale, roll)); }));
        var labels = getLabels(rollsToFailGrouped[0]);
        var chartData = {
            type: "bar",
            data: {
                datasets: rollsToFailGrouped.map(function (rolls, index) { return ({
                    data: labels.map(function (label) { return rolls[label]; }),
                    label: "" + index,
                    backgroundColor: labels.map(function () { return colors[index]; }),
                    borderColor: labels.map(function () { return "rgba(255,99,132,1)"; })
                }); }),
                labels: labels
            }
        };
        return chartData;
    });
}
function createHeader(totalMorale) {
    var heading = document.createElement("h2");
    heading.innerText = "\u041C\u043E\u0440\u0430\u043B\u044C: " + totalMorale;
    return heading;
}
function getContainer() {
    return document.getElementById("container");
}
function createCanvas() {
    return document.createElement("canvas");
}
function createInput(index, value) {
    if (value === void 0) { value = 1; }
    var input = document.createElement("input");
    input.className = "face" + index;
    input.type = "number";
    input.value = String(value);
    input.min = String(1);
    return input;
}
function createInputGroup(faces) {
    var group = document.createElement("div");
    faces.forEach(function (face, index) {
        group.appendChild(createInput(index, face));
    });
    group.className = "inputGroup";
    return group;
}
function bindToInputGroup(inputGroup, onInputChange) {
    var _loop_1 = function (face) {
        var input = inputGroup.querySelector(".face" + face);
        input.addEventListener("input", function (event) { return onInputChange(event, face); });
    };
    for (var face = 0; face <= 5; face++) {
        _loop_1(face);
    }
}
function bindToInputGroups(inputGroups, onInputGroupChange) {
    inputGroups.forEach(function (inputGroup, groupIndex) {
        bindToInputGroup(inputGroup, function (event, faceIndex) {
            return onInputGroupChange(event, groupIndex, faceIndex);
        });
    });
}
function createContainer(chartDatas) {
    var Chart = window["Chart"];
    var container = document.createElement("div");
    container.id = "container";
    chartDatas.forEach(function (chartData, index) {
        var header = createHeader(morales[index]);
        var canvas = createCanvas();
        container.appendChild(header);
        container.appendChild(canvas);
        var chart = new Chart(canvas.getContext("2d"), chartData);
    });
    return container;
}
function createInputGroups(faces) {
    return faces.map(createInputGroup);
}
function createAddButton(onClick) {
    var button = document.createElement("button");
    button.addEventListener("click", onClick);
    button.innerText = "добавить кубик";
    return button;
}
function renderFaces(faces) {
    function renderContainer(chartDatas) {
        var container = createContainer(chartDatas);
        var oldContainer = getContainer();
        if (oldContainer) {
            document.body.removeChild(oldContainer);
        }
        document.body.appendChild(container);
    }
    function renderInputGroups(inputGrups) {
        var oldGroups = document.querySelectorAll(".inputGroup");
        if (oldGroups) {
            oldGroups.forEach(function (inputGroup) {
                return document.body.removeChild(inputGroup);
            });
        }
        inputGrups.forEach(function (g) { return document.body.appendChild(g); });
    }
    function onInputGroupChange(event, groupIndex, faceIndex) {
        var value = Number(event.target.value);
        faces[groupIndex][faceIndex] = value;
        onParamsChange(faces);
    }
    function onParamsChange(dice) {
        renderContainer(getChartDatas(getRollers(dice)));
    }
    var inputGroups = createInputGroups(faces);
    renderInputGroups(inputGroups);
    bindToInputGroups(inputGroups, onInputGroupChange);
    onParamsChange(faces);
}
function main() {
    var defaultDie = [1, 1, 2, 2, 3, 3];
    var dice = [[1, 1, 2, 2, 3, 3], [1, 2, 2, 2, 2, 3]];
    function onAddClick() {
        dice.push(defaultDie);
        renderFaces(dice);
    }
    function renderAddButton() {
        document.body.appendChild(createAddButton(onAddClick));
    }
    renderAddButton();
    renderFaces(dice);
}
main();

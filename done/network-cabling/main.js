const xArr = [];
const yArr = [];

const N = parseInt(readline());
for (let i = 0; i < N; i++) {
    var inputs = readline().split(' ');
    const X = parseInt(inputs[0]);
    const Y = parseInt(inputs[1]);
    xArr.push(X);
    yArr.push(Y);
}

const xStart = Math.min(...xArr);
const xEnd = Math.max(...xArr);
const yMiddle = yArr.sort((a, b) => a - b)[Math.floor(yArr.length / 2)];

const length = (xEnd - xStart) + yArr.reduce((s, e) => s + Math.abs(yMiddle - e), 0);

console.log(length);
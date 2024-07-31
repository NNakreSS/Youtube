const game_canvas = document.querySelector('#game_canvas');
const line_canvas = document.querySelector('#line_canvas');

const gameCtx = game_canvas.getContext('2d');
const lineCtx = line_canvas.getContext('2d')

const canvasWidth = game_canvas.clientWidth;
const canvasHeight = game_canvas.clientHeight;

const radius = (canvasWidth / 2) - 1;
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;

const circleDegree = 360;
let currentDegree = 0;

const colors = [
    "#f4fc03",
    "#fc9803",
    "#fc6f03",
    "#fc0303"
]

class Game {
    constructor() { }

    drawCircle(circleWidth = 20) {
        gameCtx.beginPath();
        gameCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        gameCtx.strokeStyle = "black"
        gameCtx.stroke();
        gameCtx.closePath();

        gameCtx.beginPath();
        gameCtx.arc(centerX, centerY, radius - circleWidth, 0, 2 * Math.PI, false);
        gameCtx.strokeStyle = "black";
        gameCtx.stroke();
        gameCtx.closePath();

        gameCtx.beginPath();
        gameCtx.arc(centerX, centerY, 5, 0, 2 * Math.PI, false);
        gameCtx.fill();
        gameCtx.closePath();
    }

    drawLine() {
        const radian = this.getRadianToDegree(currentDegree);
        const endX = centerX + (radius * Math.cos(radian));
        const endY = centerY + (radius * Math.sin(radian));
        lineCtx.beginPath();
        lineCtx.moveTo(centerX, centerY);
        lineCtx.lineTo(endX, endY);
        lineCtx.strokeStyle = "black"
        lineCtx.lineWidth = 2;
        lineCtx.stroke();
        lineCtx.closePath();

        requestAnimationFrame(() => {
            ++currentDegree
            this.updateLine(currentDegree)
        });
    }

    updateLine(degree) {
        const radian = this.getRadianToDegree(degree);
        const endX = centerX + (radius * Math.cos(radian));
        const endY = centerY + (radius * Math.sin(radian));
        lineCtx.clearRect(0, 0, canvasWidth, canvasHeight)
        lineCtx.beginPath();
        lineCtx.moveTo(centerX, centerY);
        lineCtx.lineTo(endX, endY);
        lineCtx.strokeStyle = "black"
        lineCtx.lineWidth = 2;
        lineCtx.stroke();
        lineCtx.closePath();
    }

    getRadianToDegree(degree) {
        return degree * (Math.PI / 180)
    }

    drawAreas(areas) {
        const currentAreas = areas ? areas : this.getRandomAreas();
        currentAreas.forEach(area => {
            gameCtx.beginPath();
            gameCtx.arc(centerX, centerY, radius - 10, area.start, area.end, false)
            gameCtx.strokeStyle = area.color
            gameCtx.lineWidth = 20
            gameCtx.stroke();
            gameCtx.closePath();
        });
    }

    getRandomAreas(areaWidth = 15) {
        const areaWidthRadian = this.getRadianToDegree(areaWidth);
        const areas = [];
        const randomDegree = Math.random() * circleDegree;
        const startAngle = this.getRadianToDegree(randomDegree);
        const endAngle = startAngle + areaWidthRadian;
        areas.push({
            start: startAngle,
            end: endAngle,
            color: colors[0]
        })

        for (let index = 0; index < 3; index++) {
            const previousArea = areas[index];
            const newStartAngle = previousArea.end;
            const newEndAngle = newStartAngle + areaWidthRadian;
            areas.push({
                start: newStartAngle,
                end: newEndAngle,
                color: colors[index + 1]
            })
        }

        return areas;
    }
}

const game = new Game();
game.drawCircle()
game.drawLine()
game.drawAreas();
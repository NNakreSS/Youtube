const gameCanvas = document.querySelector('#game_canvas')
const lineCanvas = document.querySelector('#line_canvas')

// Oyun için sabit değerleri tutan sınıf
class Constants {
    static PI = Math.PI;
    static CIRCLE_WIDTH = 20;
    static CIRCLE_DEGREE = 360;
    static COLORS = ["#deeb34", "#ebc934", "#eb9f34", "#eb7434", "#eb3434"];
}

class Game {
    constructor(gameCanvas, lineCanvas) {
        if (!gameCanvas || !lineCanvas) {
            return alert("Oyun alanı bulunamadı")
        }
        this.currentDegree = 0;

        this.gameCtx = gameCanvas.getContext('2d');
        this.lineCtx = lineCanvas.getContext('2d');

        this.canvasWidth = gameCanvas.clientWidth;
        this.canvasHeight = gameCanvas.clientHeight

        this.centerX = this.canvasWidth / 2;
        this.centerY = this.canvasHeight / 2;
        this.radius = (gameCanvas.clientHeight / 2) - 1;
    }

    start() {
        this.#drawCircle()
        this.drawLine()
        setInterval(() => {
            this.#updateLine()
        }, 30)

        const areas = this.getRandomAreas(10)
        areas.forEach(area => {
            this.drawArea(area.startAngle, area.endAngle, area.color);
        })
    }

    #drawCircle() {
        this.gameCtx.beginPath();
        this.gameCtx.arc(this.centerX, this.centerY, this.radius, 0, 2 * CONSTANTS.PI, false);
        this.gameCtx.strokeStyle = "black";
        this.gameCtx.stroke();
        this.gameCtx.closePath();
        // inner circle
        this.gameCtx.beginPath();
        this.gameCtx.arc(this.centerX, this.centerY, this.radius - CONSTANTS.CircleWidth, 0, 2 * CONSTANTS.PI, false);
        this.gameCtx.strokeStyle = "black";
        this.gameCtx.stroke();
        this.gameCtx.closePath();
        // dot
        this.gameCtx.beginPath();
        this.gameCtx.arc(this.centerX, this.centerY, 5, 0, 2 * CONSTANTS.PI, false);
        this.gameCtx.fill();
        this.gameCtx.closePath();
    }

    drawLine() {
        const radian = getRadianToDegree(this.currentDegree);
        const endX = this.centerX + this.radius * Math.cos(radian);
        const endY = this.centerY + this.radius * Math.sin(radian);

        this.lineCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.lineCtx.beginPath();
        this.lineCtx.moveTo(this.centerX, this.centerY);
        this.lineCtx.lineTo(endX, endY)
        this.lineCtx.strokeStyle = "black";
        this.lineCtx.stroke();
        this.lineCtx.closePath();
    }

    #updateLine() {
        this.currentDegree = (this.currentDegree + 1) % 360
        this.drawLine();
    }

    drawArea(startAngle, endAngle, color) {
        this.gameCtx.beginPath();
        this.gameCtx.arc(this.centerX, this.centerY, this.radius - (CONSTANTS.CircleWidth / 2), startAngle, endAngle, false);
        this.gameCtx.strokeStyle = color;
        this.gameCtx.lineWidth = CONSTANTS.CircleWidth
        this.gameCtx.stroke();
        this.gameCtx.closePath();
    }

    getRandomAreas(areaWidth = 20) {
        const areas = [];
        const areaWidthRadian = getRadianToDegree(areaWidth);
        const randomDegree = CONSTANTS.CircleDegree * Math.random();
        const startAngle = getRadianToDegree(randomDegree);
        const endAngle = startAngle + areaWidthRadian
        areas.push({ startAngle, endAngle, color: CONSTANTS.Colors[0] })
        for (let index = 0; index < 4; index++) {
            const previousArea = areas[index];
            const newStartAngle = previousArea.endAngle;
            const newEndAngle = newStartAngle + areaWidthRadian;
            areas.push({ startAngle: newStartAngle, endAngle: newEndAngle, color: CONSTANTS.Colors[index + 1] })
        }

        return areas;
    }
}

function getRadianToDegree(degree) {
    return degree * (CONSTANTS.PI / 180)
}

const game = new Game(gameCanvas, lineCanvas);
game.start();
// Oyun için sabit değerleri tutan sınıf
class Constants {
    static PI = Math.PI;
    static CIRCLE_WIDTH = 20;
    static CIRCLE_DEGREE = 360;
    static COLORS = ["#deeb34", "#ebc934", "#eb9f34", "#eb7434", "#eb3434"];
}

// verilen id üzerinden canvas değerine erişip initial değişkenleri oluşturan bir sınıf
class Canvas {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        if (!this.canvas) throw new Error(`${canvasId} ile canvas bulunamadı!`);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.radius = (this.height / 2) - 1;
    }
}

// Çemberi çizen sınıf
class Circle {
    constructor(canvas) {
        this.canvas = canvas;
    }

    // Ana çember çizim metodu
    draw() {
        this.#drawOuterCircle();
        this.#drawInnerCircle();
        this.#drawCenterDot();
    }

    // Dış çemberi çizer
    #drawOuterCircle() {
        this.#drawArc(this.canvas.radius, "black");
    }

    // İç çemberi çizer
    #drawInnerCircle() {
        this.#drawArc(this.canvas.radius - Constants.CIRCLE_WIDTH, "black");
    }

    // Merkez noktayı çizer
    #drawCenterDot() {
        this.canvas.ctx.beginPath();
        this.canvas.ctx.arc(this.canvas.centerX, this.canvas.centerY, 5, 0, 2 * Constants.PI, false);
        this.canvas.ctx.fill();
        this.canvas.ctx.closePath();
    }

    // Yardımcı ark çizim metodu
    #drawArc(radius, color) {
        this.canvas.ctx.beginPath();
        this.canvas.ctx.arc(this.canvas.centerX, this.canvas.centerY, radius, 0, 2 * Constants.PI, false);
        this.canvas.ctx.strokeStyle = color;
        this.canvas.ctx.stroke();
        this.canvas.ctx.closePath();
    }
}

// Dönen çizgiyi yöneten sınıf
class Line {
    constructor(canvas) {
        this.canvas = canvas;
        this.currentDegree = 0;
    }

    // Çizgiyi çizer
    draw() {
        const radian = this.#degreeToRadian(this.currentDegree);
        const endX = this.canvas.centerX + this.canvas.radius * Math.cos(radian);
        const endY = this.canvas.centerY + this.canvas.radius * Math.sin(radian);

        this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(this.canvas.centerX, this.canvas.centerY);
        this.canvas.ctx.lineTo(endX, endY);
        this.canvas.ctx.strokeStyle = "black";
        this.canvas.ctx.stroke();
        this.canvas.ctx.closePath();
    }

    // Çizginin pozisyonunu günceller
    update() {
        this.currentDegree = (this.currentDegree + 1) % 360;
        this.draw();
    }

    // Dereceyi radyana çevirir
    #degreeToRadian(degree) {
        return degree * (Constants.PI / 180);
    }
}

class Game {
    constructor(gameCanvasId, lineCanvasId) {
        this.currentDegree = 0;

        this.gameCanvas = new Canvas(gameCanvasId);
        this.lineCanvas = new Canvas(lineCanvasId);

        this.circle = new Circle(this.gameCanvas);
        this.line = new Line(this.lineCanvas);
    }

    start() {
        // this.#drawCircle()
        this.drawLine()
        setInterval(() => {
            this.#updateLine()
        }, 30)

        const areas = this.getRandomAreas(10)
        areas.forEach(area => {
            this.drawArea(area.startAngle, area.endAngle, area.color);
        })
    }

    // #drawCircle() {
    //     this.gameCtx.beginPath();
    //     this.gameCtx.arc(this.centerX, this.centerY, this.radius, 0, 2 * CONSTANTS.PI, false);
    //     this.gameCtx.strokeStyle = "black";
    //     this.gameCtx.stroke();
    //     this.gameCtx.closePath();
    //     // inner circle
    //     this.gameCtx.beginPath();
    //     this.gameCtx.arc(this.centerX, this.centerY, this.radius - CONSTANTS.CircleWidth, 0, 2 * CONSTANTS.PI, false);
    //     this.gameCtx.strokeStyle = "black";
    //     this.gameCtx.stroke();
    //     this.gameCtx.closePath();
    //     // dot
    //     this.gameCtx.beginPath();
    //     this.gameCtx.arc(this.centerX, this.centerY, 5, 0, 2 * CONSTANTS.PI, false);
    //     this.gameCtx.fill();
    //     this.gameCtx.closePath();
    // }

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
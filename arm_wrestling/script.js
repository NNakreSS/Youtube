// Oyun için sabit değerleri tutan sınıf
class Constants {
    static PI = Math.PI;
    // alanları kapsayan iki çember arasındaki mesafe
    static CIRCLE_WIDTH = 20;
    // bir çemberin toplam derecesi
    static CIRCLE_DEGREE = 360;
    // alanların renkleri
    static COLORS = ["#deeb34", "#ebc934", "#eb9f34", "#eb7434", "#eb3434"];
}

// Trigonometri radyan ve derece işlemleri için yardımcı sınıf
class MathHelper {
    // derece olarak verilen değeri radyan olarak döner
    static degreeToRadian(degree) {
        return degree * (Math.PI / 180);
    }

    // radyan olarak verilen değeri derece olarak döner
    static radianToDegree(radian) {
        return radian * (180 / Math.PI);
    }
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

    // Canvas contexte çember zizen method
    #drawArc(radius, color) {
        this.canvas.ctx.beginPath();
        this.canvas.ctx.arc(this.canvas.centerX, this.canvas.centerY, radius, 0, 2 * Constants.PI, false);
        this.canvas.ctx.strokeStyle = color;
        this.canvas.ctx.stroke();
        this.canvas.ctx.closePath();
    }
}

// Dönen takip çizgisini çizen ve yöneten sınıf
class Line {
    constructor(canvas) {
        this.canvas = canvas;
        this.currentDegree = 0;
    }

    // Çizgiyi çizer
    draw() {
        // dereceyi radyan olarka alır
        const radian = MathHelper.degreeToRadian(this.currentDegree);

        // bir kordinat düzlemindeki çemberin istenen bir açı üzerinden yaya düşen noktası için x ve y kordinatlarını getirir
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
}

// Renkli alanları temsil eden sınıf
class Area {
    constructor(canvas, startAngle, endAngle, color) {
        this.canvas = canvas;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.color = color;
    }

    // Alanı çizer
    draw() {
        this.canvas.ctx.beginPath();
        this.canvas.ctx.arc(
            this.canvas.centerX,
            this.canvas.centerY,
            this.canvas.radius - (Constants.CIRCLE_WIDTH / 2),
            this.startAngle,
            this.endAngle,
            false
        );
        this.canvas.ctx.strokeStyle = this.color;
        this.canvas.ctx.lineWidth = Constants.CIRCLE_WIDTH;
        this.canvas.ctx.stroke();
        this.canvas.ctx.closePath();
    }

    // alanların verilerini çember üzerinde random bir kordinatta oluşturur
    static getRandomAreas(canvas, areaWidth = 20, combo = 0) {
        const areas = [];
        const areaWidthRadian = MathHelper.degreeToRadian(areaWidth);
        const randomDegree = Constants.CIRCLE_DEGREE * Math.random();
        let startAngle = MathHelper.degreeToRadian(randomDegree);

        /* 
            * elimizdeki renk kadar , belirlediğimiz başlangıç açısından başlayarak belirttiğimiz genişlikteki yayları oluşturur.
            * burada aldığımız ve default 0 olan combo değeri , ardarda yaptığımız kombo sayısını temsil eder , ve comboya göre oluşturulacak alanın hangi indexten başlayacağını belirler
        */

        for (let i = combo; i < Constants.COLORS.length; i++) {
            const endAngle = startAngle + areaWidthRadian;
            areas.push(new Area(canvas, startAngle, endAngle, Constants.COLORS[i]));
            startAngle = endAngle;
        }

        return areas;
    }
}

class Game {
    constructor(gameCanvasId, lineCanvasId) {
        this.gameCanvas = new Canvas(gameCanvasId);
        this.lineCanvas = new Canvas(lineCanvasId);
        this.circle = new Circle(this.gameCanvas);
        this.line = new Line(this.lineCanvas);
        this.areas = [];
        this.animationId = null;
        this.lastUpdateTime = 0;
        this.fps = 60
        this.updateInterval = 1000 / this.fps
    }

    // oyunu başlatır
    start() {
        this.circle.draw();
        this.line.draw();
        this.areas = Area.getRandomAreas(this.gameCanvas, 13);
        console.log(this.areas)
        this.areas.forEach(area => area.draw());
        this.#startAnimation();
    }

    // oyunu durdurur
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
    }

    // Oyun boyunca çubuğun hareketini sağlayan animasyonu fps değerine bağlı kalarak her kullanıcıda senkron olarak çalıştırır.
    #startAnimation() {
        const updateLine = (currentTime) => {
            if (currentTime - this.lastUpdateTime >= this.updateInterval) {
                this.line.update();
                this.lastUpdateTime = currentTime;
            }
            this.animationId = requestAnimationFrame(updateLine);
        };
        this.animationId = requestAnimationFrame(updateLine);
    }
}


const game = new Game("#game_canvas", "#line_canvas");
game.start();
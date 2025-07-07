import * as tesserxel from "https://wxyhly.github.io/tesserxel/build/tesserxel.js"
const canvas = document.querySelector("canvas");
class Core {
    width; height; scale;
    margin = 0.05;
    selector = null;
    ab = [0, 0];
    bc = [0, 0];
    resize(w, h) {
        this.width = w;
        this.scale = Math.min(h * (0.5 - this.margin) / 90, (w * (0.5 - this.margin)) / 90);
        this.height = h;
        //draw
        this.draw();
    }
    logic2canvas(x, y) {
        return [(x - 90) * this.scale + this.width / 2, -(y) * this.scale + this.height / 2];
    }
    canvas2logic(x, y) {
        return [(x - this.width / 2) / this.scale + 90, -(y - this.height / 2) / this.scale];
    }
    drawPoint(size, x, y, context) {
        // console.log(x, y);
        context.beginPath();
        context.arc(...this.logic2canvas(x, y), size, 0, Math.PI * 2);
        context.fill();
    }
    drawText(text, x0, y0, context) {
        // console.log(x, y);
        const m = context.measureText(text);
        const [x, y] = this.logic2canvas(x0, y0);
        context.fillText(text, x - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft)/2, y + m.actualBoundingBoxAscent/2);
    }
    draw() {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, this.width, this.height);
        // const m = context.measureText(text);
        // m.
        context.strokeStyle = "black";
        context.lineWidth = 1;
        this.drawLine(90, 90, 90, -90);
        this.drawLine(0, 0, 180, 0);
        context.fillStyle = "black";
        context.font = "16px sans-serif";
        this.drawText("重合", 0, 0, context);
        this.drawText("反向", 180, 0, context);
        this.drawText("绝对垂直(自对偶)", 90, 90, context);
        this.drawText("绝对垂直(反自对偶)", 90, -90, context);
        this.drawText("左等角", 45, 45, context);
        this.drawText("左等角", 135, -45, context);
        this.drawText("右等角", 45, -45, context);
        this.drawText("右等角", 135, 45, context);
        context.lineWidth = 2;
        context.strokeStyle = "red";
        this.drawLine(0, 0, 90, 90);
        this.drawLine(90, 90, 180, 0);
        this.drawLine(90, -90, 180, 0);
        this.drawLine(90, -90, 0, 0);
        context.fillStyle = "purple";
        // context.beginPath();
        this.drawPoint(5, ...this.ab, context);
        // context.fill();
        context.fillStyle = "darkgreen";
        // context.beginPath();
        this.drawPoint(5, ...this.bc, context);
        // context.fill();
        context.fillStyle = "rgb(223, 210, 27,0.3)";
        // context.beginPath();
        this.generatePoints().forEach(p => this.drawPoint(1, p[0] / Math.PI * 180, p[1] / Math.PI * 180, context));
        // context.fill();

    }
    drawLine(x1, y1, x2, y2) {
        const context = canvas.getContext("2d");
        context.beginPath();
        context.moveTo(...this.logic2canvas(x1, y1));
        context.lineTo(...this.logic2canvas(x2, y2));
        context.stroke();
    }
    constructor() {
        const resize = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            this.resize(canvas.width, canvas.height);
        }
        window.addEventListener("resize", resize);
        resize();
        const cursorPress = (clientX, clientY) => {
            const selected = Array.from(document.querySelectorAll("input[type=radio]")).findIndex(e => e.checked);
            this.selector = selected === 0 ? this.ab : selected === 1 ? this.bc : null;
            if (!this.selector) {
                const rect = canvas.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                const mousePos = this.canvas2logic(x, y);
                const distance2AB = Math.hypot(mousePos[0] - this.ab[0], mousePos[1] - this.ab[1]);
                const distance2BC = Math.hypot(mousePos[0] - this.bc[0], mousePos[1] - this.bc[1]);
                if (Math.min(distance2AB, distance2BC) > 20) {
                    this.selector = null;
                } else if (distance2AB < distance2BC) {
                    this.selector = this.ab;
                } else {
                    this.selector = this.bc;
                }
            }
        }
        canvas.addEventListener("touchstart", (e) => { e.preventDefault(); cursorPress(e.targetTouches[0].clientX, e.targetTouches[0].clientY) });
        canvas.addEventListener("mousedown", e => cursorPress(e.clientX, e.clientY));
        canvas.addEventListener("mouseup", (e) => {
            this.selector = null;
        });
        canvas.addEventListener("touchend", (e) => {
            this.selector = null;
        });

        const input = document.querySelectorAll("input[type=number]");
        input.forEach(v => v.addEventListener("change", (e) => {
            this.ab[0] = parseFloat(input[0].value);
            this.ab[1] = parseFloat(input[1].value);
            this.bc[0] = parseFloat(input[2].value);
            this.bc[1] = parseFloat(input[3].value);
            this.draw();
        }));
        const cursorMove = (clientX, clientY) => {
            if (!this.selector) return;
            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const logic = this.canvas2logic(x, y);
            this.selector[0] = logic[0];
            this.selector[1] = logic[1];
            if (this.selector === this.ab) {
                input[0].value = this.ab[0].toFixed(2);
                input[1].value = this.ab[1].toFixed(2);
            } else if (this.selector === this.bc) {
                input[2].value = this.bc[0].toFixed(2);
                input[3].value = this.bc[1].toFixed(2);
            }
            this.draw();
        };
        canvas.addEventListener("touchmove", (e) => { e.preventDefault(); cursorMove(e.touches[0].clientX, e.touches[0].clientY) });
        canvas.addEventListener("mousemove", (e) => cursorMove(e.clientX, e.clientY));
    }
    generatePoints() {
        let [a1, a2] = this.ab;
        let [b1, b2] = this.bc;
        a1 *= Math.PI / 180;
        a2 *= Math.PI / 180;
        b1 *= Math.PI / 180;
        b2 *= Math.PI / 180;
        const vec4 = tesserxel.math.Vec4;
        const bivec = tesserxel.math.Bivec;
        const planeB = new vec4(Math.cos(a1), 0, Math.sin(a1)).wedge(new vec4(0, Math.cos(a2), 0, Math.sin(a2))).norms();
        const planeC = new vec4(Math.cos(b1), 0, Math.sin(b1)).wedge(new vec4(0, Math.cos(b2), 0, Math.sin(b2))).norms();
        const planeA = new bivec(1);
        const res = [];
        for (let i = 0; i < 10000; i++) {
            let R1 = tesserxel.math.Rotor.rand();
            const tempPlane = new bivec(1).rotates(R1);
            let R2 = tesserxel.math.Rotor.lookAtbb(tempPlane, planeB);
            tempPlane.rotates(R2);
            const planeD = planeC.clone().rotates(R1).rotates(R2);
            res.push(bivec.angle(planeD, planeA));
        }
        return res;
    }
}
new Core();
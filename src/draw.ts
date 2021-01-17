import { CIRCLE_RADIUS } from './constants';
import { ChartBase } from './chart-base';

export class Draw {
    private line: Path2D;
    private circle: Path2D;
    private clearCircle: Path2D;
    private pointer: Path2D;
    constructor(
        private context: CanvasRenderingContext2D,
        private baseChart: ChartBase // private scaledCoords: Columns, // private dimensions: Options
    ) {
        this.line = this.drawPolyline(baseChart.scaledCoords.x);
        this.circle = this.drawCircle(null);
        this.clearCircle = this.drawClearCircle(null);
        this.pointer = this.drawPointer(null);

        this.render();
    }

    private drawPolyline(data: number[]) {
        const line = new Path2D();
        data.forEach((x, index) => {
            line.lineTo(x, this.baseChart.scaledCoords.y0[index]);
        });
        return line;
    }

    private drawCircle(index: number | null) {
        const circle = new Path2D();
        index !== null &&
            circle.arc(
                this.baseChart.scaledCoords.x[index],
                this.baseChart.scaledCoords.y0[index],
                CIRCLE_RADIUS,
                0,
                2 * Math.PI
            );
        return circle;
    }

    private drawClearCircle(index: number | null) {
        const clearCircle = new Path2D();
        index !== null &&
            clearCircle.arc(
                this.baseChart.scaledCoords.x[index],
                this.baseChart.scaledCoords.y0[index],
                CIRCLE_RADIUS - this.context.lineWidth, //TODO issues are possible here
                0,
                2 * Math.PI
            );
        return clearCircle;
    }

    private drawPointer(index: number | null) {
        const {
            scaledCoords: { x },
            canvas: { height },
        } = this.baseChart;
        const pointer = new Path2D();
        index !== null && pointer.moveTo(x[index], 0);
        index !== null && pointer.lineTo(x[index], height);
        return pointer;
    }

    // markUp() {}
    // ySignature() {}
    // xSignature() {}

    onPoint(index: number | null) {
        this.pointer = this.drawPointer(index);
        this.circle = this.drawCircle(index);
        this.clearCircle = this.drawClearCircle(index);

        this.render();
    }

    onChangeDataSet() {
        this.line = this.drawPolyline(this.baseChart.scaledCoords.x);

        this.render();
    }

    private render() {
        const { width, height } = this.baseChart.canvas;
        this.context.clearRect(0, 0, width, height);

        this.context.stroke(this.line);
        this.context.stroke(this.pointer);
        this.context.stroke(this.circle);

        this.context.save();
        this.context.globalCompositeOperation = 'destination-out';
        this.context.fill(this.clearCircle);
        this.context.restore();
    }
}

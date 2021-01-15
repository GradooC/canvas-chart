import { Columns } from './types';
import { CIRCLE_RADIUS } from './constants';

type Options = {
    width: number;
    height: number;
};

export class Draw {
    line: Path2D = new Path2D();
    pointer: Path2D = new Path2D();
    circle: Path2D = new Path2D();
    clearCircle: Path2D = new Path2D();
    constructor(
        private context: CanvasRenderingContext2D,
        private scaledCoords: Columns,
        private dimensions: Options
    ) {
        this.polyline();

        this.render();
    }

    polyline() {
        const line = new Path2D();
        this.scaledCoords.x.forEach((x, index) => {
            line.lineTo(x, this.scaledCoords.y0[index]);
        });
        this.line = line;
    }

    markUp() {}
    ySignature() {}
    xSignature() {}

    onPoint(index: number | null) {
        const pointer = new Path2D();
        index !== null && pointer.moveTo(this.scaledCoords.x[index], 0);
        index !== null && pointer.lineTo(this.scaledCoords.x[index], this.dimensions.height);
        this.pointer = pointer;

        const circle = new Path2D();
        index !== null &&
            circle.arc(
                this.scaledCoords.x[index],
                this.scaledCoords.y0[index],
                CIRCLE_RADIUS,
                0,
                2 * Math.PI
            );
        this.circle = circle;

        const clearCircle = new Path2D();
        index !== null &&
            clearCircle.arc(
                this.scaledCoords.x[index],
                this.scaledCoords.y0[index],
                CIRCLE_RADIUS - this.context.lineWidth,
                0,
                2 * Math.PI
            );
        this.clearCircle = clearCircle;

        this.render();
    }

    render() {
        this.context.clearRect(0, 0, this.dimensions.width, this.dimensions.height);

        this.context.stroke(this.line);
        this.context.stroke(this.pointer);
        this.context.stroke(this.circle);

        this.context.save();
        this.context.globalCompositeOperation = 'destination-out';
        this.context.fill(this.clearCircle);
        this.context.restore();
    }
}

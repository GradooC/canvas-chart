import {
    CIRCLE_RADIUS,
    LIGHT_GRAY_COLOR,
    CHART_LINE_WIDTH,
    Y_SIGNATURE_OFFSET,
    SECTIONS_AMOUNT,
    FONT,
    FONT_COLOR,
} from './constants';
import { ChartBase } from './chart-base';
import { Data } from './chart';

type Signature = {
    position: { x: number; y: number };
    signature: string;
};

type Shape = {
    path: Path2D;
    width?: number;
    color?: string;
    mode?: 'fill' | 'stroke' | 'text';
    globalCompositeOperation?: CanvasRenderingContext2D['globalCompositeOperation'];
    signatures?: Signature[];
};

export class Draw {
    private lines: Shape[];
    private circles: Shape[];
    private pointer: Shape;
    private clearCircles: Shape[];
    private murkUp: Shape;
    constructor(private context: CanvasRenderingContext2D, private baseChart: ChartBase) {
        this.lines = this.buildPolyline(baseChart.scaledCoords);
        this.circles = this.buildCircle(null);
        this.clearCircles = this.buildClearCircle(null);
        this.pointer = this.buildPointer(null);
        this.murkUp = this.buildMarkUp();

        this.render();
    }

    private buildPolyline(data: Data): Shape[] {
        return Object.entries(data.columns)
            .filter(([key]) => key !== 'x')
            .map(([key, value]) => {
                const line = new Path2D();
                value.forEach((y, index) => {
                    line.lineTo(data.columns.x[index], y);
                });
                return {
                    path: line,
                    width: CHART_LINE_WIDTH,
                    color: data.colors[key as keyof Data['names']],
                };
            });
    }

    private buildCircle(index: number | null): Shape[] {
        const { scaledCoords } = this.baseChart;
        return Object.entries(scaledCoords.columns)
            .filter(([key]) => key !== 'x')
            .map(([key, value]) => {
                const circle = new Path2D();
                index !== null &&
                    circle.arc(
                        scaledCoords.columns.x[index],
                        value[index],
                        CIRCLE_RADIUS,
                        0,
                        2 * Math.PI
                    );
                return {
                    path: circle,
                    width: CHART_LINE_WIDTH,
                    color: scaledCoords.colors[key as keyof Data['names']],
                };
            });
    }

    private buildClearCircle(index: number | null): Shape[] {
        const { scaledCoords } = this.baseChart;
        return Object.entries(scaledCoords.columns)
            .filter(([key]) => key !== 'x')
            .map(([_key, value]) => {
                const clearCircle = new Path2D();
                index !== null &&
                    clearCircle.arc(
                        scaledCoords.columns.x[index],
                        value[index],
                        CIRCLE_RADIUS - this.context.lineWidth, //TODO issues are possible here
                        0,
                        2 * Math.PI
                    );
                return {
                    path: clearCircle,
                    mode: 'fill',
                    globalCompositeOperation: 'destination-out',
                };
            });
    }

    private buildPointer(index: number | null): Shape {
        const {
            scaledCoords: {
                columns: { x },
            },
            canvas: { height },
        } = this.baseChart;
        const pointer = new Path2D();
        index !== null && pointer.moveTo(x[index], 0);
        index !== null && pointer.lineTo(x[index], height);
        return { path: pointer };
    }

    private buildMarkUp(): Shape {
        const {
            canvas: { width, height },
            pixelRatio,
        } = this.baseChart;
        const sectionsAmount = SECTIONS_AMOUNT;
        const canvasWidth = width / pixelRatio;
        const canvasHeight = height / pixelRatio;

        const markUp = new Path2D();
        const rowHeight = canvasHeight / sectionsAmount;
        new Array(sectionsAmount + 1).fill(null).forEach((_, index) => {
            markUp.moveTo(0, index * rowHeight);
            markUp.lineTo(canvasWidth, index * rowHeight);
        });
        return { path: markUp };
    }

    private getYSignature(): Shape {
        const {
            minY,
            maxY,
            pixelRatio,
            canvas: { height },
        } = this.baseChart;
        const sectionsAmount = SECTIONS_AMOUNT;
        const rowHeight = height / pixelRatio / sectionsAmount;
        const step = (maxY - minY) / sectionsAmount;

        const signatures = Array(sectionsAmount + 1)
            .fill(null)
            .reduce((acc, _el, index) => {
                const markupSignature = String(Math.round((sectionsAmount - index) * step));
                const position = {
                    x: Y_SIGNATURE_OFFSET,
                    y: index * rowHeight - Y_SIGNATURE_OFFSET,
                };
                return [...acc, { signature: markupSignature, position }];
            }, [] as Signature[]);

        return { path: new Path2D(), signatures, mode: 'text', color: FONT_COLOR };
    }
    // xSignature() {}

    onPoint(index: number | null) {
        this.pointer = this.buildPointer(index);
        this.circles = this.buildCircle(index);
        this.clearCircles = this.buildClearCircle(index);

        this.render();
    }

    onChangeDataSet() {
        const { scaledCoords } = this.baseChart;
        this.lines = this.buildPolyline(scaledCoords);

        this.render();
    }

    private drawer({
        path,
        width = 1,
        color = LIGHT_GRAY_COLOR,
        mode = 'stroke',
        globalCompositeOperation = 'source-over',
        signatures,
    }: Shape) {
        const { context } = this;
        context.save();
        context.globalCompositeOperation = globalCompositeOperation;
        switch (mode) {
            case 'fill':
                context.fillStyle = color;
                context.fill(path);
                break;
            case 'text':
                context.fillStyle = color;
                context.font = FONT;
                signatures?.forEach(({ position, signature }) => {
                    context.fillText(signature, position.x, position.y);
                });
            default:
                context.lineWidth = width;
                context.strokeStyle = color;
                context.stroke(path);
                break;
        }
        context.restore();
    }

    private render() {
        const {
            canvas: { width, height },
            scaledCoords,
        } = this.baseChart;
        const { context, pointer, lines, circles, clearCircles, murkUp } = this;
        context.clearRect(0, 0, width, height);

        if (height > 300) {
            //TODO a hack to define if it's a main chart
            this.drawer(murkUp);
            this.drawer(this.getYSignature());
        }
        this.drawer(pointer);
        lines.forEach((line) => {
            this.drawer(line);
        });
        clearCircles.forEach((clearCircle) => {
            this.drawer(clearCircle);
        });
        circles.forEach((circle) => {
            this.drawer(circle);
        });
    }
}

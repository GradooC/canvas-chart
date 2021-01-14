import { InputData } from './data/chart_data.json';
import { getScaledX, getScaledY } from './utils';

type Data = ReturnType<typeof DrawChart.transformData>;
type Columns = {
    x: number[];
    y0: number[];
    y1: number[];
};
type Options = {
    width: number;
    height: number;
};

export class DrawChart {
    data: Data;
    scaledCoords: Columns;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(data: InputData, { width, height }: Options) {
        this.canvas = document.querySelector('#slider-map') as HTMLCanvasElement;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.data = DrawChart.transformData(data);
        this.scaledCoords = this.getScaledPoints(this.data);

        this.drawPolyline();
    }

    private drawHorizontalMarkup() {}

    private drawPolyline() {
        const [firstX, ...restX] = this.scaledCoords.x;
        const [firstY, ...restY] = this.scaledCoords.y0;
        this.context.beginPath();
        this.context.moveTo(firstX, firstY);
        restX.forEach((x, index) => {
            this.context.lineTo(x, restY[index]);
        });
        this.context.stroke();
    }

    static transformData(data: InputData) {
        const transformedColumns = data.columns.reduce(
            (acc, [first, ...rest]) => ({ ...acc, [first]: rest }),
            {} as Columns
        );
        return { ...data, columns: transformedColumns };
    }

    private getScaledPoints(data: Data) {
        return Object.entries(data.columns).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]:
                    key === 'x'
                        ? getScaledX(value, this.canvas.width)
                        : getScaledY(value, this.canvas.height),
            };
        }, {} as Columns);
    }
}

import { Data } from './chart';
import { Columns } from './data/chart_data.json';
import { Draw } from './draw';

type Options = {
    width: number;
    height: number;
};

export class ChartBase {
    readonly draw: Draw;
    readonly pixelRatio: number;
    scaledCoords: Data;
    minY: number;
    maxY: number;
    constructor(
        readonly canvas: HTMLCanvasElement,
        readonly data: Data,
        { width, height }: Options
    ) {
        const context = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.pixelRatio = window.devicePixelRatio;
        canvas.width = Math.floor(width * this.pixelRatio);
        canvas.height = Math.floor(height * this.pixelRatio);
        context.scale(this.pixelRatio, this.pixelRatio);

        const [minY, maxY] = this.getMinMaxY(data.columns);
        this.minY = minY;
        this.maxY = maxY;
        this.scaledCoords = this.getScaledPoints(data, maxY);

        this.draw = new Draw(context, this);
    }

    private getScaledX(xCoordinates: number[], canvasWidth: number) {
        const lastElement = xCoordinates[xCoordinates.length - 1];
        const firstElement = xCoordinates[0];
        return xCoordinates.map((x) =>
            Math.round(((x - firstElement) * canvasWidth) / (lastElement - firstElement))
        );
    }

    private getScaledY(yCoordinates: number[], canvasHeight: number, maxY: number) {
        const scaleFactor = canvasHeight / maxY;
        return yCoordinates.map((y) => Math.round(canvasHeight - y * scaleFactor));
    }

    private getMinMaxY(columns: Columns): [number, number] {
        const unitedYArr = Object.entries(columns)
            .filter(([key]) => key !== 'x')
            .reduce((acc, [_key, value]) => [...acc, ...value], [] as number[]);
        return [Math.min(...unitedYArr), Math.max(...unitedYArr)];
    }

    private setMinMaxY(minY: number, maxY: number) {
        this.minY = minY;
        this.maxY = maxY;
    }

    calculateDisplayedData(firstIndex: number, lastIndex: number) {
        //TODO optimization is needed
        const filterer = (_: number, index: number) => index >= firstIndex && index < lastIndex;
        const newColumns = Object.entries(this.data.columns).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]: value.filter(filterer),
            };
        }, {} as Columns);

        const [minY, maxY] = this.getMinMaxY(newColumns);
        this.setMinMaxY(minY, maxY);

        this.scaledCoords = this.getScaledPoints({ ...this.data, columns: newColumns }, maxY);
    }

    private getScaledPoints(data: Data, maxY: number): Data {
        const { width, height } = this.canvas;
        const newColumns = Object.entries(data.columns).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]:
                    key === 'x'
                        ? this.getScaledX(value, width / this.pixelRatio)
                        : this.getScaledY(value, height / this.pixelRatio, maxY),
            };
        }, {} as Columns);
        return { ...data, columns: newColumns };
    }
}

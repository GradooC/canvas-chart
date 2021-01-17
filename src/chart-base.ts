import { Data } from './chart';
import { Columns } from './types';
import { Draw } from './draw';

type Options = {
    width: number;
    height: number;
};

export class ChartBase {
    draw: Draw;
    scaledCoords: Columns;
    constructor(public canvas: HTMLCanvasElement, public data: Data, options: Options) {
        const context = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        this.canvas.width = options.width;
        this.canvas.height = options.height;

        this.scaledCoords = this.getScaledPoints(data);
        this.draw = new Draw(context, this);
    }

    private getScaledX(xCoordinates: number[], canvasWidth: number) {
        const lastElement = xCoordinates[xCoordinates.length - 1];
        const firstElement = xCoordinates[0];
        return xCoordinates.map((x) =>
            Math.round(((x - firstElement) * canvasWidth) / (lastElement - firstElement))
        );
    }

    private getScaledY(yCoordinates: number[], canvasHeight: number) {
        const scaleFactor = canvasHeight / Math.max(...yCoordinates);
        return yCoordinates.map((y) => Math.round(canvasHeight - y * scaleFactor));
    }

    public getScaledPoints(data: Data) {
        const { width, height } = this.canvas;
        return Object.entries(data.columns).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]: key === 'x' ? this.getScaledX(value, width) : this.getScaledY(value, height),
            };
        }, {} as Columns);
    }
}

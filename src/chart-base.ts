import { Data } from './chart';
import { Columns } from './types';
import { Draw } from './draw';

type Options = {
    width: number;
    height: number;
};

export class ChartBase {
    readonly draw: Draw;
    scaledCoords: Data;
    readonly pixelRatio: number;
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

    getScaledPoints(data: Data): Data {
        const { width, height } = this.canvas;
        const newColumns = Object.entries(data.columns).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]:
                    key === 'x'
                        ? this.getScaledX(value, width / this.pixelRatio)
                        : this.getScaledY(value, height / this.pixelRatio),
            };
        }, {} as Columns);
        return { ...data, columns: newColumns };
    }
}

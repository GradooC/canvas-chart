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
    constructor(protected canvas: HTMLCanvasElement, protected data: Data, options: Options) {
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.canvas.width = options.width;
        this.canvas.height = options.height;

        this.scaledCoords = this.getScaledPoints(data);
        this.draw = new Draw(context, this.scaledCoords, {
            width: this.canvas.width,
            height: this.canvas.height,
        });
    }

    private getScaledX(xCoordinates: number[], canvasWidth: number) {
        const lastElement = xCoordinates[xCoordinates.length - 1];
        const firstElement = xCoordinates[0];
        return xCoordinates.map(
            (x) => ((x - firstElement) * canvasWidth) / (lastElement - firstElement)
        );
    }

    private getScaledY(yCoordinates: number[], canvasHeight: number) {
        const scaleFactor = canvasHeight / Math.max(...yCoordinates);
        return yCoordinates.map((y) => canvasHeight - y * scaleFactor);
    }

    protected getScaledPoints(data: Data) {
        return Object.entries(data.columns).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]:
                    key === 'x'
                        ? this.getScaledX(value, this.canvas.width)
                        : this.getScaledY(value, this.canvas.height),
            };
        }, {} as Columns);
    }
}

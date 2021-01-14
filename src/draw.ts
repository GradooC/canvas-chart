import { Columns } from './types';

export class Draw {
    constructor(private context: CanvasRenderingContext2D, private scaledCoords: Columns) {}

    drawPolyline() {
        const [firstX, ...restX] = this.scaledCoords.x;
        const [firstY, ...restY] = this.scaledCoords.y0;
        this.context.beginPath();
        this.context.moveTo(firstX, firstY);
        restX.forEach((x, index) => {
            this.context.lineTo(x, restY[index]);
        });
        this.context.stroke();
    }
}

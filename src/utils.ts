import {
    // LIGHT_GRAY_COLOR,
    // GREEN_COLOR,
    Y_MARKUP_SIGNATURE_OFFSET,
    X_MARKUP_SIGNATURE_OFFSET,
    ROWS_AMOUNT,
    HALF_PIXEL,
} from './constants';

// const points = data.columns.reduce((acc, arr) => {
//     const [axisName, ...points] = arr;
//     return { ...acc, [axisName]: points };
// }, {} as Points);

// export const getLast = <T>(arr: T[]): T => arr[arr.length - 1];

// export const getScaledX = (xCoordinates: number[], canvasWidth: number) => {
//     const lastElement = xCoordinates[xCoordinates.length - 1];
//     const firstElement = xCoordinates[0];
//     return xCoordinates.map(
//         (x) => ((x - firstElement) * canvasWidth) / (lastElement - firstElement)
//     );
// };

// export const getScaledY = (yCoordinates: number[], canvasHeight: number) => {
//     const scaleFactor = canvasHeight / Math.max(...yCoordinates);
//     return yCoordinates.map((y) => canvasHeight - y * scaleFactor);
// };

export const drawHorizontalMarkup = (
    context: CanvasRenderingContext2D,
    yCoordinates: number[],
    sectionsAmount: number = ROWS_AMOUNT,
    canvasHeight: number,
    canvasWidth: number
) => {
    const rowHeight = canvasHeight / sectionsAmount;
    const yCoordinatesStep =
        (Math.max(...yCoordinates) - Math.min(...yCoordinates)) /
        sectionsAmount;
    context.save();
    context.translate(+HALF_PIXEL, +HALF_PIXEL); // fix line width
    context.beginPath();
    new Array(sectionsAmount + 1).fill(null).forEach((_, index) => {
        const markupSignature = String(
            (sectionsAmount - index) * yCoordinatesStep
        );
        context.fillText(
            markupSignature,
            Y_MARKUP_SIGNATURE_OFFSET,
            index * rowHeight - Y_MARKUP_SIGNATURE_OFFSET
        );

        context.moveTo(0, index * rowHeight);
        context.lineTo(canvasWidth, index * rowHeight);
    });
    context.stroke();
    context.restore();
};

export const drawXSignature = (
    context: CanvasRenderingContext2D,
    xCoordinates: number[],
    sectionsAmount: number = ROWS_AMOUNT,
    canvasHeight: number,
    canvasWidth: number
) => {
    const segmentWidth = canvasWidth / sectionsAmount;
    const xCoordinatesStep =
        (Math.max(...xCoordinates) - Math.min(...xCoordinates)) /
        sectionsAmount;

    new Array(sectionsAmount + 1).fill(null).forEach((_, index) => {
        const markupSignature = String(index * xCoordinatesStep);
        context.fillText(
            markupSignature,
            index * segmentWidth,
            canvasHeight + X_MARKUP_SIGNATURE_OFFSET
        );
    });
};

// export const drawLine = (
//     context: CanvasRenderingContext2D,
//     scaledX: number[],
//     scaledY: number[],
//     color: string = GREEN_COLOR
// ) => {
//     const [firstX, ...restX] = scaledX;
//     const [firstY, ...restY] = scaledY;
//     context.beginPath();
//     context.moveTo(firstX, firstY);
//     restX.forEach((x, index) => {
//         context.lineTo(x, restY[index]);
//     });
//     context.stroke();
// };

// export const createVMDrawer = (
//     context: CanvasRenderingContext2D,
//     scaledXCoordinates: number[]
// ) => {
//     let currentClosestX: number = -1;

//     return (x: number) => {
//         const closestX = scaledXCoordinates.reduce((res, el) => {
//             return Math.abs(el - x) < Math.abs(res - x) ? el : res;
//         });

//         if (currentClosestX !== closestX) {
//             context.globalCompositeOperation = 'xor';
//             context.strokeStyle = LIGHT_GRAY_COLOR;
//             context.beginPath();

//             context.moveTo(closestX, 0);
//             context.lineTo(closestX, 700);

//             context.moveTo(currentClosestX, 0);
//             context.lineTo(currentClosestX, 700);

//             context.stroke();

//             currentClosestX = closestX;
//         }
//     };
// };

// export const drawCircle = (
//     context: CanvasRenderingContext2D,
//     scaledX: number[],
//     scaledY: number[],
//     radius: number = 10,
//     color: string = GREEN_COLOR
// ) => {
//     context.save();
//     context.globalCompositeOperation = 'destination-over';
//     scaledX.forEach((x, index) => {
//         context.beginPath();
//         context.arc(x, scaledY[index], radius, 0, Math.PI * 2);
//         context.stroke();
//     });
//     context.restore();
// };

export const drawScaled = <F extends (...args: any) => any>(
    context: CanvasRenderingContext2D,
    fn: F,
    ...fnArgs: Parameters<F>
) => {
    context.save();
    context.scale(0.9, 0.9);
    context.translate(60, 20);
    fn(...fnArgs);
    context.restore();
};

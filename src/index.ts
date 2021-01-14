import { SCALE_RATE, FONT } from './constants';
import {
    drawHorizontalMarkup,
    drawLine,
    createVMDrawer,
    drawCircle,
    getScaledX,
    getScaledY,
    drawXSignature,
} from './utils';
import { ChartMap } from './chart-map';
import { DrawChart } from './draw-chart';
import { Chart } from './chart';
import data from './data/chart_data.json';

// const data: Data = {
//     columns: [
//         ['x', 10, 20, 30, 40, 50],
//         ['y0', 5, 20, 40, 10, 20],
//         ['y1', 0, 50, 10, 10, 70],
//     ],
//     types: { y0: 'line', y1: 'line', x: 'x' },
//     names: { y0: '#0', y1: '#1' },
//     colors: { y0: '#3DC23F', y1: '#F34C44' },
// };

// const x = [110, 120, 130, 140, 150, 160];
// const y = [10, 60, 30, 300, 140, 200];

// const canvas = <HTMLCanvasElement>document.getElementById('chart');

// canvas.width = CANVAS_WIDTH;
// canvas.height = CANVAS_HEIGHT;

// const context = canvas.getContext('2d');

// const scaledX = getScaledX(x, canvas.width);
// const scaledY = getScaledY(y, canvas.height);

// if (context) {
//     const draw = createVMDrawer(context, scaledX);

//     context.scale(SCALE_RATE, SCALE_RATE);
//     context.translate(
//         ((1 - SCALE_RATE) * CANVAS_WIDTH) / 2,
//         ((1 - SCALE_RATE) * CANVAS_HEIGHT) / 2
//     );
//     context.font = FONT;

//     drawHorizontalMarkup(context, y, 5, canvas.height, canvas.width);
//     drawXSignature(context, x, 5, canvas.height, canvas.width);
//     drawLine(context, scaledX, scaledY);
//     drawCircle(context, scaledX, scaledY);

//     canvas.addEventListener('mousemove', (e: MouseEvent) => {
//         // draw(e.offsetX);
//     });

// context.rotate(1);
// context.translate(0, canvas.height);
// context.beginPath();
// context.moveTo(0, 50);
// context.lineTo(canvas.width, 50);
// context.fillRect(0, 0, 50, 60);
// context.stroke();
// let shouldDraw = false;
// context.globalCompositeOperation = 'color-dodge';
// context.fillStyle = 'blue';
// context.fillRect(0, 0, 200, 100);
// context.fillStyle = 'red';
// context.fillRect(50, 50, 200, 100);
// canvas.addEventListener('mousedown', () => {
//     shouldDraw = true;
// });

// canvas.addEventListener('mouseup', () => {
//     shouldDraw = false;
// });

// canvas.addEventListener('mouseleave', () => {
//     shouldDraw = false;
// })

// canvas.addEventListener('mousemove', (e: MouseEvent) => {
//     if (shouldDraw) {
//         context.beginPath();
//         context.arc(e.offsetX, e.offsetY, 10, 0, Math.PI * 2);
//         context.stroke();
//     }
// });
// }

const box = document.querySelector('.box') as HTMLDivElement;
new Chart(data, box);
// new ChartMap();
// new DrawChart(data);

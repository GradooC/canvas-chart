import { CANVAS_WIDTH } from "./constants";
import "./styles.scss";

const EDGE_WIDTH = 4;
const MIN_VIEWPORT_WIDTH = 100;

const viewportPositionConstraints = [
    (left: number) => (left <= 0 ? 0 : left),
    (left: number, el: HTMLDivElement) => {
        const rightEdgePos = left + el.offsetWidth;
        const parentWidth = (<HTMLDivElement>el.offsetParent).offsetWidth;
        return rightEdgePos >= parentWidth ? parentWidth - el.offsetWidth : left;
    },
];

const leftEdgePositionConstraints = [
    (left: number) => (left <= 0 ? 0 : left),
    (left: number, el: HTMLDivElement) => (el.offsetWidth <= MIN_VIEWPORT_WIDTH ? el.offsetLeft : left),
];

const widthPositionConstraints = [
    (width: number) => (width <= MIN_VIEWPORT_WIDTH ? MIN_VIEWPORT_WIDTH : width),
    (width: number, el: HTMLDivElement) => {
        const rightEdgePos = el.offsetLeft + el.offsetWidth;
        const parentWidth = (<HTMLDivElement>el.offsetParent).offsetWidth;
        return rightEdgePos >= parentWidth ? el.offsetWidth : width;
    },
];

type MousemoveHandler = (event: MouseEvent) => void;

const addListeners = (onMousemove: MousemoveHandler) => {
    const onMouseup = () => {
        document.removeEventListener("mousemove", onMousemove);
        document.removeEventListener("mouseup", onMouseup);
    };
    document.addEventListener("mousemove", onMousemove);
    document.addEventListener("mouseup", onMouseup);
};

export const drawMap = () => {
    // Drag handler
    const onViewportDrag = (downEvent: MouseEvent) => {
        downEvent.preventDefault();
        const element = <HTMLDivElement>downEvent.target;
        const rect = element.getBoundingClientRect();
        let prevX = downEvent.clientX;
        const startX = downEvent.pageX;

        const onMousemove = (moveEvent: MouseEvent) => {
            const newX = prevX - moveEvent.clientX;
            const newLeft = viewportPositionConstraints.reduce(
                (res, constraint) => constraint(res, element),
                element.offsetLeft - newX
            );
            element.style.setProperty("left", `${newLeft}px`);
            prevX = moveEvent.clientX;
        };

        addListeners(onMousemove);
    };

    // Resize handler
    const onViewportResize = (downEvent: MouseEvent) => {
        downEvent.preventDefault();
        const element = <HTMLDivElement>downEvent.target;
        const viewport = <HTMLDivElement>element.parentNode;
        const isLeft = element.classList.contains("viewport-left-edge");
        let prevX = downEvent.clientX; // downEvent.clientX - Point you clicked

        const onMousemove = (moveEvent: MouseEvent) => {
            const newX = prevX - moveEvent.clientX; // moveEvent.clientX - Point you dragged to
            if (isLeft) {
                const newLeft = leftEdgePositionConstraints.reduce(
                    (res, constraint) => constraint(res, viewport),
                    viewport.offsetLeft - newX
                );
                viewport.style.setProperty("left", `${newLeft}px`);
            }
            const newWidth = widthPositionConstraints.reduce(
                (res, constraint) => constraint(res, viewport),
                isLeft ? viewport.offsetWidth + newX : viewport.offsetWidth - newX
            );
            viewport.style.setProperty("width", `${newWidth}px`);
            prevX = moveEvent.clientX;
        };

        addListeners(onMousemove);
    };

    const viewport = document.querySelector<HTMLDivElement>(".viewport");
    const edges = document.querySelectorAll<HTMLDivElement>(".viewport div");

    viewport?.addEventListener("mousedown", onViewportDrag);
    edges?.forEach((edge) => edge.addEventListener("mousedown", onViewportResize));

    document.documentElement.style.setProperty("--edge-width", `${EDGE_WIDTH}px`);
};

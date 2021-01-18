export type Columns = {
    x: number[];
    y0: number[];
    y1: number[];
};

export type InputData = {
    columns: [string, ...number[]][];
    types: {
        x: string;
        y0: string;
        y1: string;
    };
    names: {
        y0: string;
        y1: string;
    };
    colors: {
        y0: string;
        y1: string;
    };
};

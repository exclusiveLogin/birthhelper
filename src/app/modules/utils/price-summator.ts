import { map } from "rxjs/operators";

export const summatorPipe = (source$) => {
    return source$.pipe(
        map((prices: number[]) => {
            return prices.reduce((summary, price) => summary + price, 0);
        })
    );
};

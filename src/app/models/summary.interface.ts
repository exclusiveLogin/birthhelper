export type Summary = Partial<SummaryPrice & SummaryRate> & {id: number};

export interface SummaryPrice {
    min_price: number;
    max_price: number;
    avg_price: number;
    count_slots: number;
}

export interface SummaryRate {
    min_rate: number;
    max_rate: number;
    avg_rate: number;
    count_votes: number;
}

export interface Summarized {
    summary?: Summary;
}

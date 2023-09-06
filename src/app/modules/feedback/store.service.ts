import {
    RateStore,
    SummaryRateByTargetResponse,
} from "@modules/feedback/models";
import { hasher } from "@modules/utils/hasher";

export class StoreService {
    constructor() {}

    rateStore: RateStore = {};

    saveRateToStore(
        targetKey: string,
        targetId: number,
        rating: SummaryRateByTargetResponse
    ): void {
        const hash = hasher({ targetKey, targetId });
        this.rateStore[hash] = rating;
    }

    loadRateFromStore(
        targetKey: string,
        targetId: number
    ): SummaryRateByTargetResponse {
        const hash = hasher({ targetKey, targetId });
        return this.rateStore[hash];
    }

    clearRateStoreByTarget(targetKey: string, targetId: number): void {
        const hash = hasher({ targetKey, targetId });
        delete this.rateStore[hash];
    }

    clearRateStore(): void {
        this.rateStore = {};
    }
}

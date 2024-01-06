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
        const _id: string = targetId.toString()
        const hash = hasher(JSON.stringify({ targetKey, targetId: _id }));
        this.rateStore[hash] = rating;
    }

    loadRateFromStore(
        targetKey: string,
        targetId: number
    ): SummaryRateByTargetResponse {
        const _id: string = targetId.toString()
        const hash = hasher(JSON.stringify({ targetKey, targetId: _id }));
        return this.rateStore[hash];
    }

    clearRateStoreByTarget(targetKey: string, targetId: number): void {
        const _id: string = targetId.toString()
        const hash = hasher(JSON.stringify({ targetKey, targetId: _id }));
        delete this.rateStore[hash];
    }

    clearRateStore(): void {
        this.rateStore = {};
    }
}

export interface Slot {
    id: number;
    service_id: number;
    contragent_id: number;
}

export interface ServiceSlot extends Slot {
    id: number;
    title: string;
    price: string;
    benefit_price: string;
    benefit_percent: string;
    entity_type: number;
    slot_category_type: number;
}

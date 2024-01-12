import { Injectable } from "@angular/core";
import { RestService } from "@services/rest.service";
import { Entity, SlotEntity } from "@models/entity.interface";
import { Contragent } from "@models/contragent.interface";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SlotService {
    constructor(private restService: RestService) {}

    getContragentFromSlot(slot: Entity): Observable<Contragent> {
        const slotted = slot as SlotEntity;

        if (slotted._contragent) return of(slotted._contragent);
        if (slotted.isContragent) return of(slotted as unknown as Contragent);
        if (slotted.contragent_id && slotted._contragent_entity_key)
            return this.restService.getEntity<Contragent>(
                slotted._contragent_entity_key,
                slotted.contragent_id
            );
    }
}

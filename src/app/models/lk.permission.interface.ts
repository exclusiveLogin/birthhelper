import { IDictItem } from "../modules/admin/dict.service";

export interface Permission {
    id: number;
    user_id: number;
    contragent_entity_id: number;
    permission_id: number;
    meta: {
        permission_id: IDictItem;
    };
}

export type PermissionLKType =
    | "orders"
    | "settings"
    | "analytics"
    | "slots"
    | "reviews";
export interface PermissionSetting {
    slug: string;
    title: string;
    navigate: string[];
    classes: string[];
}

export const PermissionMap: { [key in PermissionLKType]?: PermissionSetting } =
    {
        orders: {
            slug: "orders",
            title: "Стол заказов",
            navigate: ["/admin", "lk", "orders"],
            classes: ["fas", "fa-shopping-cart"],
        },
        settings: {
            slug: "settings",
            title: "Настройки",
            navigate: ["/admin", "lk", "settings"],
            classes: ["fas", "fa-cog"],
        },
    };

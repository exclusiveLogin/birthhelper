import { SectionType } from "@services/search.service";

export interface FeedbackContext {
    section?: SectionType;
    feedbackEntityType?: string;
    slotCategoryType?: number;
}

import { SectionType } from "@services/search.service";
import { User } from "@models/user.interface";
export type FeedbackAction =
    | "CREATE"
    | "ANSWER"
    | "LIKE"
    | "DISLIKE"
    | "ISSUES";

export type LikeType = "comment" | "feedback";
export interface Like {
    id: number;
    target_id: number;
    target_type: LikeType;
    user_id: number;
    datetime_create: string;
}
export interface FeedbackResponse {
    id: number;
    target_entity_key: string;
    target_entity_id: number;
    action: FeedbackAction;
    comment: Comment;
    votes: Array<Vote>;
    likes: Array<Like>;
    dislikes: Array<Like>;
    user: User;
}
export interface Vote {
    id: number;
    slug: string;
    title: string;
    section: SectionType;
    feedback_entity_type: string;
    slot_category_type: number;
}

export interface VoteResponse {
    slug: string;
    rate: number;
}

export interface FeedbackFormDataAnswer {
    votes: VoteResponse[];
    comment: string;
}

export interface CreateFeedbackRequest {
    action: "CREATE";
    target_entity_key: string;
    target_entity_id: number;
    votes: VoteResponse[];
    comment: string;
}

export interface SummaryVotes {
    avr: number;
    min: number;
    max: number;
    total: number;
}

export interface RateByVote extends SummaryVotes {
    slug: string;
}

export interface SummaryRateByTargetResponse {
    summary: SummaryVotes;
    summary_by_votes: Array<RateByVote>;
}

export interface RateStore {
    [key: string]: SummaryRateByTargetResponse;
}

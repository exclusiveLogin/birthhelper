import { SectionType } from "@services/search.service";
import { User } from "@models/user.interface";

export type FeedbackAction =
    | "GET"
    | "CREATE"
    | "REMOVE_FEEDBACK"
    | "REMOVE_COMMENT"
    | "ANSWER"
    | "REPLY"
    | "LIKE"
    | "DISLIKE"
    | "UNLIKE"
    | "ISSUES"
    | "STATUS_CHANGE";

export type FeedbackStatus =
    | "pending"
    | "approved"
    | "verified"
    | "blocked"
    | "reject"
    | "official"
    | "deleted";

export type FeedbackCommentStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "deleted"
    | "official";

export type FeedbackCommentType = "master" | "answer" | "reply";

export type LikeType = "comment" | "feedback";

export interface Like {
    id: number;
    target_id: number;
    target_type: LikeType;
    user_id: number;
    datetime_create: string;
}

export interface FeedbackByContragentResponse {
    byCore: FeedbackResponse[];
    bySlots: FeedbackResponse[];
    contragentId: number;
    total: number;
}

export interface FeedbackResponse extends Reactions {
    id: number;
    section: SectionType;
    target_entity_key: string;
    target_entity_id: number;
    action: FeedbackAction;
    status: FeedbackStatus;
    user_id: number;
    comment: Comment;
    votes: Array<Vote>;
    user: User;
    canEdit: boolean;
    canRemove: boolean;
    datetime_update?: string;
    datetime_create?: string;
}

export interface Comment extends Reactions {
    id?: number;
    feedback_id: number;
    user_id: number;
    text: string;
    comment_id?: number;
    replies?: number;
    status?: FeedbackCommentStatus;
    type?: FeedbackCommentType;
    datetime_update?: string;
    datetime_create?: string;
}

interface Reactions {
    likes: Array<Like>;
    dislikes: Array<Like>;
    likeOwner: boolean;
    dislikeOwner: boolean;
}

export interface Vote {
    id: number;
    vote_slug: string;
    title: string;
    section: SectionType;
    rate: number;
    feedback_entity_type: string;
    slot_category_type: number;
}

export interface VoteResponse {
    slug: string;
    rate: number;
}

export interface FeedbackSet {
    total: number;
    portion: number;
}

export interface FeedbackFormDataAnswer {
    votes: VoteResponse[];
    comment: string;
}

export type FeedbackDislikeCommentRequest = { action: "DISLIKE" } & Pick<
    FeedbackDTO,
    "id" | "section" | "comment_id"
>;
export type FeedbackLikeCommentRequest = { action: "LIKE" } & Pick<
    FeedbackDTO,
    "id" | "section" | "comment_id"
>;
export type FeedbackDislikeRequest = { action: "DISLIKE" } & Pick<
    FeedbackDTO,
    "id" | "section"
>;
export type FeedbackLikeRequest = { action: "LIKE" } & Pick<
    FeedbackDTO,
    "id" | "section"
>;
export type CreateFeedbackRequest = { action: "CREATE" } & Pick<
    FeedbackDTO,
    "section" | "target_entity_key" | "target_entity_id" | "votes" | "comment"
>;
export type EditFeedbackRequest = { action: "EDIT" } & Pick<
    FeedbackDTO,
    "id" | "votes" | "comment"
>;
export type DeleteFeedbackRequest = { action: "REMOVE_FEEDBACK" } & Pick<
    FeedbackDTO,
    "id"
>;
export type DeleteFeedbackReplyRequest = { action: "REMOVE_COMMENT" } & Pick<
    FeedbackDTO,
    "id" | "comment_id"
>;
export type ReplyFeedbackRequest = { action: "REPLY" } & Pick<
    FeedbackDTO,
    "comment_id" | "comment" | "status"
>;

export interface FeedbackDTO {
    id?: number;
    section?: SectionType;
    action: FeedbackAction;
    status: FeedbackStatus;
    target_entity_key?: string;
    target_entity_id?: number;
    comment?: string;
    comment_id?: number;
    votes?: Array<VoteResponse>;
    tags?: number[];
}

export interface SummaryVotes {
    avr: number;
    min: number;
    max: number;
    total: number;
}

export interface RateByVote extends SummaryVotes {
    slug: string;
    title: string;
}

export interface SummaryRateByTargetResponse {
    summary: SummaryVotes;
    summary_by_votes: Array<RateByVote>;
}

export interface RateStore {
    [key: string]: SummaryRateByTargetResponse;
}

export type StatusTypeMap = {
    [key in FeedbackStatus]: string;
};

export const StatusRusMap: StatusTypeMap = {
    pending: "На модерации",
    approved: "Одобрен",
    blocked: "Заблокирован",
    official: "Официально",
    reject: "Отклонен",
    verified: "Честный отзыв",
    deleted: "Удален",
};

export interface FeedbackChangeStatusResponse {
    result: "ok";
    id: number;
    status: FeedbackStatus;
}

export type FeedbackSummaryVotes = { _summary: SummaryVotes };

export interface FeedbackRemoveResponse {
    feedbackID: number;
    result: string;
}

export interface ReplyRemoveResponse {
    returnedId: number;
    result: string;
}

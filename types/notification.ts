export type NotificationType =
    | "NEW_APPLICATION"
    | "SHORTLIST_RESULT"
    | "SHORTLIST_SENT_CONFIRMATION"

export interface Notification {
    id: string
    user_id: string
    type: NotificationType
    title: string
    message: string
    job_id: string | null
    is_read: boolean
    created_at: string
}

export interface UnreadCountResponse {
    unread_count: number
}

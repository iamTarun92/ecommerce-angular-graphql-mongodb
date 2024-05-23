export interface Coupon {
    _id: string
    code: string
    discount: number
    createdAt: string
    updatedAt: string
    publishedAt: string
    startDate: string
    endDate: string
    minOrder: number
    isfixed: boolean
}
import { IRating } from "./rating"

export type ISoup = {
    ID: string
    name: string
    shortDescr: string
    longDescr: string
    date: Date
    ratings: IRating[]
    avgRating: number
    ratingsCount: number
    ingredients: string
    isVeggie: number
    isSpicy: number
}
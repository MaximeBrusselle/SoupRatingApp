import { IRating } from "./rating"
import { IIngredient } from "./ingredient"

export type ISoup = {
    ID: string
    name: string
    shortDescr: string
    longDescr: string
    date: Date
    ratings: IRating[]
    avgRating: number
    ratingsCount: number
    ingredients: IIngredient[]
    isVeggie: number
    isSpicy: number
}
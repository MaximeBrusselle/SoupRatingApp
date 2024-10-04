import * as cds from "@sap/cds";
import { ISoup } from "./entities/soup";
import { IRating } from "./entities/rating";

export = (srv: cds.Service) => {
    srv.after("READ", "Soup", (soups: ISoup[]) => {
        console.log(soups);
        
        return soups.map(async (soup: ISoup) => {
            const ratings: IRating[] = soup.ratings;
            if (!ratings) {
                return {
                    ...soup,
                    ratings: [],
                    avgRating: 0,
                    ratingsCount: 0
                };
            }
            soup.ratingsCount = ratings?.length || 0;
            soup.avgRating = Math.round(ratings.reduce((sum: number, { rating }: IRating) => sum + rating, 0)*2 / ratings.length)/2;
            // soup.avgRating = 4;
            return soup;
        });
    })
};

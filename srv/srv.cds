using {flexso.cap.soup as my} from '../db/schema';

service SoupService {
    entity Soups   as projection on my.Soups;
    entity Ratings as projection on my.Ratings;
    entity Ingredients as projection on my.Ingredients;
}

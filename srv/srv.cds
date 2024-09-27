using {flexso.cap.soup as my} from '../db/schema';

service SoupService {
    entity Soup   as projection on my.Soup;
    entity Rating as projection on my.Rating;
}

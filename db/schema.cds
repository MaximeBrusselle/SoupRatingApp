using {
    managed,
    cuid,
} from '@sap/cds/common';

namespace flexso.cap.soup;

entity Soup : cuid, managed {
    name        : String(111);
    shortDescr  : String(111);
    longDescr   : String(333);
    date        : Date;
    ratings     : Association to many Rating
                      on ratings.soup = $self;
    avgRating   : Double;
    ratingsCount : Integer;
    ingredients : String;
    isVeggie    : Integer;
    isSpicy     : Integer;
}

entity Rating : cuid, managed {
    soup    : Association to Soup;
    rating  : Integer  @Validation.Minimum: 0  @Validation.Maximum: 5;
    comment : String(111);
}

// entity Ingredient : cuid, managed {
//     name  : String(111);
//     soups : Composition of many Soup.ingredients
//                 on soups.ingredient = $self;
// }

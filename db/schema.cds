using {
    managed,
    cuid,
} from '@sap/cds/common';

namespace flexso.cap.soup;

entity Soups : cuid, managed {
    name         : String(111)  @mandatory  @assert.range: {
        minLength: 1,
        maxLength: 111
    };
    shortDescr   : String(111)  @mandatory  @assert.range: {
        minLength: 1,
        maxLength: 111
    };
    longDescr    : String(500)  @assert.range: {maxLength: 500};
    date         : Date         @mandatory;
    ratings      : Association to many Ratings
                       on ratings.soup = $self;
    ingredients  : Association to many Ingredients
                       on ingredients.soup = $self;
    avgRating    : Double;
    ratingsCount : Integer;
    isVeggie     : Integer;
    isSpicy      : Integer;
}

entity Ratings : cuid, managed {
    soup    : Association to Soups;
    rating  : Integer     @Validation.Minimum: 0  @Validation.Maximum: 5  @mandatory;
    comment : String(111) @assert.range      : {maxLength: 111};
}

entity Ingredients : cuid, managed {
    soup     : Association to Soups;
    name     : String(111)  @mandatory  @assert.range: {
        minLength: 1,
        maxLength: 111
    };
    quantity : Double;
    uom      : String(111)  @mandatory  @assert.range: {
        minLength: 1,
        maxLength: 111
    };
}

// entity Ingredient : cuid, managed {
//     name  : String(111);
//     soups : Composition of many Soup.ingredients
//                 on soups.ingredient = $self;
// }

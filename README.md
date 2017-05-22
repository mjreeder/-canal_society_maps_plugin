Canal society Website important points:

new canals should not need to be added, but if something happens here is a guide
- If you need to add new canal:

    1. Add the canal in wordpress, not a point of interest
    2. Add the canal point in the kml dictionary. Make sure that names
       are the same in the dictionary. It would be best to add the point as the last
       index in the dictionary for the next step.
    3. Add a new block to the if/else statement to the populateDictionary function.
       Note that the indexes are the numbers corresponding to the indexes in the dictionary.
       So be sure that your index matches the index in the dictionary.
    4. Add the canal to the view all function
    5. Add the canal button to view in the index html.
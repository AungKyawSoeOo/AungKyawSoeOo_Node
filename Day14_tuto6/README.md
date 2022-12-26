# BIB OJT Node.js Tuto6 
- **URL**
```
localhost:3000 (To view static data from array) 

localhost:3000/api/movies 
  -get method -> To retrieve all movies
  -post method -> To create new movie (name,rating,year)
  -delete method ->To delete all movies

localhost:3000/api/movies/[movieName]
  -get method -> To retrieve specific movie with movieName
  -put method -> To update a movie with put method using movieName
  -patch method -> To update a movie with patch method using movieName
  -delete method -> To delete a movie with movieName

Note -> We need to type movie Name with space using %20 (when updating , deleting or retrieving movie with movie name)
Example: localhost:300/api/movies/Toy%20Story (Toy Story)
```

- **Installation**
```
git clone https://github.com/AungKyawSoeOo/AungKyawSoeOo_Node.git
cd Day14_tuto6
npm install
npm run dev

open localhost:3000/ in the browser
```

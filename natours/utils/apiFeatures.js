class APIFeatures {
    //Tour.find(), req.query
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      // 1) filtering
      // making shallow copy trick
      const queryObj = { ...this.queryString }; // use spread and change to obj
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
      // console.log( req.query,queryObj);
      // 2) Advanced filtering
      // postmanTest --> http://localhost:8000/api/v1/tours/?price[lt]=1500
      // {difficulty:'easy',duration:{$gte:5}}
      // {difficulty:'easy',duration:{gte:5}}
      let queryStr = JSON.stringify(queryObj);
      // \b mean exact that word
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
      // console.log(JSON.parse(queryStr));
      // let query=Tour.find(JSON.parse(queryStr));
    }
    sort() {
      // 3) Sorting
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        // method chaining
        this.query = this.query.sort(sortBy);
        // sort('price ratingsAverage')
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
    limitFields() {
      // 4 ) Field limiting
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
        // select('price name ...')
      } else {
        //exclude __v field
        this.query = this.query.select('-__v');
      }
      return this;
    }
    paginate() {
      // 5 ) Pagination
      // *1 is to change string to integer
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }

export default APIFeatures;
  
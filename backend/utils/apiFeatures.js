class APIFeatures{
    constructor(query, queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    //search for a specific product => /api/v1/products?keyword=cake
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }

        } : {}

        
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr};

        //removing fields from the Query
        const removeFields = ['keyword', 'limit', 'page'];
       
        // before delete queryCopy  => {keyword : 'apple',  category: 'Laptop'}
        removeFields.forEach(elem => delete queryCopy[elem]);     
        //after delete {category: 'Laptop'}
        console.log(queryCopy)

        //Advanced filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy);
        console.log(queryStr)
        queryStr= queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr));
         return this;
    }


    pagination(resPerPage){

        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip)
        return this;
    }
}

module.exports = APIFeatures;
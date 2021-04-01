const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'Please enter product name'],
        trim:true,
        maxLength: [100,'Product name has to be less then 100 characters']
    },

    price: {
        type:Number,
        required:[true, 'Please enter price'],
        maxLength: [5,'Price length has to be less then 5 characters'],
        default:0.0
    },

    description: {
        type:String,
        required:[true, 'Please enter product description']    
    },

    ratings:{
        type:Number,
        default:0
    },

    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],

    category:{      
            type:String,
            required: [true, 'Please enter a category'],
            enum:{
                values:[
                    'Patties',
                    'Refreshment',
                    'Bread',
                    'Caribbean Treats',
                    'Specialty Treats',
                    'Cakes',
                    'Catering',
                ],
                message:'Please select correct product category'
            }
    },

    /*  seller:{
        type:String,
        required:[true, 'Please enter a seller']
    },  */

    stock:{
        type:Number,
        required:[true, 'Please enter stock amount'],
        maxLength:[5,'stock length should be less than 5'],
        default:0
    },

    numOfReviews:{
        type:Number,
        default:0
    },

    reviews:[
        {
            name:{
                type:String,
                required:false
            },
            rating:{
                type:Number,
                required:false
            },
            comment:{
                type:String,
                required:false
            },
            dateCreated:{
                type:Date,
                default:Date.now
            }

        }
   ],
   user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
   },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);
import React, {Fragment, useEffect} from 'react'
import MetaData from '../components/layouts/MetaData'


import Product from './product/Product'
import Loader from './layouts/Loader'



import { useDispatch, useSelector } from 'react-redux'
import {useAlert} from 'react-alert'
import { getProducts } from '../actions/productActions'



const Home = ({match}) => {

    const alert = useAlert();
    const dispatch = useDispatch();

   // const { loading, products, error, productsCount} = useSelector(state => state.products)
    //const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)
    const { loading, products, error, productsCount} = useSelector(state => state.products);

    const keyword = match.params.keyword

    useEffect(()=>{

        if(error){
           return alert.error(error)
        }

        dispatch(getProducts(keyword));

       
    }, [dispatch, alert, error, keyword])

    return (
        <Fragment>
            {loading?<Loader/> : (
                <Fragment>
                    <MetaData title ={'Best Pastry in NYC'} />
                    <h1 id="products_heading">Tasty Caribbean Treats</h1>
                    <section id="products" className="container mt-5">
                    <div className="row">
                    {products && products.map(product =>(
                        <Product key = {product._id} product = {product}/>
                    ))}                            
                    </div>
                    </section>
                </Fragment>
            )}         
           
        </Fragment>
               
    )
}

export default Home

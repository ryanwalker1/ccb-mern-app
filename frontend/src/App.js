
import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'


//admin imports
import Dashboard from './components/admin/Dashboard';
import UpdateProduct from './components/admin/UpdateProduct'

//import './App.css';
import Header from './components/layouts/Header'
import Footer from './components/layouts/Footer'
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'
import Search from './components/layouts/Search'
import Login from './components/user/Login'
import Register from './components/user/Register'
import { loadUser } from './actions/userActions'
import store from './store'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/route/ProtectedRoute'
import NewProduct from './components/admin/NewProduct'

function App() {

  useEffect(() => {
    store.dispatch(loadUser())  

  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (

    <Router>
      <div className="App">
        <Header/>
        <div className="container container-fluid">
          <Route path = "/" component={Home} exact/>
          <Route path = "/search/:keyword" component={Home} exact/>
          <Route path = "/product/:id" component={ProductDetails} exact/>
          <Route path = "/login" component={Login} />
          <Route path = "/register" component={Register} />
          <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact />
          <ProtectedRoute path="/admin/product" isAdmin={true} component={NewProduct} exact />
          <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact />

        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;


import { Inter } from 'next/font/google'
import Layout from './Components/Layout'
import ProductItem from './Components/ProductItem'

import Product from '../../models/Product'
import db from './utils/db'
import { useContext } from 'react'
import { Store } from './utils/Store'
import axios from 'axios'
import { toast } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {


    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  }
  return (
    <div>
      <Layout title="Home page">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}>

            </ProductItem>
          ))}
        </div>
      </Layout>

    </div>
  )
}


export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();//laean =>get the product info..
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

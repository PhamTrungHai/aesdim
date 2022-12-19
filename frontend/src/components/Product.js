import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sản phẩm đã hết hàng');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <Card bg="secondary" border="light">
      <Link to={`/product/${product.slug}`}>
        <Card.Img variant="top" src={product.image} alt={product.name} />
      </Link>
      <Card.Body>
        <Link href={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
          <Rating
            rating={product.rating}
            numReviews={product.numReview}
          ></Rating>
          <Card.Text>{product.price} VND</Card.Text>
          {product.countInStock === 0 ? (
            <Button variant="light" disabled>
              Hết hàng
            </Button>
          ) : (
            <Button onClick={() => addToCartHandler(product)}>
              Thêm vào giỏ hàng
            </Button>
          )}
        </Link>
      </Card.Body>
    </Card>
  );
}
export default Product;

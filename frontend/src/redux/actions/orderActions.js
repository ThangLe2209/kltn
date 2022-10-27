import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS } from '../constants/orderConstants';
export const createOrder = (order) => async (dispatch, getState) => {
    console.log('asds', order);
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        const {
            token
        } = getState();
        console.log(token);
        const { data } = await Axios.post("/api/orders/", order, {
            headers: {
                Authorization: `${token}`,
            },
        });
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        dispatch({ type: CART_EMPTY });
        localStorage.removeItem("cartItems");
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
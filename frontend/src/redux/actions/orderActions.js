import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS } from '../constants/orderConstants';
export const createOrder = (order) => async (dispatch, getState) => {
    // console.log('asds', order);
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        const {
            token
        } = getState();
        // console.log(token);
        const { data } = await Axios.post("/api/orders/", order, {
            headers: {
                Authorization: `${token}`,
            },
        });
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        // dispatch({ type: CART_EMPTY });
        // localStorage.removeItem("cartItems");
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

export const detailsOrder = (orderId) => async (dispatch, getState) => {
    dispatch({type: ORDER_DETAILS_REQUEST, payload: orderId});
    try {
        const {
            token
        } = getState();
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        dispatch({type: ORDER_DETAILS_SUCCESS, payload: data});
    } catch(error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    };
}

export const payOrder=(order,paymentResult)=>async(
    dispatch,
    getState
)   =>{
        dispatch({type: ORDER_PAY_REQUEST, payload:{order,paymentResult}});
        try{
            const {
                token,
            }=getState();
            const { data } = await Axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            dispatch({type: ORDER_PAY_SUCCESS, payload: data});
            dispatch({ type: CART_EMPTY });
        localStorage.removeItem("cartItems")
        } catch(error){
            const message = 
            error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
        dispatch({type: ORDER_PAY_FAIL,payload:message});
        }
    };
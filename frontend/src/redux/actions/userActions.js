import Axios from 'axios';
import { showSuccessMessage } from '~/utils/notifyService';
import { CART_EMPTY } from '../constants/cartConstants';
import {
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_RESET,
    USER_DETAILS_SUCCESS,
    USER_SIGNIN_FAIL,
    USER_SIGNIN_FIRSTLOGIN,
    USER_SIGNIN_REQUEST,
    USER_SIGNIN_SUCCESS,
    USER_SIGNOUT,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_RESET,
    USER_UPDATE_PROFILE_SUCCESS,
} from '../constants/userConstants';

export const fetchUser = async (token) => {
    const res = await Axios.get('/api/users/infor', {
        headers: { Authorization: token },
    });
    return res;
};

export const signin = (email, password) => async (dispatch) => {
    dispatch({
        type: USER_SIGNIN_REQUEST,
        payload: { email, password },
    });
    try {
        const login = await Axios.post('/api/users/login', {
            email,
            password,
        });
        dispatch({ type: USER_SIGNIN_FIRSTLOGIN, payload: { isLogged: true } });
        localStorage.setItem('firstLogin', true);
    } catch (error) {
        // console.log(error);
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload: error.response && error.response.data.msg ? error.response.data.msg : error.message,
        });
    }
};

export const signout = () => async (dispatch) => {
    await Axios.get('/api/users/logout');
    localStorage.removeItem('firstLogin');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cartSavePaymentMethod');

    dispatch({ type: USER_SIGNOUT });
    // Tự làm test thử => Cứ chỗ nào dispatch làm thay đổi state của store nào mà chỗ kia dùng useSelector store đó thì thg function component đó sẽ bị render lại
    dispatch({ type: CART_EMPTY });
    dispatch({ type: USER_DETAILS_RESET });
    // window.location.href = "/";
};
export const detailsUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
    try {
        const { token } = getState();
        const { data } = await Axios.get(`/api/users/${userId}`, {
            headers: { Authorization: token },
        });
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.msg ? error.response.data.msg : error.message,
        });
    }
};
export const updateUserProfile = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
    try {
        const { token } = getState();
        const { data } = await Axios.put(`/api/users/profile`, user, {
            headers: { Authorization: token },
        });
        showSuccessMessage('Profile Updated Successfully', 'topRight');
        dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.msg ? error.response.data.msg : error.message,
        });
    }
};

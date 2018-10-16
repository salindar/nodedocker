import { SET_MESSAGE } from '../types/actionConstants';
export const setMessage = (message) => {
    return dispatch => {
        dispatch({
            type: SET_MESSAGE,
            payload: {
                message
            }
        })
    }
}
import { SET_SELECTED_FILE,SET_NETWORK_ACTION,SET_CLIP_BOARD_ITEM } from '../types/actionConstants';
export const setSelectedFile = (fileName) => {
    console.log('setSelectedFile');
    return dispatch => {
        dispatch({
            type: SET_SELECTED_FILE,
            payload: {
                fileName
            }
        })
    }
}

export const setNetworkEvent = (status) => {
    return dispatch => {
        dispatch({
            type: SET_NETWORK_ACTION,
            payload: {
                status
            }
        })
    }
}

export const setClipBoadItem = (url) => {
    return dispatch => {
        dispatch({
            type: SET_CLIP_BOARD_ITEM,
            payload: {
                url
            }
        })
    }
}
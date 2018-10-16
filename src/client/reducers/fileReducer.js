import { SET_MESSAGE, SET_SELECTED_FILE, SET_NETWORK_ACTION,SET_CLIP_BOARD_ITEM } from '../types/actionConstants';
const initState = {
    message: '',
    fileName: '',
    loading: false,
    url: ''
}
export default (state = initState, action) => {
    switch (action.type) {
        case SET_MESSAGE:
            return { ...state, message: action.payload.message }
        case SET_SELECTED_FILE:
            return { ...state, fileName: action.payload.fileName }
        case SET_NETWORK_ACTION:
            return { ...state, loading: action.payload.status }
        case SET_CLIP_BOARD_ITEM:
            return { ...state, url: action.payload.url }
        default:
            return state
    }
}
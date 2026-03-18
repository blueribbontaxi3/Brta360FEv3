import { combineReducers } from "redux";
import user_login from "../../app/pages/duck/login/ducks/reducers";

const rootReducer = combineReducers({
  user_login:user_login
});

export default rootReducer;


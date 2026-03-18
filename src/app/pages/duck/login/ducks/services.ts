import axiosService from "utils/axiosInceptor";
import * as action_types from "./constants";

export const userLoginService = (param = {}) => {
  return async (dispatch: any) => {
    try {
      const data: any = await axiosService.post(`/auth/login`, param)

      dispatch({
        type: action_types.LOGIN_USER,
        data: data.data,
      });
    } catch (e) {
      console.error("Error logging in:", e);
      dispatch({
        type: action_types.LOGIN_USER,
        data: e,
      });
    }
  };
};
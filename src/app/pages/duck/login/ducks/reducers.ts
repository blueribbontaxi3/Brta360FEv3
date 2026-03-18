import { LOGIN_USER, LOGIN_USER_PERMISSION, LOGIN_USER_ROLE, LOGIN_USER_MEMBER, LOGIN_USER_SUPER_ADMIN } from "./constants";

const initialState = {
  auth_user: null,
  auth_permission: [],
  auth_role: [],
};

const user_login = (state = initialState, action: any): any => {
  const { type, data } = action;

  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        auth_user: data,
      };

    case LOGIN_USER_PERMISSION:
      return {
        ...state,
        auth_permission: data,
      };

    case LOGIN_USER_ROLE:
      return {
        ...state,
        auth_role: data,
      };

    case LOGIN_USER_MEMBER:
      return {
        ...state,
        auth_member: data,
      };

    case LOGIN_USER_SUPER_ADMIN:
      return {
        ...state,
        auth_super_admin: data,
      };

    default:
      return state;
  }
};

export default user_login;

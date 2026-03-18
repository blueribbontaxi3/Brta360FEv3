import { Dispatch } from "redux";
import { Example1 } from "./types";
import { EXAMPLE_CONSTANT } from "./constants";
import { exampleService } from "./services";

function dispatchExampleInit(): Example1 {
  return {
    type: EXAMPLE_CONSTANT,
  };
}

export function actionExample() {
  return (dispatch: Dispatch) => {
    dispatch(dispatchExampleInit());
    return exampleService();
  };
}

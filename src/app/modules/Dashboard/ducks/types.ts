import { Action } from "redux";

export interface Example1 extends Action {
  type: "EXAMPLE_TYPE";
}

export interface Example2 extends Action {
  type: "EXAMPLE_TYPE";
}

export type exampleActions =
  | Example1
  | Example2;

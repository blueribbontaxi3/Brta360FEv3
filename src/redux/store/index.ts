import { configureStore } from '@reduxjs/toolkit'
import rootReducer from "../reducers/root.reducer";

export default configureStore({
  reducer: rootReducer,
})

// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from "redux-thunk";


// const middleware = [thunk];

// const store = createStore(
//   rootReducer,
//   composeWithDevTools(applyMiddleware(...middleware)),
// );

// export default store;


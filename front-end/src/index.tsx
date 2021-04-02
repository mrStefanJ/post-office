import React from "react";

/*
Import this to prevent MobX warning about observer batching not have been configured
(docs: https://github.com/mobxjs/mobx-react#observer-batching)
*/
import "mobx-react/batchingForReactDom";

import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

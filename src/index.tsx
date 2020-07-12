import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

// Mount root component.
const domRoot = document.querySelector("#react-root");
ReactDOM.render(<App /> , domRoot);

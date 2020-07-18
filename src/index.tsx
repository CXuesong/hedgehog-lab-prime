/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typedef.d.ts" />
/// <reference path="./hedgehog-lab.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

// Mount root component.
const domRoot = document.querySelector("#react-root");
ReactDOM.render(<App />, domRoot);

/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typedef.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { initializeIcons } from "@fluentui/react";
import { App } from "./App";

initializeIcons();

// Mount root component.
const domRoot = document.querySelector("#react-root");
ReactDOM.render(<App />, domRoot);

import * as React from "react";
import * as ht from "hedgehog-transpiler";

export const App: React.FC = () => {
    window.ht = ht;
    return <h2>It works.</h2>;
};

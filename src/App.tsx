import * as React from "react";
import transpilerCore from "hedgehog-lab/transpiler_core";
import { executeOutput } from "hedgehog-lab/hedgehog_runtime";

export const App: React.FC = () => {
    function executeSomething() {
        const code = transpilerCore(`const x = mat([1,2,3,4]);
print(x + x)`);
        const result = executeOutput(code);
        window.alert(JSON.stringify(result));
    }
    return (
        <div>
            <h2>It works.</h2>
            <button type="button" onClick={executeSomething}>Execute something</button>
        </div>
    );
};

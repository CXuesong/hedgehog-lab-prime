import * as React from "react";
import transpilerCore from "hedgehog-lab/core/transpiler/transpiler-core";
import { executeOutput } from "hedgehog-lab/core/runtime";
import { EditorState, EditorView, basicSetup } from "@codemirror/next/basic-setup";
import { javascript } from "@codemirror/next/lang-javascript";

export const App: React.FC = () => {
    function executeSomething() {
        const code = transpilerCore(`const x = mat([1,2,3,4]);
print(x + x)`);
        const result = executeOutput(code);
        window.alert(JSON.stringify(result));
    }
    const editorState = React.useMemo(() => EditorState.create({ doc: `print("Hello, world!");`, extensions: [basicSetup, javascript()] }), []);
    const editorViewRef = React.useRef<EditorView>();
    function onEditorContainerChanged(domContainer: HTMLElement | null): void {
        if (editorViewRef.current) {
            editorViewRef.current.destroy();
            editorViewRef.current = undefined;
        }
        if (domContainer) {
            editorViewRef.current = new EditorView({ state: editorState, parent: domContainer });
        }
    }
    return (
        <div>
            <h2>It works.</h2>
            <div ref={onEditorContainerChanged} />
            <button type="button" onClick={executeSomething}>Execute something</button>
        </div>
    );
};

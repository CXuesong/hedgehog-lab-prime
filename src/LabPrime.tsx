import { basicSetup, EditorState, EditorView } from "@codemirror/next/basic-setup";
import { javascript } from "@codemirror/next/lang-javascript";
import { PrimaryButton } from "@fluentui/react";
import OutputItem from "hedgehog-lab/core/output/output-item";
import { executeOutput } from "hedgehog-lab/core/runtime";
import transpilerCore from "hedgehog-lab/core/transpiler/transpiler-core";
import * as React from "react";
import { Output } from "./hegehog-lab-ts/Output";

const editorPreset = `// Let's get started!
print("Hello, world!");

const x = mat([1,2,3,4]);
print(x + x)
`;

export const LabPrimeRoot: React.FC = () => {
    const editorState = React.useMemo(() => EditorState.create({
        doc: editorPreset,
        extensions: [basicSetup, javascript()],
    }), []);
    const editorViewRef = React.useRef<EditorView>();
    const [outputList, setOutputList] = React.useState<OutputItem[] | undefined>();
    function onEditorContainerChanged(domContainer: HTMLElement | null): void {
        if (editorViewRef.current) {
            editorViewRef.current.destroy();
            editorViewRef.current = undefined;
        }
        if (domContainer) {
            editorViewRef.current = new EditorView({ state: editorState, parent: domContainer });
        }
    }
    function onExecuteButtonClick() {
        const code = transpilerCore(String(editorState.doc));
        const result = executeOutput(code);
        setOutputList(result);
    }
    return (
        <div>
            <h2>It works.</h2>
            <div ref={onEditorContainerChanged} />
            <PrimaryButton onClick={onExecuteButtonClick}>Execute something</PrimaryButton>
            {outputList && <Output outputItemList={outputList} />}
        </div>
    );
};

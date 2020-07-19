import {
    CommandBar, ICommandBarItemProps, PrimaryButton, Spinner, Text,
} from "@fluentui/react";
import OutputItem from "hedgehog-lab/core/output/output-item";
import { executeOutput } from "hedgehog-lab/core/runtime";
import transpilerCore from "hedgehog-lab/core/transpiler/transpiler-core";
import * as React from "react";
import type { CodeEditor } from "./CodeEditor";
import { Output } from "./hegehog-lab-ts/Output";
import { AppThemeContext } from "./react/context";

const editorPreset = `// Let's get started!
print("Hello, world!");

const x = mat([1,2,3,4]);
print(x + x)
`;

const LazyCodeEditor = React.lazy(() => import("./CodeEditor").then((m) => ({ default: m.CodeEditor })));

export const LabPrimeRoot: React.FC = () => {
    const theme = React.useContext(AppThemeContext);
    const codeEditorRef = React.useRef<CodeEditor>(null);
    const [outputList, setOutputList] = React.useState<OutputItem[] | undefined>();
    function onExecuteButtonClick() {
        if (!codeEditorRef.current) return;
        const code = transpilerCore(codeEditorRef.current.editorState.sliceDoc());
        const result = executeOutput(code);
        setOutputList(result);
    }
    const commandBarItems = React.useMemo<ICommandBarItemProps[]>(() => [
        {
            key: "Theme",
            text: "Theme",
            iconProps: { iconName: "Color" },
            subMenuProps: {
                items: [
                    {
                        key: "Light",
                        text: "Light",
                        canCheck: true,
                        checked: theme.config.theme === "light",
                        onClick: () => theme.setConfig({ theme: "light" }),
                    },
                    {
                        key: "Dark",
                        text: "Dark",
                        canCheck: true,
                        checked: theme.config.theme === "dark",
                        onClick: () => theme.setConfig({ theme: "dark" }),
                    },
                ],
            },
        },
    ], [theme]);
    return (
        <div>
            <Text variant="xxLarge">Hedgehog Lab Prime</Text>
            <CommandBar items={commandBarItems} />
            <React.Suspense fallback={<Spinner label="Loading editor…" />}>
                <LazyCodeEditor ref={codeEditorRef} initialContent={editorPreset} />
            </React.Suspense>
            <PrimaryButton onClick={onExecuteButtonClick}>Execute</PrimaryButton>
            {outputList && <Output outputItemList={outputList} />}
        </div>
    );
};

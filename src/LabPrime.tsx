import { basicSetup, EditorState, EditorView } from "@codemirror/next/basic-setup";
import { oneDark } from "@codemirror/next/theme-one-dark";
import { javascript } from "@codemirror/next/lang-javascript";
import {
    CommandBar, ICommandBarItemProps, PrimaryButton, Text,
} from "@fluentui/react";
import OutputItem from "hedgehog-lab/core/output/output-item";
import { executeOutput } from "hedgehog-lab/core/runtime";
import transpilerCore from "hedgehog-lab/core/transpiler/transpiler-core";
import * as React from "react";
import { Extension, tagExtension } from "@codemirror/next/state";
import { AppThemeContext } from "./react/context";
import { Output } from "./hegehog-lab-ts/Output";
// import Scss from "./LabPrime.scss";

const editorPreset = `// Let's get started!
print("Hello, world!");

const x = mat([1,2,3,4]);
print(x + x)
`;

const ThemeExtensionGroup = Symbol("ThemeExtensionGroup");

export const LabPrimeRoot: React.FC = () => {
    const theme = React.useContext(AppThemeContext);
    const editorView = React.useMemo(() => {
        const state = EditorState.create({
            doc: editorPreset,
            extensions: [
                basicSetup,
                javascript(),
                tagExtension(ThemeExtensionGroup, []),
            ],
        });
        return new EditorView({ state });
    }, []);
    const [outputList, setOutputList] = React.useState<OutputItem[] | undefined>();
    React.useEffect(() => {
        const themeExtensions: Extension[] = [];
        if (theme.config.theme === "dark") {
            themeExtensions.push(oneDark);
        }
        editorView.dispatch({ reconfigure: { [ThemeExtensionGroup]: themeExtensions } });
    }, [theme.config.theme]);
    function onEditorContainerChanged(domContainer: HTMLElement | null): void {
        if (domContainer) {
            domContainer.appendChild(editorView.dom);
        } else {
            editorView.dom.remove();
        }
    }
    function onExecuteButtonClick() {
        const code = transpilerCore(editorView.state.sliceDoc());
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
            <div ref={onEditorContainerChanged} />
            <PrimaryButton onClick={onExecuteButtonClick}>Execute</PrimaryButton>
            {outputList && <Output outputItemList={outputList} />}
        </div>
    );
};

import {
    CommandBar, ContextualMenuItemType, ICommandBarItemProps, Link, PrimaryButton, ProgressIndicator, Spinner, Stack, Text, TooltipHost, VerticalDivider,
} from "@fluentui/react";
import * as Comlink from "comlink";
import { OutputItem } from "hedgehog-lab/core/output/output-item";
import { tutorials } from "hedgehog-lab/lab/tutorials";
import * as React from "react";
import { ICompilationResult } from "./workers/compilationResult";
import { ExecutionSandbox } from "./workers/executionSandbox";
import type { CodeEditor } from "./CodeEditor";
import { JSErrorView } from "./components/JSErrorView";
import { OutputList } from "./components/Output";
import Scss from "./LabPrime.scss";
import { AppThemeContext } from "./react/context";
import CompilerWorker from "./workers/compiler.worker";
import { CompilerInstance } from "./workers/compilerInstance";
import ExecutorWorker from "./workers/executor.worker";

const editorPreset = `// Let's get started!
print("Hello, world!");

const x = mat([1,2,3,4]);
print(x + x)
`;

const LazyCodeEditor = React.lazy(() => import("./CodeEditor").then((m) => ({ default: m.CodeEditor })));

const LOCAL_STORAGE_LAST_EDITOR_CONTENT_KEY = "hedgehog-prime-last-editor-content";

export const LabPrimeRoot: React.FC = () => {
    const theme = React.useContext(AppThemeContext);
    const codeEditorRef = React.useRef<CodeEditor>(null);
    const [outputList, setOutputList] = React.useState<OutputItem[] | undefined>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [executionError, setExecutionError] = React.useState<any>();
    const [executionState, setExecutionState] = React.useState<"idle" | "compiling" | "executing">("idle");
    const isIdle = executionState === "idle";
    const lastEditorContent = React.useMemo(() => localStorage.getItem(LOCAL_STORAGE_LAST_EDITOR_CONTENT_KEY) || editorPreset, []);
    const editorStartingEdgeRef = React.useRef<HTMLDivElement>(null);
    const outputStartingEdgeRef = React.useRef<HTMLDivElement>(null);
    function saveEditorContent(): void {
        if (!codeEditorRef.current) return;
        const content = codeEditorRef.current.editorState.sliceDoc();
        if (content.length < 1024 * 4) {
            localStorage.setItem(LOCAL_STORAGE_LAST_EDITOR_CONTENT_KEY, content);
        }
    }
    async function onExecuteButtonClick() {
        if (!codeEditorRef.current) return;
        if (!isIdle) return;
        window.setTimeout(() => {
            outputStartingEdgeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
        saveEditorContent();
        const content = codeEditorRef.current.editorState.sliceDoc();
        const disposal: Array<() => void> = [];
        const dispose = () => {
            let d: (() => void) | undefined;
            // eslint-disable-next-line no-cond-assign
            while (d = disposal.pop()) {
                try {
                    d();
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error("Error when disposing.", err);
                }
            }
        };
        try {
            setExecutionState("compiling");
            let compiled: ICompilationResult | undefined;
            {
                const worker = new CompilerWorker();
                disposal.push(() => worker.terminate());
                const compiler = Comlink.wrap<CompilerInstance>(worker);
                disposal.push(() => compiler[Comlink.releaseProxy]());
                compiled = await compiler.compile(content);
                dispose();
            }
            setExecutionState("executing");
            {
                const worker = new ExecutorWorker();
                disposal.push(() => worker.terminate());
                const executor = Comlink.wrap<ExecutionSandbox>(worker);
                disposal.push(() => executor[Comlink.releaseProxy]());
                const result = await executor.execute(compiled);
                dispose();
                setOutputList(result);
                setExecutionError(undefined);
            }
        } catch (err) {
            setExecutionError(err);
        } finally {
            dispose();
            setExecutionState("idle");
        }
    }
    // Save editor content as draft when unmounting the component.
    React.useEffect(() => {
        window.addEventListener("blur", saveEditorContent);
        return () => {
            saveEditorContent();
        };
    }, []);
    const commandBarItems = React.useMemo<ICommandBarItemProps[]>(() => [
        {
            key: "Run",
            text: "Compile & Run",
            iconProps: { iconName: "Play" },
            onClick: () => { onExecuteButtonClick(); },
            disabled: !isIdle,
        },
        {
            key: "D1",
            itemType: ContextualMenuItemType.Divider,
            onRender: () => <VerticalDivider />,
        },
        {
            key: "ScrollToEditor",
            text: "Scroll to editor",
            iconOnly: true,
            iconProps: { iconName: "Up" },
            onClick: () => editorStartingEdgeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        },
        {
            key: "ScrollToOutput",
            text: "Scroll to output",
            iconOnly: true,
            iconProps: { iconName: "Down" },
            onClick: () => outputStartingEdgeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        },
        {
            key: "Tutorials",
            text: "Tutorials",
            subMenuProps: {
                onItemClick: (e, item) => {
                    if (!item || !codeEditorRef.current) return;
                    const tutorialItem = item.data as typeof tutorials[number];
                    codeEditorRef.current.setContent(tutorialItem.source);
                },
                items: tutorials.map((t, i) => ({
                    key: `T${i}`,
                    data: t,
                    text: t.description,
                })),
            },
        },
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
        {
            key: "D2",
            itemType: ContextualMenuItemType.Divider,
            onRender: () => <VerticalDivider />,
        },
        {
            key: "About",
            text: "About",
            iconProps: { iconName: "ContactInfo" },
            subMenuProps: {
                items: [
                    {
                        key: "HedgehogPrimeGitHub",
                        text: "Star HedgeHog Lab Prime on GitHub",
                        secondaryText: "CXuesong/hedgehog-lab-prime",
                        href: "https://github.com/CXuesong/hedgehog-lab-prime",
                        target: "_blank",
                    },
                    {
                        key: "HedgehogGitHub",
                        text: "Star HedgeHog Lab on GitHub",
                        secondaryText: "lidangzzz/hedgehog-lab",
                        href: "https://github.com/lidangzzz/hedgehog-lab",
                        target: "_blank",
                    },
                    {
                        key: "D1",
                        itemType: ContextualMenuItemType.Divider,
                    },
                    {
                        key: "GoHedgehog",
                        text: "Switch back to Hedgehog Lab",
                        secondaryText: "lidangzzz/hedgehog-lab",
                        href: "https://hedgehog-lab.github.io/",
                        target: "_self",
                    },
                ],
            },
        },
    ], [theme, isIdle]);
    const executionProgressDescription = (() => {
        switch (executionState) {
            case "compiling": return "Compiling…";
            case "executing": return "Executing…";
            default: return executionState;
        }
    })();
    return (
        <div>
            <div ref={editorStartingEdgeRef} />
            <Stack horizontal wrap tokens={{ padding: 8, childrenGap: 16 }} verticalAlign="baseline">
                <TooltipHost content="the alternative UI for hedgehog-lab!">
                    <Text variant="xLarge">Hedgehog Lab <Text>Prime</Text></Text>
                </TooltipHost>
                <Link href="https://github.com/CXuesong/hedgehog-lab-prime" target="_blank">Star it on GitHub</Link>
                <Link href="https://hedgehog-lab.github.io/" target="_self">Go back to Hedgehog Lab</Link>
            </Stack>
            <CommandBar className={Scss.toolbar} items={commandBarItems} />
            <React.Suspense fallback={<Spinner label="Loading editor…" />}>
                <LazyCodeEditor ref={codeEditorRef} initialContent={lastEditorContent} />
            </React.Suspense>
            <div ref={outputStartingEdgeRef} />
            <PrimaryButton onClick={onExecuteButtonClick} disabled={!isIdle}>Compile &amp; run</PrimaryButton>
            <div className={Scss.outputContainer}>
                {executionError !== undefined && <JSErrorView className={Scss.outputErrorRoot} headerClassName={Scss.outputErrorHeader} error={executionError} />}
                {isIdle || <ProgressIndicator label="Working" description={executionProgressDescription} />}
                <OutputList items={outputList || []} />
            </div>
        </div>
    );
};

import { basicSetup, EditorState, EditorView } from "@codemirror/next/basic-setup";
import { javascript, javascriptSyntax } from "@codemirror/next/lang-javascript";
import { Extension, tagExtension } from "@codemirror/next/state";
// import Scss from "./LabPrime.scss";
// import { StreamSyntax } from "@codemirror/next/stream-syntax";
import { oneDark } from "@codemirror/next/theme-one-dark";
import * as React from "react";
import { AppThemeKey } from "./react/context";

const ThemeExtensionGroup = Symbol("ThemeExtensionGroup");

export interface ICodeEditorProps {
    initialContent?: string;
    theme?: AppThemeKey;
}

export class CodeEditor extends React.PureComponent<ICodeEditorProps> {
    private _editorContainer: HTMLElement | undefined;

    private _lastEditorState: EditorState;

    public editorView: EditorView | undefined;

    public constructor(props: Readonly<ICodeEditorProps>) {
        super(props);
        this._lastEditorState = EditorState.create({
            doc: this.props.initialContent,
            extensions: [
                basicSetup,
                javascript(),
                // Known issue: after 1 theme switch and 1 JS autocompletion, CM theme will be reverted.
                // Let user restart the app after theme-switching to mitigate the issue.
                tagExtension(ThemeExtensionGroup, this.props.theme === "dark" ? [oneDark] : []),
                javascriptSyntax,
            ],
        });
    }

    public componentDidMount(): void {
        this.editorView = new EditorView({ state: this._lastEditorState, parent: this._editorContainer });
    }

    public componentDidUpdate(prevProps: Readonly<ICodeEditorProps>): void {
        if (prevProps.theme !== this.props.theme && this.editorView) {
            const themeExtensions: Extension[] = [];
            if (this.props.theme === "dark") {
                themeExtensions.push(oneDark);
            }
            this.editorView.dispatch({ reconfigure: { [ThemeExtensionGroup]: themeExtensions } });
        }
    }

    public componentWillUnmount(): void {
        if (this.editorView) {
            this._lastEditorState = this.editorView.state;
            this.editorView.destroy();
            this.editorView = undefined;
        }
    }

    public get editorState(): EditorState {
        return this.editorView ? this.editorView.state : this._lastEditorState;
    }

    public setContent(content: string): void {
        if (!this.editorView) throw new Error("Not implemented.");
        const { editorView } = this;
        editorView.dispatch(editorView.state.update({
            changes: {
                from: 0,
                to: editorView.state.doc.length,
                insert: content,
            },
        }));
    }

    private _onEditorContainerChanged = (domContainer: HTMLElement | null) => {
        if (this.editorView) {
            if (domContainer) {
                domContainer.appendChild(this.editorView.dom);
            } else {
                this.editorView.dom.remove();
            }
        }
        this._editorContainer = domContainer || undefined;
    }

    public render(): React.ReactNode {
        return (<div ref={this._onEditorContainerChanged} />);
    }
}

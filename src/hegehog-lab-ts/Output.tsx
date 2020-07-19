import { List } from "@fluentui/react";
import OutputItem from "hedgehog-lab/core/output/output-item";
import PropTypes from "prop-types";
import * as React from "react";
import Markdown from "react-markdown";
import MathJax from "react-mathjax";
import Plot from "react-plotly.js";

export interface IOutputProps {
    outputItemList: OutputItem[]
}

export const Output: React.FC<IOutputProps> = (props) => {
    const onRenderItem = React.useCallback((item?: OutputItem, index?: number) => {
        if (!item || index == null) return null;
        if (item.isDraw()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return typeof item.data === "object" && (<Plot data={item.data} layout={item.layout as any} />);
        }
        if (item.isTex()) {
            return typeof item.text === "string" && (
                <MathJax.Provider>
                    <div>
                        <MathJax.Node inline formula={item.text} />
                    </div>
                </MathJax.Provider>
            );
        }
        if (item.isFormulaTex()) {
            return typeof item.text === "string" && (
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={item.text} />
                    </div>
                </MathJax.Provider>
            );
        }
        if (item.isMarkdown()) {
            return typeof item.text === "string" && <Markdown source={item.text} />;
        }
        if (item.isPrint()) {
            return typeof item.text === "string" && <pre>{item.text}</pre>;
        }
        return undefined;
    }, []);
    return (<List<OutputItem> items={props.outputItemList} onRenderCell={onRenderItem} />);
};
Output.displayName = "Output";
Output.propTypes = {
    outputItemList: PropTypes.arrayOf(PropTypes.instanceOf(OutputItem).isRequired).isRequired,
};

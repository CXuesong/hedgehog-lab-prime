import OutputItem from "hedgehog-lab/core/output/output-item";
import * as React from "react";
import Markdown from "react-markdown";
import MathJax from "react-mathjax";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";

export interface IOutputProps {
    outputItemList: OutputItem[]
}

export const Output: React.FC<IOutputProps> = (props) => {
    const { outputItemList } = props;
    const items = outputItemList.map((item) => {
        if (item.isDraw()) {
            return typeof item.data === "object" && (<Plot data={item.data} layout={item.layout} />);
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
    });

    return (
        <>
            {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>{item}</React.Fragment>
            ))}
        </>
    );
};
Output.propTypes = {
    outputItemList: PropTypes.arrayOf(PropTypes.instanceOf(OutputItem).isRequired).isRequired,
};

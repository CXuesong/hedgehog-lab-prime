import { List, Stack, StackItem } from "@fluentui/react";
import OutputItem from "hedgehog-lab/core/output/output-item";
import PropTypes from "prop-types";
import * as React from "react";
import Markdown from "react-markdown";
import MathJax from "react-mathjax";
import Plot from "react-plotly.js";
import Scss from "./Output.scss";

export interface IOutputItemViewProps {
    item: OutputItem;
}

export const OutputItemView: React.FC<IOutputItemViewProps> = React.memo<IOutputItemViewProps>((props) => {
    const { item } = props;
    function buildInvalidDataPlaceholder(): React.ReactElement {
        return (<div>Invalid data.</div>);
    }
    function buildEmptyDataPlaceholder(): React.ReactElement {
        return (<div>Empty data.</div>);
    }
    if (item.isDraw()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (typeof item.data === "object" && <Plot data={item.data} layout={item.layout as any} />) || buildInvalidDataPlaceholder();
    }
    if (item.isTex()) {
        return (typeof item.text === "string" && (
            <MathJax.Provider>
                <div>
                    <MathJax.Node inline formula={item.text} />
                </div>
            </MathJax.Provider>
        )) || buildInvalidDataPlaceholder();
    }
    if (item.isFormulaTex()) {
        return (typeof item.text === "string" && (
            <MathJax.Provider>
                <div>
                    <MathJax.Node formula={item.text} />
                </div>
            </MathJax.Provider>
        )) || buildInvalidDataPlaceholder();
    }
    if (item.isMarkdown()) {
        return (typeof item.text === "string" && <Markdown source={item.text} />) || buildEmptyDataPlaceholder();
    }
    if (item.isPrint()) {
        return (typeof item.text === "string" && <pre>{item.text}</pre>) || buildEmptyDataPlaceholder();
    }
    return (<div>[Entry cannot be rendered: {String(item)}]</div>);
});
OutputItemView.displayName = "OutputItemView";
OutputItemView.propTypes = {
    item: PropTypes.instanceOf(OutputItem).isRequired,
};

export interface IOutputListItemContainerProps {
    index: number;
    item: OutputItem;
}

export const OutputListItemContainer: React.FC<IOutputListItemContainerProps> = (props) => {
    const { index, item } = props;
    return (
        <Stack horizontal className={Scss.listItemContainer} tabIndex={0}>
            <StackItem className={Scss.itemIndex}>{index}:</StackItem>
            <StackItem className={Scss.itemContent}><OutputItemView item={item} /></StackItem>
        </Stack>
    );
};
OutputListItemContainer.displayName = "OutputListItemContainer";
OutputListItemContainer.propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.instanceOf(OutputItem).isRequired,
};

export interface IOutputListProps {
    items: OutputItem[]
}

export const OutputList: React.FC<IOutputListProps> = (props) => {
    const onRenderItem = React.useCallback((item?: OutputItem, index?: number) => {
        if (!item || index == null) return null;
        return (<OutputListItemContainer key={index} index={index} item={item} />);
    }, []);
    return (<List<OutputItem> items={props.items} onRenderCell={onRenderItem} />);
};
OutputList.displayName = "OutputList";
OutputList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.instanceOf(OutputItem).isRequired).isRequired,
};

/* eslint-disable react/prop-types */
import * as React from "react";

export interface IJSErrorView {
    className?: string;
    style?: React.CSSProperties;
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
}

export const JSErrorView: React.FC<IJSErrorView> = (props) => {
    const {
        error, className, style, headerClassName, headerStyle,
    } = props;
    if (error instanceof Error) {
        return (
            <div className={className} style={style}>
                <div className={headerClassName} style={headerStyle}>Error [{error.name}]: {error.message}</div>
                <div>{error.stack || "No stack trace information."}</div>
            </div>
        );
    }
    if (error && typeof error === "object") {
        return (
            <div className={className}>
                <div className={headerClassName} style={headerStyle}>General Error object: {String(error)}</div>
                <div>{JSON.stringify(error)}</div>
            </div>
        );
    }
    return (
        <div className={className}>
            <div className={headerClassName} style={headerStyle}>General Error ({typeof error}): {String(error)}</div>
        </div>
    );
};

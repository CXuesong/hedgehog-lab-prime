import * as React from "react";

export type AppThemeKey = "light" | "dark";

export interface IAppThemeConfig {
    theme: AppThemeKey;
}
export interface IAppThemeContextValue {
    config: IAppThemeConfig;
    setConfig: (config: IAppThemeConfig) => void;
}
export const AppThemeContext = React.createContext<IAppThemeContextValue>({
    config: {
        theme: "light",
    },
    setConfig: () => {
        throw new Error("No AppThemeContext applied.");
    },
});
AppThemeContext.displayName = "AppThemeContext";

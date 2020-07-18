import { Customizer } from "@fluentui/react";
import * as React from "react";
import { AppThemeContext, IAppThemeConfig, IAppThemeContextValue } from "./react/context";
import { fluentDarkTheme } from "./react/fluent-ui";
import { LabPrimeRoot } from "./LabPrime";

function parseThemeConfig(serialized: string): IAppThemeConfig | undefined {
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized) as IAppThemeConfig;
    if (!parsed || typeof parsed !== "object") return undefined;
    return parsed;
}

const LOCAL_STORAGE_THEME_KEY = "hedgehog-prime-theme";

export const App: React.FC = () => {
    const [themeConfig, setThemeConfig] = React.useState<IAppThemeConfig>(() => {
        const v = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
        return (v && parseThemeConfig(v)) || { theme: "light" };
    });
    const appThemeContextValue = React.useMemo<IAppThemeContextValue>(() => ({
        config: themeConfig,
        setConfig: (config) => {
            setThemeConfig(config);
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(config));
        },
    }), [themeConfig]);
    React.useEffect(() => {
        const { classList } = document.body;
        classList.remove("app-theme-light", "app-theme-dark");
        classList.add(`app-theme-${themeConfig.theme}`);
    }, [themeConfig.theme]);
    return (
        <Customizer {...themeConfig.theme === "dark" ? fluentDarkTheme : {}}>
            <AppThemeContext.Provider value={appThemeContextValue}>
                <LabPrimeRoot />
            </AppThemeContext.Provider>
        </Customizer>
    );
};

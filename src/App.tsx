import { Customizer, Spinner, Stack } from "@fluentui/react";
import * as React from "react";
import { AppThemeContext, IAppThemeConfig, IAppThemeContextValue } from "./react/context";
import { fluentDarkTheme } from "./react/fluent-ui";
import Scss from "./App.scss";

function parseThemeConfig(serialized: string): IAppThemeConfig | undefined {
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized) as IAppThemeConfig;
    if (!parsed || typeof parsed !== "object") return undefined;
    return parsed;
}

const LOCAL_STORAGE_THEME_KEY = "hedgehog-prime-theme";

const LazyLabPrimeRoot = React.lazy(() => import("./LabPrime").then((m) => ({ default: m.LabPrimeRoot })));

export const LoadingScreen: React.FC = () => {
    return (
        <Stack className={Scss.primarySpinnerContainer} verticalAlign="center">
            <Spinner label="Loading Hedgehog Prime…" />
        </Stack>
    );
};

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
                <React.Suspense fallback={<LoadingScreen />}>
                    <LazyLabPrimeRoot />
                </React.Suspense>
            </AppThemeContext.Provider>
        </Customizer>
    );
};

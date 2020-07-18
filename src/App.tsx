import { Customizer } from "@fluentui/react";
import * as React from "react";
import { fluentDarkTheme } from "./fluent-ui";
import { LabPrimeRoot } from "./LabPrime";

export const App: React.FC = () => {
    return (
        <Customizer {...fluentDarkTheme}>
            <LabPrimeRoot />
        </Customizer>
    );
};

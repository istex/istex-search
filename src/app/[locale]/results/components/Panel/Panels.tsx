"use client";

import * as React from "react";
import CompatibilityPanelContent from "./CompatibilityPanelContent";
import IndicatorPanelContent from "./IndicatorPanelContent";
import Panel, { type PanelName } from "./Panel";

type PanelStates = Record<PanelName, boolean>;

const PANEL_EXPANDED_STATES_KEY = "panelExpandedStates";
const DEFAULT_PANEL_EXPANDED_STATES: PanelStates = {
  indicators: true,
  compatibility: false,
};

export default function Panels() {
  const [panelStates, setPanelStates] = React.useState(
    DEFAULT_PANEL_EXPANDED_STATES,
  );

  const setExpanded = (name: PanelName, expanded: boolean) => {
    const newPanelStates = { ...panelStates };
    newPanelStates[name] = expanded;

    // The panel states are stored in local storage to be persistent across pages
    localStorage.setItem(
      PANEL_EXPANDED_STATES_KEY,
      JSON.stringify(newPanelStates),
    );

    setPanelStates(newPanelStates);
  };

  React.useEffect(() => {
    const panelStatesFromLocalStorage = localStorage.getItem(
      PANEL_EXPANDED_STATES_KEY,
    );

    // Initialize the local storage the first time
    if (panelStatesFromLocalStorage == null) {
      localStorage.setItem(
        PANEL_EXPANDED_STATES_KEY,
        JSON.stringify(DEFAULT_PANEL_EXPANDED_STATES),
      );

      return;
    }

    // We need to initialize the state in a useEffect because client components are first rendered on the server
    // and then hydrated on the client. Since local storage isn't available on the server, it says "localStorage is not defined"
    setPanelStates(JSON.parse(panelStatesFromLocalStorage) as PanelStates);
  }, []);

  return (
    <>
      <Panel
        title="indicators"
        expanded={panelStates.indicators}
        setExpanded={setExpanded}
      >
        <IndicatorPanelContent />
      </Panel>
      <Panel
        title="compatibility"
        expanded={panelStates.compatibility}
        setExpanded={setExpanded}
      >
        <CompatibilityPanelContent />
      </Panel>
    </>
  );
}

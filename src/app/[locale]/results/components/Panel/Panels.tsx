"use client";

import * as React from "react";
import CompatibilityPanelContent from "./CompatibilityPanelContent";
import IndicatorPanelContent from "./IndicatorPanelContent";
import Panel, { type PanelName } from "./Panel";
import type { Aggregation } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

type PanelProps = {
  [TName in PanelName]: Aggregation;
};

type PanelStates = {
  [TName in PanelName]: boolean;
};

const PANEL_EXPANDED_STATES_KEY = "panelExpandedStates";
const DEFAULT_PANEL_EXPANDED_STATES: PanelStates = {
  indicators: true,
  compatibility: false,
};

const Panels: ClientComponent<PanelProps> = ({ indicators, compatibility }) => {
  const [panelStates, setPanelStates] = React.useState(
    DEFAULT_PANEL_EXPANDED_STATES,
  );

  const setExpanded = (name: PanelName, expanded: boolean) => {
    panelStates[name] = expanded;

    // The panel states are stored in local storage to be persistent across pages
    localStorage.setItem(
      PANEL_EXPANDED_STATES_KEY,
      JSON.stringify(panelStates),
    );

    setPanelStates({ ...panelStates });
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
        <IndicatorPanelContent indicators={indicators} />
      </Panel>
      <Panel
        title="compatibility"
        expanded={panelStates.compatibility}
        setExpanded={setExpanded}
      >
        <CompatibilityPanelContent compatibility={compatibility} />
      </Panel>
    </>
  );
};

export default Panels;

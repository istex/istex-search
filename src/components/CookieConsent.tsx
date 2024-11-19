"use client";

import * as React from "react";
import { useLocale, useMessages } from "next-intl";
import * as cookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { GlobalStyles } from "@mui/material";
import { alpha, lighten } from "@mui/material/styles";
import { routing } from "@/i18n/routing";

const config: cookieConsent.CookieConsentConfig = {
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      services: {
        matomo: {
          label: "Matomo",
          cookies: [
            {
              name: /^(_pk_id.*)/,
            },
            {
              name: /^(_pk_ses.*)/,
            },
          ],
        },
      },
    },
  },
  guiOptions: {
    consentModal: {
      position: "bottom left",
    },
  },
  language: {
    default: routing.defaultLocale,
    autoDetect: "document",
    translations: {}, // translations are injected later
  },
};

export default function CookieConsent() {
  const locale = useLocale();
  const messages = useMessages();

  React.useEffect(() => {
    async function run() {
      // Inject translations from next-intl into the CookieConsent config
      config.language.translations[locale] =
        messages.cookieConsent as unknown as cookieConsent.Translation;

      await cookieConsent.setLanguage(locale);
      await cookieConsent.run(config);
    }

    run().catch((err: unknown) => {
      console.error(err);
    });
  }, [locale, messages]);

  return (
    <GlobalStyles
      styles={(theme) => ({
        "#cc-main": {
          "--cc-font-family": theme.typography.fontFamily,
          "--cc-modal-border-radius": `${theme.shape.borderRadius}px`,
          "--cc-btn-border-radius": `${theme.shape.borderRadius}px`,
          "--cc-link-color": "var(--cc-btn-primary-bg)",
          "--cc-primary-color": theme.palette.text.primary,
          "--cc-separator-border-color": "rgba(0, 0, 0, 0.12)",

          "--cc-btn-primary-bg": theme.palette.primary.main,
          "--cc-btn-primary-border-color": "var(--cc-btn-primary-bg)",
          "--cc-btn-primary-hover-bg": lighten(theme.palette.primary.main, 0.1),
          "--cc-btn-primary-hover-border-color": "transparent",

          "--cc-btn-secondary-bg": "transparent",
          "--cc-btn-secondary-color": theme.palette.primary.main,
          "--cc-btn-secondary-border-color": theme.palette.primary.main,
          "--cc-btn-secondary-hover-bg": theme.palette.primary.main,
          "--cc-btn-secondary-hover-color": "#ffffff",
          "--cc-btn-secondary-hover-border-color": theme.palette.primary.main,

          "--cc-toggle-on-bg": "var(--cc-btn-primary-bg)",
          "--cc-toggle-off-bg": theme.palette.colors.grey,

          // Replicate the styles of the MUI Link
          "& a": {
            color: theme.palette.primary.main,
            textDecoration: "underline",
            textDecorationColor: alpha(theme.palette.primary.main, 0.4),
            background: "none",
            "&:hover": {
              color: theme.palette.primary.main,
              textDecorationColor: "inherit",
              background: "none",
            },
          },

          // Use the MUI heading font family
          "& .cm__title,.pm__title": {
            fontFamily: theme.typography.h2.fontFamily,
            fontWeight: theme.typography.h6.fontWeight,
          },
          "& .pm__title": {
            fontSize: theme.typography.h6.fontSize,
          },

          // Make the preference modal close button look like the one from the generic Modal component
          "& .pm__close-btn": {
            backgroundColor: "transparent",
            border: 0,
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "& svg": {
              strokeWidth: 2.5,
              stroke: "rgba(0, 0, 0, 0.54) !important",
            },
          },

          // Expandable section arrow color
          "& .pm__section--expandable .pm__section-arrow svg": {
            stroke: "var(--cc-primary-color)",
          },

          // Uppercase buttons to match with MUI buttons
          "& button:not(.pm__section-title)": {
            textTransform: "uppercase",
          },

          // Increased box shadow
          "& .cm": {
            boxShadow: "0 0 1.5rem rgba(0, 0, 2, .9)",
          },
        },
      })}
    />
  );
}

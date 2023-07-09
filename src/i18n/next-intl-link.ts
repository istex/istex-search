"use client";

// next-intl link custom exporter to make it a client component.
// This is needed to pass a next-intl link as a prop to another component (needed for MUI composition).
import Link from "next-intl/link";

export { Link as default };

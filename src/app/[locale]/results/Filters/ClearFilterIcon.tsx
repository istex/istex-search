import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

const ClearFilterIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 11 11" {...props}>
      <circle cx="5.5" cy="5.5" r="5.5" />
      <rect
        x="3.37891"
        y="6.91406"
        width="5"
        height="1"
        rx="0.5"
        transform="rotate(-45 3.37891 6.91406)"
        fill="currentColor"
      />
      <rect
        x="4.08594"
        y="3.37891"
        width="5"
        height="1"
        rx="0.5"
        transform="rotate(45 4.08594 3.37891)"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default ClearFilterIcon;

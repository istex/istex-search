import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

const ArrowDownIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 10 6" {...props}>
      <path
        d="M9.81437 0.197888C9.69076 0.065926 9.54423 0 9.37492 0H0.625047C0.455668 0 0.30924 0.065926 0.185523 0.197888C0.0618069 0.329995 0 0.486182 0 0.66674C0 0.847261 0.0618069 1.00345 0.185523 1.13545L4.56048 5.80197C4.68433 5.93393 4.83076 6 5 6C5.16924 6 5.31581 5.93393 5.43942 5.80197L9.81437 1.13541C9.93795 1.00345 10 0.847261 10 0.666703C10 0.486182 9.93795 0.329995 9.81437 0.197888Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default ArrowDownIcon;

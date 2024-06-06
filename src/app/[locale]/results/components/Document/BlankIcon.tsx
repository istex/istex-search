import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export default function BlankIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 25 32" {...props}>
      <rect width="25" height="32" fill="url(#pattern-blank)" />
      <defs>
        <pattern
          id="pattern-blank"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1515_blank"
            transform="matrix(0.04 0 0 0.03125 -0.14 0)"
          />
        </pattern>
        <image
          id="image0_1515_blank"
          width="32"
          height="32"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWBJREFUeNpi/P//PwMyKJ68eL+ytLgDA4ng/eevDO8+fVnQlxeXiE8dun1gAWRcNGnR/v9kgJ0nL/7vXLzhP1D/fEIOQMZMDFQEarKSDBqyEgmEHIEMqOoAIT4eBl1lOZIcQVUH8HBxMogJCZDkCKo6gIOdlUGAl5skR1DVASzMzAxcHGwkOYKJmJRKLGZiZGRgZWEhyREs1AyBMzfuMdx9+pLhH9Axf//9Y/j9+w/D95+/GP4zMDJwc7CDHAFSlkjQAf/JsNxGX4Ph2Zv3eNVsOnwmgTgH/CfdCRxsrAxKUmJ41XCys9E2EZKVcKkVAsSA/0Q7gFbexeIxuobA0IkCYBYe4BCgVSr4T2wI/P1HI/uJTIT/hm0iJDYK/tIsFf4fWAcQHQL//v0f2ET4h1ZRQHQa+Pt3YEPg798BTgN/aOYAYtMAraKA+BAYtmmASAfsOn2JJg54/+krhhhAgAEAOOceVk7I96wAAAAASUVORK5CYII="
        />
      </defs>
    </SvgIcon>
  );
}

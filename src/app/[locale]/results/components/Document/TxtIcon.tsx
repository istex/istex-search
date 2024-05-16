import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

const TxtIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 25 32" {...props}>
      <rect
        width="25"
        height="32"
        fill="url(#pattern-txt)"
        style={{ mixBlendMode: "luminosity" }}
      />
      <defs>
        <pattern
          id="pattern-txt"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1515_7180"
            transform="matrix(0.04 0 0 0.03125 -0.14 0)"
          />
        </pattern>
        <image
          id="image0_1515_7180"
          width="32"
          height="32"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAo1JREFUeNpi/P//PwMyKJ68eL+7ub4DA4ngzpMXDHefvrwAZDr25cV9wKUO3T4WbIrczPQYyAFfvv0wePn+4/6iSYvwOgIZMDFQEajLSTJoykkaAJkgRwjQ3QGCfDwMuspyJDmCqg7g5eRgEBXiJ8kRVHUAOzsrgwAPN0mOoJoDQKmbhZmZgYuDHcURGgQcwUJMViEWMDEyMrCyQBwBA3oMciDK4Maj5+DcAWR/IOgAcsGZG/dAZQHYA3/+/WP4/fsPw/efv8By3BzsBl9//JwPZAYSDgEyLLfR12B49uY9XjUz1u8WoFkUcLCxMihJiZEebQwDDKiaCIeRA0Z8FACz8EBHwUCHwN9/A+yAEZ8N//77N3gccPPBYxQ5UFUrLMDP8PjFKwZ1BVmwGIgNq4LffPiEol5WQgyleibSAYgo6Jy7HLXhCbQ0KyKAYc7abQzWBtoMakB+z4KVDHUZ8QwXbtxm2HTgGIr6koRwBnVFOfJDYEZ9McMtYCj0LVwFZsNAqLsDw6KNOxjO37jD4GRuxCAlLgLGXvaWYLVq8jIMPg5WBKMUa2349+9fFPwPagCymK6qIoMQPx8wyD8yeNmao8iBEjEIo5tDfAiglQMIByDEv//8yfD24yeG7z9+Mjx6/pJBRU4GORuBs/JfIsoTrCHwB6gRGcPSBLLY1kMnGIT4eBnsTPQZ1u4+hCL3H+zo/xjmkOCAvygY5hMY/xEw1R86cxEYx9YMzhYmDO8+fmY4cPo8XP4/NATQzSE6CtAViwkLMqSG+MLFQS3f3OhgBklRYTA/JzqI4Qew8QmT97KzZOBgZ8NpKclpgJWFhUFOUhwuzsfNDca4+GJCgljNIdoBu05foltJCBBgAP9zlklycj+AAAAAAElFTkSuQmCC"
        />
      </defs>
    </SvgIcon>
  );
};

export default TxtIcon;

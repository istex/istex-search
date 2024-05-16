import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

const PdfIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 25 32" {...props}>
      <rect
        width="25"
        height="32"
        fill="url(#pattern-pdf)"
        style={{ mixBlendMode: "luminosity" }}
      />
      <defs>
        <pattern
          id="pattern-pdf"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1515_10462"
            transform="matrix(0.04 0 0 0.03125 -0.14 0)"
          />
        </pattern>
        <image
          id="image0_1515_10462"
          width="32"
          height="32"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABFpJREFUeNq8V0tvG1UU/ublsT3x2E5IiFXTRLilCVQoQRWUBRIsWbAAgiKVTbtg2SrtL0BsEa3YsEKseBQqxIJusoBKhLRFSAQVnKQSEknjNA117Pj9mBfnju2xE8b1Q6bHOr6POdfnu98599wxZ1kWWuWT6OSNAM+/ih6laJqkxu/Ufe3STmK/nd1hf6Kb0ZTo6dU/7ukarFFlZms3e+NyJPpIEK3Co0/ZLOSwnHyAdLXizD393CRmpyIz1GUgQv8rgPVMCrulIu6TNkQaH8exU9M9gegbAEexPBkcRkBsRlEaGYM8MdkTiL4BiByPjdw+KobRnAuNwBOJEogJxE5NYfZEZxBivwCekH1IVkpQWhgQFBXS6LgzjtWamZW7O1eoPTdQAGFZRoYS0C9KTTq9fojqyAG7Ooizl+mLTsa5gQHg6CNw7Lspa4s/IrFyB5ZWgVkuwaSToucy0HkBqt9zlkLBjubFgQDQTYPygEOuWkXQI+NJQUT5hyWU2tA8Qem2zvMzA2HAoBOQLpch0P53iwVEFAUyJaXMCR2OHNfdKbA6aLJYtBfGQmEwl2upPeiW2XHdQI4h232Kik+AaA/KXkwGQ6joOtYJRJHKcc/HudcFaXLOLpQxop0JAzGhhrCZ3bdBjHh94HgOJtkwTngKTZhsgpKnewDt6NIo8faI/pDXSyeAxx6BKWhV5CpVclRz+k+pQOGwbKYsCnnJ0KFR/wWqkhCELgFY7hCS+byd+XnK/AwloYeKkE+ScJTCoEi1elClypgs0x1RyKNKV7TEsSib2KYx1GD/DJQ1DQVyHPb74Sc6JdoN2/XhNWw+ogRszVKhYsUqTFVziACuaJXeAaQKBeQrZTuWEhWUkM/fMVQNYYnK9FG2rgDMevsgsw+dKBVpV1XK9DGi0MRgpQ0AC3mKMXMq8rzdqkS9RxJhdtz3AACwC7ZI8a6VXBMKZb3i88HA4EVsV2zUoSGbfoEYYGpYFvC4AOj2dcfBMzwM9dlpZz67ugY9m4UveoQ02kzU2784/eHTLx34rdZn3QOo7zY4PYUXr37eLETk/KfX30Bk7i08s3DhALCb8+/a4FrtmVyfONb7OyGrXEz1esJ9dzSG6ydnUUxs4wg5ZxUvSTtrzItqAMcXzttrmCzNn7GfMW38ltYmhK4MaHXHDSZOXLwASVXhJ+qzWwkoT0VtEMxOy2bw97VvMUrUN9a98vWXdhu/8rGtPYegYpoOE61xXf30M9z95hqev7Rgu2rYMaCt41/f/wDp+CryiYQz1xOAct1xtd5+Pzd/6JhadkFidjIxE3tnDhuLi8663T/j2Ll12+U9jusOQMk06gDMA+PWHIm8fBrvbW/a44fxOJY//Ih221x3eI3tTBC7A1Cs03bvzh/44s23nXFDfvvqKv76edkZb9285fSZ/UNioOxCvSp0GYKCodfadAp7S0v/fb6xgfukrn/ZXOwdAC4vJa4AwpKMxyX/CjAALhkSt6rwJ9IAAAAASUVORK5CYII="
        />
      </defs>
    </SvgIcon>
  );
};

export default PdfIcon;

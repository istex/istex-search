import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export default function JpegIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 25 32" {...props}>
      <rect width="25" height="32" fill="url(#pattern-jpg)" />
      <defs>
        <pattern
          id="pattern-jpg"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1515_jpeg"
            transform="matrix(0.04 0 0 0.03125 -0.14 0)"
          />
        </pattern>
        <image
          id="image0_1515_jpeg"
          width="32"
          height="32"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABCFJREFUeNrEV+tPU2cY/x1O762ltgtMRVdcCLLEjAW2GLy1JPtOEzPjPrVm+7INjH8BS7YP20fxD9C5GJNt7mK8JcaA31iI0pEwgaB0KCKMabm1tKfnnD3vWzjtwULPqc32pE9Oz3t5nt9zfd8jqKqKYhLO9PRbA4EQTJKcTkNJpS6i73xsu3Wb9VlKLdrR0WFWP9ITE8g+norKPd0oB6KYalBFat23D06PJ4qe7gv/C4B36+vwYfMBUyCqCmDvTh869jaYAmExqyQ7Nobs8DDUtTW4IxHU+HzanN/tQsP6O0u1O2Nj0bUyOVESgFKUqcriIiRKMF4hdjtS167x/46jR4HaWm0ty26XzYY67w6drHIgSgLYUC/Pz2P1yhVurUZWK3+sDQ5CmpqC/fBhWJua8sJEER67A/DCMAjLtrVKFtmOHEH290Gomeyrtf/yJVLXr8N14gTf89sfIxhK/AVZUZCRJCxnMlhcWcUbLheeplMsJ5K07azxEHi9UEiJqqia5WJjI9TlZdg7OwlURlsn+v24Tc0IGlABYN5gHAjA8fZ+5rVWUx5QSJH06BFXXkMKlBcvYCOXSw8eQBodhf3YMd0+0eEwXTkly1AmAJxXVrhy6/HjEA8ehEAZrno8EA8dQm7mKbKTk4W1Bth4FVAMuSdcboihEISGhjxaygk+Z7FAfP8DSFSOqKuD4HZX3DtKe4Bizlih5MHuPdq77v9bQcDpRO7+fW2sHBv2gLzugbLU0gJ1ZATy7CxQX1+RB0p3QkU2tpuyn1fHn6PAk2lgp5+OUg8PEYo6pHkAchkPsPJjCufmtPIES1jGG8TyghIXoqUKHpDpPUk9JEs1Tn0BqZSuK5Y+NGjtw4dAczOBECv0gERC5uaBpcU8CG2XwTMsu75/m/zYAkAu/2TWLi9RUxOMK91MQpE84wDkgqVuz+tdEpgMWa4QANU559cl0wByOfxXZAhAf1cX7s3M4MuhIaiffa6NJ+iwity6yZ+91JqjB5rhs9kR/2cBsbt3EV9YqPBOyAAUM2ujrDuuAwtf/QlC3znE6cLS296O3rY2hHbtwnuXL+fHKfMvhDtflWPYA3SZ2HQ+50tzY5zFlP1n4/SLtryD2O1bSNBxzShGXqlqCLiiIg/0f3QyHwK6L0Z+voqu2GkkV1N8vv/UxwjR9wGvwG+/qTAEZF2rP0DCThUsVQoeCH9/CcLXX6HxfB/ilBu/jo/jTHsbnw9f+g6RH38oeLKYzYQgsfA3gt5aDH/yKYJ0sMTIUk1ITtYJPHvzBn4hsFNfdCNBLTsUDOIiuytsoVTXp0p9nMLl4h+nPqcDrW/uRvz5MyTT+ZtxqHG/7l33aUaJ6HM4t5ynM2RAPdcXNpyESXoOLI3rpgYmxre0Jj49XaU+YMB11aJ/BRgAins+q6BEqrIAAAAASUVORK5CYII="
        />
      </defs>
    </SvgIcon>
  );
}

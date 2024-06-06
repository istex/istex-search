import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export default function TiffIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 25 32" {...props}>
      <rect width="25" height="32" fill="url(#pattern-tiff)" />
      <defs>
        <pattern
          id="pattern-tiff"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1515_tiff"
            transform="matrix(0.04 0 0 0.03125 -0.14 0)"
          />
        </pattern>
        <image
          id="image0_1515_tiff"
          width="32"
          height="32"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA/VJREFUeNrEVktPFFkU/orqBw3dPLWNgFF34rBQIyJiZugEnc2YOOP8AOYHiPEXyPyE0ejCjbhzofERFxqd0C6MMMZYA6MgRqVBnhFtoN9djzn3FtXdRdPdVd0knuSm7jn3nHu/+u45p0rQNA25IlwYGHY2N/fCpijxONRYbAiXr/xRzG/zeY6tnHwnTtg9H/GpKaQ/feqXB86jFIhcqcI2Sue+ffD66voxcP7GdwHQ4ffj5/Z2WyC2FUBbQz2621ptgXDYPSQ1OYnkixd87gkE4CDaDWmsrcGexsaM/nhioj9SIie2BKDkZKq6uor02JheIfSG8fsP+Lz61CkIe/dmfFl2e5xO+H3e3JwvCaIoA8ryMqK3bkFLJLJGl4s/Es+eISVJcPf0wNXRoW8miqh1u+E31R3waHKiP1oAxJYAVOOt6DDP2bOIP3wILZnM94vFEH/yBEJ9PWfg/r9jeDkdgqKqSMoyIhSzEoliZ00NotEoy4kwhV0sCcBoFkJdHZLPn0OjDUH0MhH374e2vs6BqWtrOjDyE5ua8IiaEZKpHLbcQBMbTaimuMTIyCFLDBgA1PUI5LnPtJETVbSJ+vUrXER5+s1/SNIVuPv6THFidbXtyqkqlIR8RNb5mzt//AmO492UhA3QvF6Ih49AWQ0j9fZt1tfCsJyEKqOcMVFbC0ffaQi79LQSu3v0NYcD4tFjSL/8h4q/DQL5lStbApA3AMDj4cMAhJ07svOW3fxu5VevIJw8WTaAqkIMWBmgPqDRVaizs9b8LfeBAs55QgzASX3h/XtgcRGg/IDPR12KkpHypewroEIuHsVKb3YGWFri+cCFSpOPhQVdZyAOtAMl8qMAA8omQKSHqYfE4voh1IC4OF1F2qiqM/PDQcpesUwG0tRUqB2D6t8cJVq7IvYiLN6/yy4AWX9++wZQt8vQXK4Y+1kHsHEF7GCvt7LD2R6KUiaAjT5QsdgGIOuU9ba0mMxhyv5wKoUG+kpKKyt568H5eRxqbkYDfZINkb584TFlARj+5Uze0p/Ufi91HoNw7WreOrO9Pve7yRa4d5cDKwuAcPkv9La2Ypg2ZXMmg11dJp/AndsIzs2ZQY6OYHB0tIK/4nQ6O4z7y+hqVmcsETht4AIGj3ZmbJe6jnPb8K+/mfeyy4A+V8w2o01v6Bf/fgppaRnT9O9o2IbGx3GTRjiZMO9lGUAuWqOGDZtqZkCi+w2GQqbwEPWP4McPFXwLcgHIitmmbNLZ+mZ6FaUg5dYA5JSNNBtC4Pr1jG2IquDe+BjXmV1anDf5H6ZkDbO/6CKlZ4uBMM2Da+8y+jTr7UbdT73LC5VmZir/IyqVONsp/wswAIdBPQwwI8qgAAAAAElFTkSuQmCC"
        />
      </defs>
    </SvgIcon>
  );
}

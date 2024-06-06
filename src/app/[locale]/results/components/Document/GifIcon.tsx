import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export default function GifIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 25 32" {...props}>
      <rect width="25" height="32" fill="url(#pattern-gif)" />
      <defs>
        <pattern
          id="pattern-gif"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1515_gif"
            transform="matrix(0.04 0 0 0.03125 -0.14 0)"
          />
        </pattern>
        <image
          id="image0_1515_gif"
          width="32"
          height="32"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABB1JREFUeNrEVu1PU2cU/11u6QttoS0lOG2kTbZElA+NCXGDD8I2ls1sCc7Ez/UPoM6/YNsfYHS67YOZgU/6bQO/zIwPlMREQzWpjIljcTA0GpBq0ZbS3red597e20ILvX3JdpKT3ufpeZ7ze87zO+c5nKIoKBXufHSmtbNzCDWKlM1C3tqawJWr5/az2+3PUsnIPTBQq39kl5YgLi9HhOgYqoEolRY0UfpDIbjb2yOIjo3/LwD6urrwWe9RuN3mQTQVQMDbgROBQ/i0txcukyAstTrJP36M3N276rdjeBiWYND4z9PWhsNerzH+dXExkq7CiYoApBKmypubEObntQzp6ED21i312z4yAq6nx7Bl7Ha0tqLL7dL5bgrEvhGQ1teRuXkTSi5XnLRa1Z/t2VnkEwnYBgdh7evTNuN5OG22kpzTYNzeB0RFALJ+KnJmP3UK29O/EYh8ud3WFrLT02pkWASmHs4jvvIPJFlGThSRIeDJdAZ+uppMJh1RomMpWnahKgC9WHDt7RDv34ci05jCy4SnVFPevoVjdBTSy5faArLjfT7cpmKEUqBWioaPqQ+2UBDb9+6FTUVAByCTI+HJE9V5S6cPcvIVrBRyYWEBudkYbB+P7FjH2+01Z07LXiRUNZ1WnbeePAnL+x8AzjYoLhf448chpTaRf/SoaGtCTZNQpjtUI9HmBD80BC4Q0E44MKj9Z7GA7++HMDdHyR8A53TWXTsqR4DunKlM5MHBQ8a49Fuhb67TD/HBA2OumpqvA4UIVJWewwDVCOlv4kkwVFcEKtcBWTK3mtitZsfyMrCxQc+oG1SDqUQSGT2eBgBIVSLACtPTVWBtzUhPMMIyxQttbCMQ9CagCj/MRUCiMaUkWJ6/fg1QAVJFd77XHn8tAceOEXv5OiMgUFHZSJLTVxoIY5XJN4xxaW0d6O6uFYCo/bLTpkg5zrzT3cKV7GcegFQ8qdPVWJPA9pCkOgE4HJo2KjUDEMtD5qGXMez3I0UZkEgmd8zFnj9HkFKQqS4rRFqm9aXhLgCRI0cw/uFHO+a8139CmLqfmc+/APfjD4i8+x6+pvKsy7fxOL6JzzUOIOzvUp1foAbk8sOEOp45cwZD3QfUaBj2herJXfmuCZVQKAIYDWk932XqCzx2GzxEqtNTU1h5s4kg9QGGfaF2KNHzGpCLFxsAIArlNYHmwt53MHP2rBbiO3cQW10t2hfshm/cKN+j5rZcEAydXFxUp76iHiBGj07o+6vFIqPnN7MtXAGzYVq6h6Hmr6BonHj2FOd++Rnjp7/EpZFPjPnJPxboShxFez3VBKEJHMjvbEAnqPGY/H0e4QMHkdrOIvFCe3A89OoNX7um2k/ENZvda+skYfkpUjQXe/PnnnMr1MI3rx8QRfxX8q8AAwC7ohz5ZBJ6IAAAAABJRU5ErkJggg=="
        />
      </defs>
    </SvgIcon>
  );
}

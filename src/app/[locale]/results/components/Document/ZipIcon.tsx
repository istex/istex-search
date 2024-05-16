import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

const ZipIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 25 32" {...props}>
      <rect
        width="25"
        height="32"
        fill="url(#pattern-zip)"
        style={{ mixBlendMode: "luminosity" }}
      />
      <defs>
        <pattern
          id="pattern-zip"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1515_9343"
            transform="matrix(0.04 0 0 0.03125 -0.14 0)"
          />
        </pattern>
        <image
          id="image0_1515_9343"
          width="32"
          height="32"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9dJREFUeNqsV0tPE1EU/voUGQstpbRFRSUEeQnF9zOIT2Ki/gGNLlwYd2pITFxoYnRr4soYXRhXbmWhaJT4SFDxgVEWqI3EGCtqaWttpdN2xjt32mkLzO2t9iaHzj1zzpnvfufcey4GWZaRP+5eM521ObvOWKx2lDKSYhjR4JtR8ti7+4gU1rOb+T3zXEYt6y7C4e1hfvDG6ZzrwfMphAIP4R8+5PsVnRwavCoyQeQPow7OomKdZ9Akq7PZW9HRvs9nNlsJCKP9PwAUHwubezTRglldqHZvKwmEWZ8BiekY/f4obyapPpYqGIXlBATQAfjejd0qmg4dACSgzAbgWbYlD69EfQwmAcaKhVTFC8KsX6lsAPHQ4wLAio/BaCVpcGpaFYRMQAzogpibATlNFpVmAli28lQeAWnqA5hUFizIAyGjMf7L9/7DPaUmeokqzJcCsAEEP13Qnr2t/dQn9O0R/K9BfWVJJJhi5ICIQEoBguD0xWLBIfKym4MBKbMi/eFt6S9gzOHegMbOE7r2rmZgfOS0j7MGCGRFWDUwNQjX8ov4MX4czqUnqc7hXs/ecmSXlFADSWawutZrqKjqpr/FbAu3NxcAhQF2UINsUqsllQCsZQagpKDYqvzPjqHKsxuxqadoWnuJ8/tSKQyI7O6XlPDp1Tn63LRGLHcKknQbsUZ4chypZHZhvAB4GVDolxPsXRCL5vpCcAy2miYOAmS+bigrDKRFXYlHPpMPdmHHgQeo8WyCGJ9i2mtSEgPStP5C0glEgt/w88sI+Q3AZLYy7UsvQiWnjICVQjU61h3G2PB1uBevRrWjvrwAZClBVskO6F3SRUVlZLrcRSjyrajUwc/AtNrJyg4gzcuAkoK4Nv0e8GNo4HKBSe/eoxh7eQ913ka0r9qFm1dy3VGw1WDzrkOwO+uLpsCoXwNxTex2B3r3HKZisVbAXuOhOtq0lGM7A9a3vo/aCAuq8O7FnYIYVPhT8KcgBWbSd2rr6jDy5DY9Tjdu2090aTVg9uKR2b70IkLvE6nZaeRPwR9yqfldoJrwj2Pi41ts3NoHYb5JfZ/tGRnb0ef31RQssMHX0zcrxly3rLkZoJTljtpwKITRF4/RtqIT9fWu3Dt6b0ho857tO+Fye/LiRGc3OT4GYsQ5ok3fvBwm//uJ+DEZwEMiyujsbid/U7RnZG3lGX7/vAtkKUpsTdq8ocGB2tr5BTYWY4zqBcFCbENobVuEyookfdbvRUneFIQIW7lu2LBI2SyVM6wiGT0putQkWporqU5OsRjgBDDxNUCq3FD2cyg2PbsG/gowAPGGQK+e//OKAAAAAElFTkSuQmCC"
        />
      </defs>
    </SvgIcon>
  );
};

export default ZipIcon;

import Box from "@mui/material/Box";
import CircularProgress, {
  type CircularProgressProps,
} from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import type { ClientComponent } from "@/types/next";

interface DelayedCircularProgressProps extends CircularProgressProps {
  isLoading?: boolean;
  delay?: number;
}

// Passing isLoading allows this component to control its display.
// Example:
//   - {isLoading && (
//       <DelayedCircularProgress size={20} />
//     )}
//     Here it's up to component rendering the DelayedCircularProgress to control when it renders.
//
//   - <DelayedCircularProgress isLoading={isLoading} size={20} />
//     Here the DelayedCircularProgress takes care of rendering its internal CircularProgress
//     based on isLoading. A container of size `size` surrounds the CircularProgress to avoid
//     layout shifts when the CircularProgress fades out.

const DelayedCircularProgress: ClientComponent<DelayedCircularProgressProps> = (
  props,
) => {
  const { isLoading = true, delay = 1000, size, ...rest } = props;

  return (
    <Box sx={{ height: size }}>
      <Fade
        in={isLoading}
        style={{
          transitionDelay: isLoading ? `${delay}ms` : "0ms",
        }}
        unmountOnExit
      >
        <CircularProgress size={size} {...rest} />
      </Fade>
    </Box>
  );
};

export default DelayedCircularProgress;

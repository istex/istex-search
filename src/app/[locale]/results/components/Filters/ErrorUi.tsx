import ErrorCard from "@/components/ErrorCard";
import CustomError from "@/lib/CustomError";

interface ErrorUiProps {
  error: Error;
}

export default function ErrorUi({ error }: ErrorUiProps) {
  const info =
    error instanceof CustomError
      ? error.info
      : new CustomError({ name: "default" }).info;

  return <ErrorCard info={info} disableTitle />;
}

import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";
type loadingButton = {
  loading: boolean;
  children: React.ReactNode;
} & ButtonProps;
const LoadingButton = ({ children, loading, ...props }: loadingButton) => {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : children}
    </Button>
  );
};

export default LoadingButton;

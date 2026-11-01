import { Spinner } from "@/components/ui/spinner";

export default function AppLoading() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <Spinner className="w-15 h-15" />
    </div>
  );
}

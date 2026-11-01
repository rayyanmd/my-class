import { Skeleton } from "@/components/ui/skeleton";

export default function TugasLoading() {
  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Pusat Link</h1>
          <p className="text-sm text-muted-foreground">
            Link-link penting ada di sini
          </p>
        </div>
      </div>
      <Skeleton className="w-full h-150" />
    </div>
  );
}

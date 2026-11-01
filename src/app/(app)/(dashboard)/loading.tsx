import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Selamat datang!</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Skeleton className="w-1/2 h-50" />
        <Skeleton className="w-1/2 h-50" />
      </div>
    </div>
  );
}

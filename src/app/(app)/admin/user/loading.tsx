import { Skeleton } from "@/components/ui/skeleton";

export default function UserLoading() {
  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">List User</h1>
          <p className="text-sm text-muted-foreground">
            List orang-orangan SS23
          </p>
        </div>
      </div>
      <Skeleton className="w-full h-100" />
    </div>
  );
}

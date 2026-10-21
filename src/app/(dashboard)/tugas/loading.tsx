import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Tumpukan Tugas SS23</h1>
          <p className="text-sm text-muted-foreground">
            jangan lupa dikerjain yaa :3
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Skeleton className="w-1/3 h-30" />
        <Skeleton className="w-1/3 h-30" />
        <Skeleton className="w-1/3 h-30" />
      </div>
      <Skeleton className="w-full h-100" />
    </div>
  );
}

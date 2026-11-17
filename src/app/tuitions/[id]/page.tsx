import { Suspense } from "react";
import TuitionDetailsContent from "@/components/TuitionDetailsContent";
import Spinner from "@/components/Spinner";

/**
 * Server wrapper: awaits the route params and hands the plain id to the
 * client component. Keeping `use(params)` out of the client component
 * lets this dynamic route prerender cleanly with Cache Components.
 */
export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner label="Loading tuition…" />
        </div>
      }
    >
      <TuitionDetailsContent id={id} />
    </Suspense>
  );
}

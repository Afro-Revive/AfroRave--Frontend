import { lazy, Suspense } from "react";
import { getRoutePath } from "./get-route-path";
import { LoadingFallback } from "@/components/loading-fallback";

const FaqPage = lazy(() => import("../pages/support/faq"));
export const support_routes = [
  {
    path: getRoutePath("faq"),
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <FaqPage />
      </Suspense>
    ),
  },
];

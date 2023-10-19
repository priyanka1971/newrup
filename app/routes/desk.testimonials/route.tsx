import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Edit, MoreVertical } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { Separator } from "~/components/ui/separator";
import { getAllTestimonials } from "~/dao/testimonials.server";
import { requireUserId } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import { SectionListItem } from "./section-list-item";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const _testimonialsQuery = await getAllTestimonials();

  if (_testimonialsQuery.ok)
    return json({ testimonials: _testimonialsQuery.testimonials });

  return json({ userId, testimonials: [] });
};

export default function SectionsLayout() {
  const location = useLocation();
  const hideParent = location.pathname !== "/desk/testimonials";
  const { testimonials } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("w-full flex-col border-r md:flex md:w-72", {
          hidden: hideParent,
        })}
      >
        <div className="flex items-center justify-between p-2">
          <p className="font-outfit font-medium">Testimonials</p>
          <div className="flex items-center">
            <Link to="new">
              <ActionButton icon={Edit} tooltip="Add section" />
            </Link>
            <ActionButton icon={MoreVertical} tooltip="Show menu" />
          </div>
        </div>
        <Separator />
        {testimonials.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {testimonials.map((testimony) => (
              <SectionListItem
                key={testimony._id.toString()}
                title={testimony.name}
                to={testimony._id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center p-2">
            <p>No testimonials found</p>
          </div>
        )}
      </div>
      <div className="h-full w-full flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export const ErrorBoundary = () => <ErrorBoundaryComponent />;

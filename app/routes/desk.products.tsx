import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Edit, MoreVertical } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { NavListItem } from "~/components/nav-list-item";
import { Separator } from "~/components/ui/separator";
import { getAllProducts } from "~/dao/products.server";
import { requireUserId } from "~/lib/session.server";
import { cn } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const { products } = await getAllProducts();

  if (products) return json({ products });

  return json({ userId, products: [] });
};

export default function ProductsLayout() {
  const location = useLocation();
  const hideParent = location.pathname !== "/desk/products";
  const { products } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("flex w-full flex-col border-r md:w-72", {
          "hidden md:flex": hideParent,
        })}
      >
        <div className="flex items-center justify-between p-2">
          <p className="font-outfit font-medium">Products</p>
          <div className="flex items-center">
            <Link to="new">
              <ActionButton icon={Edit} tooltip="Add product" />
            </Link>
            <ActionButton icon={MoreVertical} tooltip="Show menu" />
          </div>
        </div>
        <Separator />
        {products.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {products.map((product) => (
              <NavListItem
                key={product._id.toString()}
                label={product.title}
                to={product._id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-2">
            <p>No products found</p>
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

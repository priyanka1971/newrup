import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { createProduct } from "~/dao/products.server";
import { uploadHandler } from "~/lib/upload.server";

export const meta: MetaFunction = () => {
  return [
    { title: `New Product / ${SITE_TITLE}` },
    { name: "og:title", content: `New Product / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  const __action = formData.get("__action");

  switch (__action) {
    case "create": {
      const { id, error } = await createProduct(formData);

      if (id) return redirect(`/desk/products/${id}/preview`);

      return json({ ok: false, error });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export default function NewProductPage() {
  const navigate = useNavigate();
  const { state } = useNavigation();

  const busy = state === "submitting";

  const back = () => navigate("/desk/products");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-2">
        <p className="font-outfit font-medium">New Product</p>
        <ActionButton tooltip="close" icon={X} action={back} />
      </div>
      <div className="h-full w-full p-2">
        <div className="mx-auto max-w-2xl px-2 py-2 md:py-8">
          <Form
            className="w-full space-y-8"
            method="post"
            encType="multipart/form-data"
          >
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="title">Title</Label>
              <Input type="text" id="title" name="title" required />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="video">Video Link</Label>
              <Input type="text" id="video" name="video" required />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="image">Image</Label>
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg"
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>
            <div>
              <Button
                className="w-full"
                type="submit"
                name="__action"
                value="create"
                disabled={busy}
              >
                {busy ? "Creating..." : "Create"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

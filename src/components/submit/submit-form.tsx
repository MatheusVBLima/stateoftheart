"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createImplementationAction } from "@/lib/actions";
import { getCategoriesAPI } from "@/lib/api";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(100, {
      message: "Name must be less than 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must be less than 500 characters.",
    }),
  content: z
    .string()
    .min(50, {
      message: "Content must be at least 50 characters.",
    })
    .max(10000, {
      message: "Content must be less than 10,000 characters.",
    })
    .optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url({
      message: "Please enter a valid GitHub URL.",
    })
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .url({
      message: "Please enter a valid logo URL.",
    })
    .optional()
    .or(z.literal("")),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
});

export function SubmitForm() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "",
      website: "",
      githubUrl: "",
      logoUrl: "",
      categoryId: "",
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isSignedIn) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("website", values.website || "");
        formData.append("githubUrl", values.githubUrl || "");
        formData.append("logoUrl", values.logoUrl || "");
        formData.append("categoryId", values.categoryId);

        const result = await createImplementationAction(formData);

        // Show success toast
        toast.success("Implementation submitted!", {
          description:
            "Your implementation has been successfully submitted and is now live.",
        });

        // Redirect to the new implementation page
        if (result.success && result.implementation) {
          router.push(`/implementation/${result.implementation.slug}`);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create implementation";
        form.setError("root", {
          message: errorMessage,
        });

        // Show error toast
        toast.error("Failed to submit implementation", {
          description: errorMessage,
        });
      }
    });
  };

  if (!isSignedIn) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            You need to sign in to submit an implementation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit New Implementation</CardTitle>
        <CardDescription>
          Share a state-of-the-art implementation with the community. Help
          others discover the best tools and libraries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., NextAuth.js, Prisma, React Query"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the implementation or library.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="" disabled>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading categories...
                        </SelectItem>
                      ) : (
                        categories?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits this implementation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      placeholder="Describe what makes this implementation state-of-the-art. What problems does it solve? What are its key features?"
                      value={field.value}
                      onChange={field.onChange}
                      limit={500}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain why this implementation is state-of-the-art and what
                    makes it special.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      placeholder="Write a comprehensive explanation of why this implementation is state-of-the-art. Include technical details, comparisons, use cases, pros/cons, examples, and any other relevant information that helps developers understand why this is the best choice in its category."
                      value={field.value}
                      onChange={field.onChange}
                      limit={10000}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a detailed article explaining why this is the
                    state-of-the-art implementation. You can use rich
                    formatting, code blocks, lists, and more.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Official website or documentation URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://github.com/user/repo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to the GitHub repository.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to the official logo image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Implementation"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

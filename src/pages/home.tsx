import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadCarDetails } from "@/services/car.service";
import toast from "react-hot-toast";
import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  carmodel: z
    .string()
    .min(3, { message: "The model name should be at least 3 characters long" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price is required" })
    .nonnegative({ message: "Price should be non-negative" }),
  images: z
    .array(
      z
        .custom<File>()
        .refine((file) => file instanceof File, "Expected a File object")
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          ".jpg, .jpeg, and .png files are accepted."
        )
    )
    .min(1, "At least one image is required")
    .max(10, "You can upload a maximum of 10 images"),
});

const Home = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carmodel: "",
      price: 0,
      images: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    uploadCarDetails(values)
      .then((res) => {
        if (res) {
          toast.success("Car details uploaded successfully");
          form.reset();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload car details");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="w-[90%] md:w-[60%] lg:w-[30%] bg-slate-100 p-8 rounded-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="carmodel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car model</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your car model"
                      type="text"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your price"
                      type="number"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Home;

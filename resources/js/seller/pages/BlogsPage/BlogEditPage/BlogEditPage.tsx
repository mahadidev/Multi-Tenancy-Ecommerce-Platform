import { ErrorMessage, FileInput } from "@seller/components";
import LoadingOverlay from "@seller/components/LoadingOverlay/LoadingOverlay";
import QuillRichTextEditor from "@seller/components/TextEditor/QuillRichTextEditor";
import useBlog from "@seller/hooks/useBlog";
import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import { RoutePath } from "@seller/seller_env";
import { CategoryType } from "@type/categoryType";
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiHome } from "react-icons/hi";
import { useParams } from "react-router-dom";

const BlogEditPage: React.FC = () => {
    const { id } = useParams();
    const { blogCategories } = useCategory();
    const { update, blog, fetchBlog } = useBlog();
    // const { files } = useFile();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        default: blog,
    });
    const [, setImageLocation] = useState<string>("");

    useEffect(() => {
        if (id) {
            fetchBlog.submit({
                formData: {
                    id: id,
                },
            });
        }
    }, [id]);

    useEffect(() => {
        setFormState({});
        if (blog) {
            // prefill form with existing data
            setFormState({
                title: blog?.title || "",
                category_id: blog?.category?.id || "",
                status: blog?.status || "",
                image: blog?.image || "",
                content: blog?.content || "",
            });
        }
    }, [blog]);
    return (
        <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4">
                <Breadcrumb className="mb-5">
                    <Breadcrumb.Item href={RoutePath.DashboardPage.index()}>
                        <div className="flex items-center gap-x-3">
                            <HiHome className="text-xl" />
                            <span>Dashboard</span>
                        </div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={"/seller/blogs"}>
                        Blogs
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Edit Blog
                </h1>
            </div>
            {/* <div className="bg-white p-5"> */}{" "}
            {/* {JSON.stringify({ formState, blog }, null, 2)} */}
            {/* </div> */}
            <section>
                <div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-6 w-full">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full ">
                                    <div className="flex flex-col col-span-2 gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <TextInput
                                            id="title"
                                            name="title"
                                            placeholder="Blog title"
                                            value={formState["title"]}
                                            onChange={handleChange}
                                            color={
                                                formErrors["title"]
                                                    ? "failure"
                                                    : "gray"
                                            }
                                            helperText={
                                                formErrors["title"]
                                                    ? formErrors["title"][0]
                                                    : false
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="category_id">
                                            Category{" "}
                                        </Label>
                                        <Select
                                            id="category_id"
                                            name="category_id"
                                            value={formState["category_id"]}
                                            color={
                                                formErrors["category_id"]
                                                    ? "failure"
                                                    : "gray"
                                            }
                                            helperText={
                                                formErrors["category_id"]
                                                    ? formErrors[
                                                          "category_id"
                                                      ][0]
                                                    : false
                                            }
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    category_id:
                                                        e?.target?.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value={0}>
                                                Select a Category
                                            </option>
                                            {blogCategories.map(
                                                (category: CategoryType) => (
                                                    <option
                                                        value={category.id}
                                                        key={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                    </div>

                                    {/* active status change  */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            id="status"
                                            name="status"
                                            value={formState["status"]}
                                            color={
                                                formErrors["category_id"]
                                                    ? "failure"
                                                    : "gray"
                                            }
                                            helperText={
                                                formErrors["category_id"]
                                                    ? formErrors[
                                                          "category_id"
                                                      ][0]
                                                    : false
                                            }
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </Select>
                                    </div>

                                    <div className=" col-span-full">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="image">Image</Label>
                                            <div>
                                                <FileInput
                                                    id="image"
                                                    name="image"
                                                    placeholder="Click to upload image"
                                                    value={formState["image"]}
                                                    color={
                                                        formErrors["image"]
                                                            ? "failure"
                                                            : "gray"
                                                    }
                                                    helperText={
                                                        formErrors["image"]
                                                            ? formErrors[
                                                                  "image"
                                                              ][0]
                                                            : false
                                                    }
                                                    onChange={(e: any) =>
                                                        setImageLocation(
                                                            e.target?.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            {formState["thumbnail"] && (
                                                <img
                                                    src={formState["thumbnail"]}
                                                    alt="thumbnail"
                                                    className="w-36 h-36 object-cover rounded-md"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:col-span-3 ">
                                <Label htmlFor="description">Content</Label>
                                <QuillRichTextEditor
                                    content={formState["content"]}
                                    onChangeContent={(value: string) => {
                                        // @ts-ignore
                                        setFormState((prev: any) => ({
                                            ...prev,
                                            content: value,
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* loader */}
                <LoadingOverlay isLoading={fetchBlog.isLoading} />
                {formErrors["message"] && (
                    <ErrorMessage>{formErrors["message"]}</ErrorMessage>
                )}

                <div className="flex justify-end mt-6">
                    <Button
                        color="primary"
                        onClick={() => {
                            // console.log({
                            //     formData: formState,
                            // });
                            update.submit({
                                formData: { ...formState, id },
                            });
                        }}
                        isProcessing={update.isLoading}
                        disabled={update.isLoading}
                        processingLabel="Saving"
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                        type="submit"
                    >
                        Save all
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default BlogEditPage;

/* eslint-disable react-hooks/exhaustive-deps */
import { ErrorMessage, FileInput } from "@seller/components";
import QuillRichTextEditor from "@seller/components/TextEditor/QuillRichTextEditor";
import useBlog from "@seller/hooks/useBlog";
import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import { RoutePath } from "@seller/seller_env";
import { CategoryType } from "@type/categoryType";
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";

import { AiOutlineLoading } from "react-icons/ai";
import { HiHome } from "react-icons/hi";

const BlogCreatePage = () => {
    const { blogCategories } = useCategory();
    const { create } = useBlog();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
        default: {
            status: "active",
        },
    });

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
                    <Breadcrumb.Item>Add New Blog</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Add New Blog
                </h1>
            </div>

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
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="category_id">
                                            Category
                                        </Label>
                                        <Select
                                            id="category_id"
                                            name="category_id"
                                            value={formState["category_id"]}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            color={
                                                formErrors["status"]
                                                    ? "failure"
                                                    : "gray"
                                            }
                                            helperText={
                                                formErrors["status"]
                                                    ? formErrors["status"][0]
                                                    : false
                                            }
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
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        handleChange(event);
                                                    }}
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

                            <div className="flex flex-col gap-2 sm:col-span-3">
                                <Label htmlFor="description">Content</Label>
                                <QuillRichTextEditor
                                    content={formState["content"]}
                                    onChangeContent={(value: string) => {
                                        setFormState((prev: any) => ({
                                            ...prev,
                                            content: value,
                                        }));
                                    }}
                                />

                                {formErrors["content"] && (
                                    <ErrorMessage>
                                        {formErrors["content"]
                                            ? formErrors["content"][0]
                                            : false}
                                    </ErrorMessage>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 
                {formErrors["message"] && (
                    <ErrorMessage>{formErrors["message"]}</ErrorMessage>
                )} */}

                <div className="flex justify-end mt-6">
                    <Button
                        color="primary"
                        onClick={() => {
                            create.submit({
                                formData: formState,
                            });
                        }}
                        isProcessing={create.isLoading}
                        disabled={create.isLoading}
                        processingLabel="Saving"
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                    >
                        Create
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default BlogCreatePage;

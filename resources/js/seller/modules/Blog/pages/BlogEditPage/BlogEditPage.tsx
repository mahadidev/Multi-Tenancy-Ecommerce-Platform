import useBlog from "../../hooks/useBlog";
import useCategory from "../../../Category/hooks/useCategory";
import useForm from "@seller/_hooks/useForm";
import { ErrorMessage, FileInput } from "@seller/components";
import FormInput from "@seller/components/FormInput/FormInput";
import LoadingOverlay from "@seller/components/LoadingOverlay/LoadingOverlay";
import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import QuillRichTextEditor from "@seller/components/TextEditor/QuillRichTextEditor";
import { CategoryType } from "@type/categoryType";
import { Button, Label, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useParams } from "react-router-dom";

const BlogEditPage: React.FC = () => {
    const { id } = useParams();
    const { blogCategories } = useCategory();
    const { update, blog, fetchBlog } = useBlog();
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
        <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <PageBreadCrumb title="Edit Blog" items={["Blogs", "Edit"]} />
            <section className="p-4">
                <div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-6 w-full">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full ">
                                    <div className="flex flex-col col-span-2 gap-2">
                                        <FormInput
                                            id="title"
                                            label="Blog Title"
                                            formErrors={formErrors}
                                            handleChange={handleChange}
                                            formState={formState}
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

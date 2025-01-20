import usePage from "@/seller/hooks/usePage";
import useTheme from "@/seller/hooks/useTheme";
import { PageTypeType, WidgetType } from "@/seller/types";
import { Button, Label, Modal, Select } from "flowbite-react";
import { useState } from "react";

export default function AddWidgetModal() {
    const { addWidgets, page, pageTypes } = usePage();
    const { theme } = useTheme();
    const [openModal, setOpenModal] = useState(false);
    const [_type, setType] = useState<number | null>(null);
    const [selectedWidgets, setSelectedWidgets] = useState<WidgetType[]>([]);

    const handleChange = (item: any) => {
        setSelectedWidgets((prev) => [...prev, item]);
    };

    return (
        <>
            {page && (
                <>
                    <div className="p-4 sm:p-10">
                        <div
                            className="h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-32 flex justify-center items-center hover:bg-gray-200 hover:dark:bg-gray-800 cursor-pointer"
                            onClick={() => setOpenModal(true)}
                        >
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 1v16M1 9h16"
                                    />
                                </svg>
                            </p>
                        </div>
                    </div>{" "}
                    <Modal
                        show={openModal}
                        onClose={() => setOpenModal(false)}
                        size="7xl"
                    >
                        <Modal.Header>Terms of Service</Modal.Header>
                        <Modal.Body className="space-y-6">
                            <div className="max-w-md">
                                <div className="mb-2 block">
                                    <Label htmlFor="type" value="Page Type" />
                                </div>
                                <Select
                                    id="type"
                                    required
                                    onChange={(
                                        event: React.ChangeEvent<HTMLSelectElement>
                                    ) => setType(parseInt(event.target.value))}
                                >
                                    {pageTypes.map(
                                        (type: PageTypeType, index: number) => (
                                            <option
                                                key={index}
                                                value={type.id}
                                                selected={
                                                    page.type?.id === type.id
                                                }
                                            >
                                                {type.label}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </div>
                            <ul className="grid w-full gap-6 md:grid-cols-4">
                                {theme &&
                                    theme.widgets.map(
                                        (item: any, index: number) => (
                                            <li key={index}>
                                                <input
                                                    name="widget"
                                                    type="checkbox"
                                                    id={item.id}
                                                    value={item.id}
                                                    className="hidden peer"
                                                    required
                                                    defaultChecked={
                                                        selectedWidgets.find(
                                                            (widget) =>
                                                                widget.id ===
                                                                item.id
                                                        )
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={() => {
                                                        handleChange(item);
                                                    }}
                                                />
                                                <label
                                                    htmlFor={item.id}
                                                    className="inline-flex items-center justify-between w-full text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600
                                        peer-checked:bg-gray-50
                                        peer-checked:dark:bg-gray-700
                                        hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden"
                                                >
                                                    <div className="block w-full">
                                                        {item.thumbnail && (
                                                            <img
                                                                className="w-full block"
                                                                src={
                                                                    item.thumbnail
                                                                }
                                                                alt={item.label}
                                                            />
                                                        )}
                                                        <div className="w-full p-2.5">
                                                            <p className="text-center">
                                                                {item.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </label>
                                            </li>
                                        )
                                    )}
                            </ul>
                        </Modal.Body>
                        <Modal.Footer className="justify-end">
                            <Button
                                color="gray"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="blue"
                                onClick={() => {
                                    if (selectedWidgets) {
                                        addWidgets.add({
                                            formData: selectedWidgets,
                                            onSuccess: () => {
                                                setOpenModal(false);
                                                setSelectedWidgets([]);
                                            },
                                        });
                                    }
                                }}
                                disabled={selectedWidgets.length === 0}
                            >
                                Add Widget
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </>
    );
}

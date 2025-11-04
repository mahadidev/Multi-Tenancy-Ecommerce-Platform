import useExpense from "@seller/_hooks/useExpense";
import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import type { Expense } from "../types";

interface DeleteExpenseModalProps {
    expense: Expense;
}

const DeleteExpenseModal: FC<DeleteExpenseModalProps> = function ({ expense }) {
    const [isOpen, setOpen] = useState(false);
    const { delete: deleteExpense } = useExpense();

    const handleDelete = () => {
        deleteExpense.submit({
            formData: { id: expense.id },
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
			<>
				<Button color="gray" size="sm" onClick={() => setOpen(true)}>
					<HiTrash className="h-4 w-4" />
				</Button>
				<Modal onClose={() => setOpen(false)} show={isOpen} size="md">
					<Modal.Header>Delete Expense</Modal.Header>
					<Modal.Body>
						<div className="text-center">
							<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
							<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
								Are you sure you want to delete the expense "{expense.title}"?
							</h3>
							<p className="mb-5 text-sm text-gray-400 dark:text-gray-300">
								This action cannot be undone.
							</p>
							<div className="flex justify-center gap-4">
								<Button
									color="failure"
									onClick={handleDelete}
									disabled={deleteExpense.isLoading}
								>
									{deleteExpense.isLoading && (
										<AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
									)}
									Yes, I'm sure
								</Button>
								<Button color="gray" onClick={() => setOpen(false)}>
									No, cancel
								</Button>
							</div>
						</div>
					</Modal.Body>
				</Modal>
			</>
		);
};

export default DeleteExpenseModal;

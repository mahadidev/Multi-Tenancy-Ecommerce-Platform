import { CustomerType } from "@type/customersType";
import { Label, Select } from "flowbite-react";
import { FC } from "react";

interface CustomerSelectorProps {
    customers: CustomerType[];
    selected: number | null;
    setSelected: (val: number | null) => void;
}

export const CustomerSelector: FC<CustomerSelectorProps> = ({
    customers,
    selected,
    setSelected,
}) => (
    <div className="flex flex-col gap-2">
        <Label htmlFor="user_id">Customer</Label>
        <Select
            id="user_id"
            value={selected || ""}
            onChange={(e) => setSelected(Number(e.target.value))}
            required
        >
            <option value="">Select a Customer</option>
            {customers.map(({ id, name }) => (
                <option key={id} value={id}>
                    {name}
                </option>
            ))}
        </Select>
    </div>
);

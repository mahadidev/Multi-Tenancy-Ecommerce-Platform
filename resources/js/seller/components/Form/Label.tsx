import { Label as LabelFr } from "flowbite-react";
import { FC } from "react";

export interface LabelProps {
    label?: string;
    required?: boolean;
    name?: string;
}
const Label:FC<LabelProps> = ({name, label, required}) => {
  return (
		<>
			{label && (
				<LabelFr htmlFor={name} className="flex items-center gap-0.5">
					{label}{' '}
					{required && (
						<span className="text-red-600 font-bold text-xl pt-1.5 pl-0.5 leading-[0]">
							*
						</span>
					)}
				</LabelFr>
			)}
		</>
	);
}
export default Label;

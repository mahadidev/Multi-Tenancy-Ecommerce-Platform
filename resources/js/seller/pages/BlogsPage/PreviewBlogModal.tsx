import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { BlogType } from "@type/blogType";
import { FaEye } from "react-icons/fa";

interface PropsType {
    blog: BlogType;
}

const PreviewPostModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <FaEye className="h-5 w-5" />
                    View Post
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Preview Blog Post</Modal.Header>
                <Modal.Body>
                    
                  <div className="space-y-6">
                    <h1 className="text-2xl dark:text-white font-bold">{props.blog.title}</h1>
                    <img src={props.blog.image} alt={props.blog.title} />
                    <p className="dark:text-white">{props.blog.content}</p>
                  </div>


                </Modal.Body>
                <Modal.Footer>

                <div className="flex justify-end w-full mt-6">
                    <Button
                        color="primary"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Close
                    </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default PreviewPostModal;

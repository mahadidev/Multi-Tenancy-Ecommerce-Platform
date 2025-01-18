import { useAppDispatch, useAppSelector } from "@/seller/store";
import { setModalOpen as setModal } from "@/seller/store/slices/imageUploaderSlice";
import { Button, Modal, Tabs, TabsRef } from "flowbite-react";
import { useRef, useState } from "react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

export default function ImageUploaderModal() {
    const [activeTab, setActiveTab] = useState<"upload" | "gallery">("gallery");
    const tabsRef = useRef<TabsRef>(null);
    const { isModalOpen } = useAppSelector((state) => state.imageUploader);
    const dispatch = useAppDispatch();

    const setModalOpen = (isOpen: boolean) => {
        dispatch(setModal(isOpen));
    };

    return (
        <>
            <Modal
                dismissible
                show={isModalOpen}
                onClose={() => setModalOpen(false)}
                size="7xl"
            >
                <Modal.Header className="pb-0 border-b-0">
                    <Button.Group>
                        <Button
                            color="gray"
                            size="lg"
                            onClick={() => setActiveTab("upload")}
                            className={`${
                                activeTab === "upload" && "!bg-gray-700"
                            } rounded-b-none border-b-0`}
                        >
                            Upload
                        </Button>
                        <Button
                            size="lg"
                            color="gray"
                            onClick={() => setActiveTab("gallery")}
                            className={`${
                                activeTab === "gallery" && "!bg-gray-700"
                            } rounded-b-none border-b-0`}
                        >
                            Gallery
                        </Button>
                    </Button.Group>
                </Modal.Header>
                <Modal.Body className="px-5 py-0">
                    <div className="bg-gray-700 p-4 rounded-lg rounded-tl-none">
                        {activeTab === "gallery" ? (
                            <GalleryCard />
                        ) : (
                            <UploadCard />
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalOpen(false)}>
                        I accept
                    </Button>
                    <Button color="gray" onClick={() => setModalOpen(false)}>
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const GalleryCard = () => {
    return <div className=""></div>;
};

const UploadCard = () => {
    return <div></div>;
};

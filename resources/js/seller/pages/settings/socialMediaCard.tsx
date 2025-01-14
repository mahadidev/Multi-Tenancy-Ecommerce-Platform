import useStore from "@/seller/hooks/useStore";
import { SocialMediaType, StoreType } from "@/seller/types";
import { Button, Card, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const SocialMedias = [
    {
        name: "facebook",
        label: "Facebook",
        icon: (
            <svg
                className="w-5 h-5 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    fill-rule="evenodd"
                    d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                    clip-rule="evenodd"
                />
            </svg>
        ),
    },
    {
        name: "instagram",
        label: "Instagram",
        icon: (
            <svg
                className="w-5 h-5 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                    clip-rule="evenodd"
                />
            </svg>
        ),
    },
    {
        name: "youtube",
        label: "Youtube",
        icon: (
            <svg
                className="w-5 h-5 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    fill-rule="evenodd"
                    d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
                    clip-rule="evenodd"
                />
            </svg>
        ),
    },
];

const SocialMediaCard = () => {
    const {
        store: currentStore,
        addSocialMedia,
        removeSocialMedia,
    } = useStore();
    const store: StoreType = currentStore;

    const [selected, setSelected] = useState<{
        name: string;
        label: string;
        placeholder: string;
        value: string;
    } | null>();
    const [disconnect, setDisconnect] = useState<SocialMediaType | null>(null);

    function onCloseModal() {
        setSelected(null);
        setDisconnect(null);
    }

    return (
        <>
            <Card>
                <div className="flow-root">
                    <h3 className="text-xl font-bold dark:text-white">
                        Social accounts
                    </h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {SocialMedias.map((item, index: number) => (
                            <li className="py-4" key={index}>
                                <div className="flex items-center space-x-4">
                                    <div className="shrink-0">{item.icon}</div>
                                    <div className="min-w-0 flex-1">
                                        <span className="block truncate text-base font-semibold text-gray-900 dark:text-white">
                                            {item.label} account
                                        </span>

                                        <span
                                            className={`block truncate text-sm font-normal ${
                                                store.settings?.social_media?.find(
                                                    (socialMediaItem) =>
                                                        socialMediaItem.name ===
                                                        item.name
                                                )
                                                    ? "text-primary-500 dark:text-primary-400"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {store.settings?.social_media?.find(
                                                (socialMediaItem) =>
                                                    socialMediaItem.name ===
                                                    item.name
                                            )
                                                ? `@${
                                                      store.settings.social_media.find(
                                                          (socialMediaItem) =>
                                                              socialMediaItem.name ===
                                                              item.name
                                                      )?.username
                                                  }`
                                                : "Not connected"}
                                        </span>
                                    </div>
                                    <div className="inline-flex items-center">
                                        {store.settings?.social_media?.find(
                                            (socialMediaItem) =>
                                                socialMediaItem.name ===
                                                item.name
                                        ) ? (
                                            <Button
                                                color="gray"
                                                size="sm"
                                                onClick={() => {
                                                    const foundItem:
                                                        | SocialMediaType
                                                        | undefined =
                                                        store.settings?.social_media?.find(
                                                            (socialMediaItem) =>
                                                                socialMediaItem.name ===
                                                                item.name
                                                        );
                                                    if (foundItem) {
                                                        setDisconnect(
                                                            foundItem
                                                        );
                                                    }
                                                }}
                                            >
                                                Disconnect
                                            </Button>
                                        ) : (
                                            <Button
                                                color="primary"
                                                size="sm"
                                                onClick={() =>
                                                    setSelected({
                                                        label: item.label,
                                                        name: item.name,
                                                        placeholder: `Enter ${item.name} page username`,
                                                        value: "",
                                                    })
                                                }
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>

            <Modal
                show={selected ? true : false}
                size="md"
                onClose={onCloseModal}
                popup
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="socialMedia"
                                    value={selected?.label}
                                />
                            </div>
                            <TextInput
                                id="socialMedia"
                                placeholder={selected?.placeholder}
                                name={selected?.name}
                                required
                                color={
                                    addSocialMedia.error &&
                                    "message" in addSocialMedia.error
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={
                                    addSocialMedia.error &&
                                    "message" in addSocialMedia.error
                                        ? addSocialMedia.error.message
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSelected((prev: any) => ({
                                        ...prev,
                                        value: event.target.value,
                                    }));
                                }}
                                addon="@"
                            />
                        </div>
                        <div className="w-full">
                            <Button
                                color={
                                    selected && selected?.value
                                        ? "blue"
                                        : "gray"
                                }
                                disabled={
                                    selected && selected?.value ? false : true
                                }
                                isProcessing={addSocialMedia.loading}
                                processingLabel="Connecting"
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                                onClick={() => {
                                    if (selected) {
                                        addSocialMedia.add({
                                            socialMedia: {
                                                name: selected.name,
                                                label: selected.label,
                                                username: selected.value,
                                            },
                                            onSuccess: () => onCloseModal(),
                                        });
                                    }
                                }}
                                value={selected?.value}
                            >
                                Connect
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={disconnect ? true : false}
                size="md"
                onClose={onCloseModal}
                popup
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure to disconnect {disconnect?.label}?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => {
                                    if (disconnect) {
                                        removeSocialMedia.remove({
                                            socialMedia: disconnect,
                                            onSuccess: () => onCloseModal(),
                                        });
                                    }
                                }}
                            >
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={onCloseModal}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SocialMediaCard;

import useForm from "@seller/_hooks/useForm";
import { TextInput } from "@seller/components";
import { Button, Card } from "flowbite-react";
import { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useSettings } from "../hooks";

const SettingsSocialMedia = () => {
    const { socialMediaSettings, updateSocialMedia } = useSettings();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: updateSocialMedia.error,
        default: {
            facebook_url: socialMediaSettings.facebook_url,
            twitter_url: socialMediaSettings.twitter_url,
            instagram_url: socialMediaSettings.instagram_url,
            linkedin_url: socialMediaSettings.linkedin_url,
            youtube_url: socialMediaSettings.youtube_url,
            tiktok_url: socialMediaSettings.tiktok_url,
            pinterest_url: socialMediaSettings.pinterest_url,
            whatsapp_number: socialMediaSettings.whatsapp_number,
            telegram_username: socialMediaSettings.telegram_username,
        },
    });

    // Update form state when settings change
    useEffect(() => {
        setFormState({
            facebook_url: socialMediaSettings.facebook_url,
            twitter_url: socialMediaSettings.twitter_url,
            instagram_url: socialMediaSettings.instagram_url,
            linkedin_url: socialMediaSettings.linkedin_url,
            youtube_url: socialMediaSettings.youtube_url,
            tiktok_url: socialMediaSettings.tiktok_url,
            pinterest_url: socialMediaSettings.pinterest_url,
            whatsapp_number: socialMediaSettings.whatsapp_number,
            telegram_username: socialMediaSettings.telegram_username,
        });
    }, [socialMediaSettings, setFormState]);

    const socialPlatforms = [
        { name: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage', icon: '📘' },
        { name: 'twitter_url', label: 'Twitter URL', placeholder: 'https://twitter.com/youraccount', icon: '🐦' },
        { name: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/youraccount', icon: '📷' },
        { name: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/yourprofile', icon: '💼' },
        { name: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/c/yourchannel', icon: '📺' },
        { name: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@youraccount', icon: '🎵' },
        { name: 'pinterest_url', label: 'Pinterest URL', placeholder: 'https://pinterest.com/youraccount', icon: '📌' },
        { name: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+1234567890', icon: '📱' },
        { name: 'telegram_username', label: 'Telegram Username', placeholder: 'yourusername', icon: '📨' },
    ];

    return (
        <Card>
            <h3 className="mb-4 text-xl font-bold dark:text-white">
                Social Media Settings
            </h3>

            <form>
                <div className="grid grid-cols-1 gap-6">
                    {socialPlatforms.map((platform) => (
                        <div key={platform.name} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                                <span className="text-lg">{platform.icon}</span>
                            </div>
                            <div className="flex-1">
                                <TextInput
                                    name={platform.name}
                                    label={platform.label}
                                    formState={formState}
                                    formErrors={formErrors}
                                    onChange={handleChange}
                                    placeholder={platform.placeholder}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="pt-4">
                        <Button
                            color="blue"
                            isProcessing={updateSocialMedia.isLoading}
                            processingLabel="Saving..."
                            disabled={updateSocialMedia.isLoading}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                            onClick={() =>
                                updateSocialMedia.submit({
                                    formData: formState,
                                })
                            }
                        >
                            Save Social Media Settings
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default SettingsSocialMedia;

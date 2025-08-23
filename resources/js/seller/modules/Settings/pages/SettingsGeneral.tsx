import useForm from "@seller/_hooks/useForm";
import { TextInput } from "@seller/components";
import { Button, Card, Label, Select, Textarea, ToggleSwitch } from "flowbite-react";
import { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useSettings } from "../hooks";

const SettingsGeneral = () => {
    const { generalSettings, updateGeneral } = useSettings();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: updateGeneral.error,
        default: {
            site_name: generalSettings.site_name,
            site_description: generalSettings.site_description,
            default_timezone: generalSettings.default_timezone,
            default_currency: generalSettings.default_currency,
            date_format: generalSettings.date_format,
            time_format: generalSettings.time_format,
            admin_email: generalSettings.admin_email,
            maintenance_mode: generalSettings.maintenance_mode,
            allow_registration: generalSettings.allow_registration,
        },
    });

    // Update form state when settings change
    useEffect(() => {
        setFormState({
            site_name: generalSettings.site_name,
            site_description: generalSettings.site_description,
            default_timezone: generalSettings.default_timezone,
            default_currency: generalSettings.default_currency,
            date_format: generalSettings.date_format,
            time_format: generalSettings.time_format,
            admin_email: generalSettings.admin_email,
            maintenance_mode: generalSettings.maintenance_mode,
            allow_registration: generalSettings.allow_registration,
        });
    }, [generalSettings, setFormState]);

    const timezones = [
        'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
        'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'
    ];

    const currencies = [
        'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'BDT', 'INR'
    ];

    const dateFormats = [
        'Y-m-d', 'm/d/Y', 'd/m/Y', 'd-m-Y', 'F j, Y'
    ];

    const timeFormats = [
        'H:i:s', 'h:i:s A', 'H:i', 'h:i A'
    ];

    return (
        <Card>
            <h3 className="mb-4 text-xl font-bold dark:text-white">
                General Settings
            </h3>
            <form>
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                        <TextInput
                            name="site_name"
                            label="Site Name"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                            placeholder="Enter site name"
                        />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                        <TextInput
                            name="admin_email"
                            label="Admin Email"
                            type="email"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                            placeholder="Enter admin email"
                        />
                    </div>

                    <div className="col-span-full grid grid-cols-1 gap-y-2">
                        <Label htmlFor="site_description">Site Description</Label>
                        <Textarea
                            name="site_description"
                            id="site_description"
                            placeholder="Enter site description"
                            value={formState.site_description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                        <Label htmlFor="default_timezone">Default Timezone</Label>
                        <Select
                            id="default_timezone"
                            name="default_timezone"
                            value={formState.default_timezone}
                            onChange={handleChange}
                        >
                            {timezones.map((timezone) => (
                                <option key={timezone} value={timezone}>
                                    {timezone}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                        <Label htmlFor="default_currency">Default Currency</Label>
                        <Select
                            id="default_currency"
                            name="default_currency"
                            value={formState.default_currency}
                            onChange={handleChange}
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                        <Label htmlFor="date_format">Date Format</Label>
                        <Select
                            id="date_format"
                            name="date_format"
                            value={formState.date_format}
                            onChange={handleChange}
                        >
                            {dateFormats.map((format) => (
                                <option key={format} value={format}>
                                    {format}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                        <Label htmlFor="time_format">Time Format</Label>
                        <Select
                            id="time_format"
                            name="time_format"
                            value={formState.time_format}
                            onChange={handleChange}
                        >
                            {timeFormats.map((format) => (
                                <option key={format} value={format}>
                                    {format}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-span-6 flex items-center gap-4">
                        <ToggleSwitch
                            checked={formState.maintenance_mode}
                            label="Maintenance Mode"
                            onChange={(checked) =>
                                setFormState((prev: any) => ({
                                    ...prev,
                                    maintenance_mode: checked,
                                }))
                            }
                        />
                    </div>

                    <div className="col-span-6 flex items-center gap-4">
                        <ToggleSwitch
                            checked={formState.allow_registration}
                            label="Allow Registration"
                            onChange={(checked) =>
                                setFormState((prev: any) => ({
                                    ...prev,
                                    allow_registration: checked,
                                }))
                            }
                        />
                    </div>

                    <div className="col-span-6">
                        <Button
                            color="blue"
                            isProcessing={updateGeneral.isLoading}
                            processingLabel="Saving..."
                            disabled={updateGeneral.isLoading}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                            onClick={() =>
                                updateGeneral.submit({
                                    formData: formState,
                                })
                            }
                        >
                            Save Settings
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default SettingsGeneral;

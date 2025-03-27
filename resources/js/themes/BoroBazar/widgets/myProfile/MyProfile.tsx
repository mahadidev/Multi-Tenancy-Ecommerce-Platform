import { ThemeWidgetPropsType } from "@type/themeType";
import { Button, Card } from "flowbite-react";
import { FC } from "react";
import { HiPencil } from "react-icons/hi";

const MyProfile: FC<ThemeWidgetPropsType> = () => {
    return (
        <div>
            <div className="container w-8/12 mx-auto">
                {" "}
                {/* Profile Header */}
                <div className="relative w-full bg-gray-700 h-52 rounded-lg overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Profile Background"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute top-4 right-4">
                        <Button size="sm" color="dark">
                            <div className="flex items-center gap-2">
                                <HiPencil className="w-4 h-4 mr-1" /> Edit
                            </div>
                        </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center">
                            <span className="text-xl font-semibold text-gray-600">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                                    alt="user"
                                />
                            </span>
                        </div>
                        <h2 className="text-white text-xl font-semibold ml-4">
                            Mehedi Hasan Rafiz
                        </h2>
                    </div>
                </div>
                {/* Account Information */}
                <Card className="mt-6">
                    <h3 className="text-2xl font-semibold mb-2">
                        Account Information
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold">
                                E-mail address
                            </h4>
                            <p className="text-sm text-gray-700">
                                rafiz.mehedi@gmail.com
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold">
                                Contact Number
                            </h4>
                            <p className="text-sm text-gray-700">1600221211</p>
                        </div>
                        <div className="col-span-2">
                            <h4 className="text-lg font-semibold">Address</h4>
                            <p className="text-sm text-gray-700">Mirpur TSO.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MyProfile;

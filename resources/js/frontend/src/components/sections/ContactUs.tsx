import { Label, Textarea, TextInput } from "flowbite-react";

const ContactUs = () => {
    return (
        <div className="container mt-5">
            <div>
                <div className="relative w-max mx-auto">
                    <h1 className="w-max text-center text-2xl lg:text-5xl text-primary font-medium">
                        Let's
                        <span className="relative after:w-full after:h-[4px] after:absolute after:-z-10 after:left-0 after:bottom-2 after:bg-primary-light after:rounded-full">
                            {" "}
                            Connect
                        </span>{" "}
                        Us
                    </h1>
                </div>
                <br />
                <br />
                <div className="grid gap-5  bg-amber-50 p-8 rounded-lg">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={"name"}>Your Name</Label>
                        <TextInput
                            id={"name"}
                            name={"name"}
                            placeholder={"Your name"}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={"email"}>Your Email</Label>
                        <TextInput
                            id={"email"}
                            name={"email"}
                            placeholder={"Your email"}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={"name"}>Your Phone</Label>
                        <TextInput
                            id={"phone"}
                            name={"phone"}
                            placeholder={"Your phone"}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={"name"}>Your Message</Label>
                        <Textarea
                            id={"message"}
                            name={"message"}
                            placeholder={"Your message"}
                            required
                            rows={4}
                            className="p-3"
                        />
                    </div>{" "}
                    <div className="flex flex-col gap-2">
                        <button className="w-full px-4 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary-dark">
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

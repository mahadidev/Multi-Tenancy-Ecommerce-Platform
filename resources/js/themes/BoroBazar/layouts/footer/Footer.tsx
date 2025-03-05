import { SocialMediaType } from "@type/socialMediaType";
import { ThemeLayoutPropsType } from "@type/themeType";
import { FC } from "react";
import {
    FaFacebook,
    FaInstagram,
    FaRegEnvelope,
    FaWhatsapp,
    FaYoutube,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { TfiLocationPin } from "react-icons/tfi";
import { Link } from "react-router-dom";

const Footer: FC<ThemeLayoutPropsType> = ({ store }) => {
    return (
        <div className="border-t mt-16">
            <footer className="container mx-auto py-8">
                <div className="grid px-5 md:px-0 md:grid-cols-4 gap-5 pb-14">
                    <div>
                        <div className="flex flex-col text-left max-w-[300px] sm:ml-0 pb-6">
                            <Link to="/">
                                <a className="inline-block max-w-[131px] w-full mb-5 sm:ml-0">
                                    <img
                                        src={store?.logo}
                                        alt="BoroBazar_Logo"
                                        width={131}
                                        height={30}
                                    />
                                </a>
                            </Link>
                            <p className="text-brand-muted text-sm leading-7 lg:leading-[27px] lg:text-[15px]">
                                {store?.description}
                            </p>
                        </div>

                        <ul className="flex flex-wrap sm:justify-start">
                            {store?.social_media?.map(
                                (media: SocialMediaType) => (
                                    <li className="transition hover:opacity-80 mx-2 md:mx-3">
                                        <a
                                            href={media?.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {media?.name === "facebook" && (
                                                <FaFacebook
                                                    size={30}
                                                    color="#02B290"
                                                />
                                            )}
                                            {media?.name === "instagram" && (
                                                <FaInstagram
                                                    size={30}
                                                    color="#02B290"
                                                />
                                            )}
                                            {media?.name === "youtube" && (
                                                <FaYoutube
                                                    size={30}
                                                    color="#02B290"
                                                />
                                            )}
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                    <div className="pb-3.5 sm:pb-0">
                        <h3 className="text-brand-dark text-base lg:text-[17px] lg:leading-7 font-medium mb-6">
                            Pages
                        </h3>
                        <ul className="flex flex-col space-y-3 text-sm lg:text-[15px]">
                            {store?.pages?.map((page, index) => (
                                <li key={index}>
                                    <Link to={page?.slug}>
                                        <a className="transition-colors duration-200 hover:text-brand-dark font-medium">
                                            {page?.title}
                                        </a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pb-3.5 sm:pb-0">
                        <h3 className="text-brand-dark text-base lg:text-[17px] lg:leading-7 font-medium mb-6">
                            Contact
                        </h3>
                        <ul className="flex flex-col space-y-3 text-sm lg:text-[15px]">
                            <li>
                                <p className="transition-colors flex items-center gap-2 duration-200 hover:text-brand-dark font-medium">
                                    <TfiLocationPin size={30} color="#02B290" />
                                    {store?.location}
                                </p>
                            </li>
                            <li>
                                <p className="transition-colors flex items-center gap-2 duration-200 hover:text-brand-dark font-medium">
                                    <FaWhatsapp size={25} color="#02B290" />{" "}
                                    {store?.phone}
                                </p>
                            </li>
                            <li>
                                <p className="transition-colors flex items-center gap-2 duration-200 hover:text-brand-dark font-medium">
                                    <FaRegEnvelope size={25} color="#02B290" />{" "}
                                    {store?.email}
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="pb-3.5 sm:pb-0">
                        <h3 className="text-brand-dark text-base lg:text-[17px] lg:leading-7 font-medium mb-6">
                            Subscribe Now
                        </h3>
                        <p className="text-brand-muted text-sm leading-7 lg:leading-[27px] lg:text-[15px] max-w-[400px]">
                            Subscribe your email for newsletter and featured
                            news based on your interest.
                        </p>
                        <form className="relative mt-5 max-w-[400px]">
                            <input
                                type="email"
                                placeholder="Write your email here"
                                className="py-2 px-4 w-full border text-input rounded-md h-12 focus:outline-none focus:border-brand"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 h-12 px-3 hover:opacity-80"
                            >
                                <FiSend color="#02B290" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pb-7">
                    <div className="mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 2xl:px-10">
                        <div className="flex flex-col text-center border-t pt-6 md:flex-row md:justify-between border-border-three lg:pt-7">
                            <p className="text-brand-dark text-sm leading-7 lg:text-[15px]">
                                © Copyright 2025{" "}
                                <Link to="https://redq.io">
                                    <a className="text-brand-dark hover:text-brand">
                                        {store?.name}
                                    </a>
                                </Link>{" "}
                                All rights reserved
                            </p>
                            {/* <ul className="flex flex-wrap justify-center items-center mt-3 md:mt-0">
                                {[
                                    "mastercard",
                                    "visa",
                                    "paypal",
                                    "jcb",
                                    "skrill",
                                ].map((payment) => (
                                    <li
                                        key={payment}
                                        className="inline-flex mx-2 hover:opacity-80"
                                    >
                                        <img
                                            src={`/assets/images/payment/${payment}.svg`}
                                            alt={payment}
                                            width={40}
                                            height={20}
                                        />
                                    </li>
                                ))}
                            </ul> */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default Footer;

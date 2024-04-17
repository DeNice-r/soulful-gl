import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="w-full py-12">
            <div className="container flex flex-col flex-wrap gap-12 px-4 text-sm md:gap-16 lg:px-6">
                <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-16">
                    <div className="flex flex-col gap-2">
                        <div className="space-y-1.5">
                            <h3 className="text-base font-semibold">
                                Зв&apos;язатись із нами
                            </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Link className="font-medium underline" href="#">
                                customer@support.soulful.pp.ua
                            </Link>
                            <p className="font-medium">+380412012345</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-1.5">
                            <h3 className="text-base font-semibold">
                                Навігація
                            </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Link className="font-medium underline" href="#">
                                Головна
                            </Link>
                            <Link className="font-medium underline" href="#">
                                Статті
                            </Link>
                            <Link className="font-medium underline" href="#">
                                Чат
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold">Почати чат</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Почати спілкування зі спеціалістом
                        </p>
                        <div className="flex justify-between">
                            <Link
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 shadow-sm hover:shadow dark:bg-gray-800"
                                href="#"
                            >
                                <FacebookIcon className="h-4 w-4" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 shadow-sm hover:shadow dark:bg-gray-800"
                                href="#"
                            >
                                <TelegramIcon className="h-6 w-6" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 shadow-sm hover:shadow dark:bg-gray-800"
                                href="#"
                            >
                                <ViberIcon className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <span>© 2024 Soulful Inc. All rights reserved.</span>
            </div>
        </footer>
    );
};

function FacebookIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function ViberIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 24 24"
        >
            <path d="M 10 0.98046875 C 5.664 0.98046875 2 4.4353906 2 8.5253906 L 2 12.023438 C 2 15.409437 3.0230469 17.614281 5.1230469 18.738281 L 5.1230469 21.039062 C 5.1230469 21.820063 5.5876875 22.520219 6.3046875 22.824219 C 6.5486875 22.927219 6.8055469 22.978516 7.0605469 22.978516 C 7.5545469 22.978516 8.0401562 22.788688 8.4101562 22.429688 L 11.371094 19.570312 L 14.439453 19.570312 C 18.608453 19.570313 22 16.184437 22 12.023438 L 22 8.5253906 C 22 4.3643906 18.607453 0.98046875 14.439453 0.98046875 L 10 0.98046875 z M 10 2.9804688 L 14.441406 2.9804688 C 17.507406 2.9804688 20.001953 5.4673906 20.001953 8.5253906 L 20.001953 12.023438 C 20.001953 15.082437 17.506406 17.570312 14.441406 17.570312 L 10.96875 17.570312 C 10.70975 17.570312 10.460437 17.670562 10.273438 17.851562 L 7.1230469 20.894531 L 7.1230469 18.101562 C 7.1230469 17.692563 6.8721875 17.324828 6.4921875 17.173828 C 4.7911875 16.495828 4 14.859438 4 12.023438 L 4 8.5253906 C 4 5.5713906 6.804 2.9804688 10 2.9804688 z M 13 3.9804688 C 12.724 3.9804688 12.5 4.2044688 12.5 4.4804688 C 12.5 4.7564687 12.724 4.9804688 13 4.9804688 C 15.947 4.9804688 18 7.6154687 18 9.9804688 C 18 10.256469 18.224 10.480469 18.5 10.480469 C 18.776 10.480469 19 10.256469 19 9.9804688 C 19 7.1424688 16.536 3.9804688 13 3.9804688 z M 8.0019531 4.9902344 C 7.7637031 4.9543594 7.5116875 5.0109219 7.3046875 5.1699219 L 6.7167969 5.6230469 C 6.0227969 6.1560469 5.8013594 7.0969531 6.1933594 7.8769531 C 6.9313594 9.3439531 8.1679375 11.604406 9.2109375 12.566406 C 10.492938 13.750406 12.507172 15.15375 14.201172 15.84375 C 14.942172 16.14575 15.790547 15.933172 16.310547 15.326172 C 16.495547 15.110172 16.668359 14.890406 16.818359 14.691406 C 17.125359 14.283406 17.036094 13.70525 16.621094 13.40625 L 14.75 12.060547 C 14.348 11.771547 13.786375 11.851188 13.484375 12.242188 L 13.169922 12.589844 C 12.961922 12.819844 12.64875 12.940906 12.34375 12.878906 C 11.86775 12.782906 11.113187 12.472063 10.242188 11.539062 C 9.5231875 10.771063 9.1196562 9.9537656 8.9726562 9.3847656 C 8.8846563 9.0447656 9.0063438 8.6898438 9.2773438 8.4648438 L 9.5917969 8.203125 C 9.9587969 7.899125 10.030859 7.3665156 9.7558594 6.9785156 L 8.6152344 5.3671875 C 8.4652344 5.1546875 8.2402031 5.0261094 8.0019531 4.9902344 z M 13 5.9804688 C 12.724 5.9804688 12.5 6.2044688 12.5 6.4804688 C 12.5 6.7564687 12.724 6.9804688 13 6.9804688 C 14.514 6.9804688 16 8.4664688 16 9.9804688 C 16 10.256469 16.224 10.480469 16.5 10.480469 C 16.776 10.480469 17 10.256469 17 9.9804688 C 17 7.9244688 15.056 5.9804688 13 5.9804688 z M 13 7.9804688 C 12.724 7.9804688 12.5 8.2044688 12.5 8.4804688 C 12.5 8.7564687 12.724 8.9804688 13 8.9804688 C 13.645 8.9804688 14 9.3354688 14 9.9804688 C 14 10.256469 14.224 10.480469 14.5 10.480469 C 14.776 10.480469 15 10.256469 15 9.9804688 C 15 8.7844687 14.196 7.9804688 13 7.9804688 z"></path>
        </svg>
    );
}

function TelegramIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 64 64"
        >
            <path d="M 32 10 C 19.85 10 10 19.85 10 32 C 10 44.15 19.85 54 32 54 C 44.15 54 54 44.15 54 32 C 54 19.85 44.15 10 32 10 z M 32 14 C 41.941 14 50 22.059 50 32 C 50 41.941 41.941 50 32 50 C 22.059 50 14 41.941 14 32 C 14 22.059 22.059 14 32 14 z M 41.041016 23.337891 C 40.533078 23.279297 39.894891 23.418531 39.181641 23.675781 C 37.878641 24.145781 21.223719 31.217953 20.261719 31.626953 C 19.350719 32.014953 18.487328 32.437828 18.486328 33.048828 C 18.486328 33.478828 18.741312 33.721656 19.445312 33.972656 C 20.177313 34.234656 22.023281 34.79275 23.113281 35.09375 C 24.163281 35.38275 25.357344 35.130844 26.027344 34.714844 C 26.736344 34.273844 34.928625 28.7925 35.515625 28.3125 C 36.102625 27.8325 36.571797 28.448688 36.091797 28.929688 C 35.611797 29.410688 29.988094 34.865094 29.246094 35.621094 C 28.346094 36.539094 28.985844 37.490094 29.589844 37.871094 C 30.278844 38.306094 35.239328 41.632016 35.986328 42.166016 C 36.733328 42.700016 37.489594 42.941406 38.183594 42.941406 C 38.877594 42.941406 39.242891 42.026797 39.587891 40.966797 C 39.992891 39.725797 41.890047 27.352062 42.123047 24.914062 C 42.194047 24.175062 41.960906 23.683844 41.503906 23.464844 C 41.365656 23.398594 41.210328 23.357422 41.041016 23.337891 z"></path>
        </svg>
    );
}

export default Footer;

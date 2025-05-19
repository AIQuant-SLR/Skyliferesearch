import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-scroll'
import { useState, useEffect, useRef } from 'react'
import nav from "../data/nav.json"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext.jsx'
import { logout } from './Logout.jsx'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const [navigation, setNavigation] = useState(nav);
    const sectionRefs = useRef({});
    const { user, setUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        sectionRefs.current = navigation.reduce((acc, item) => {
            acc[item.name] = document.getElementById(item.name);
            return acc;
        }, {});
    }, [navigation]);

    const handleLogout = async () => {
        setDropdownOpen(false);
        localStorage.removeItem("user");
        setUser(null);
        await logout(setUser);
    };

    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account"
        });
        try{
            const result = await signInWithPopup(auth, provider)
            console.log(result);
            if (result.user) {
                setUser(result.user)
                localStorage.setItem("user", JSON.stringify(result.user))
                toast.success("User logged in successfully.",
                    { position: "bottom-left" }
                )
            }
        }
        catch(error) {
            console.error("Error during Google login", error);
            toast.error("Error during Google login");
        }

    }

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setNavigation((prevNav) =>
                        prevNav.map((item) => ({
                            ...item,
                            current: item.name === entry.target.id
                        }))
                    );
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs.current).forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            Object.values(sectionRefs.current).forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, [navigation]);

    const handleSectionClick = (item) => {
        setNavigation((prevNav) =>
            prevNav.map((navItem) =>
                navItem.id === item.id ? { ...navItem, current: true } : { ...navItem, current: false }
            )
        );
    };

    return (
        <div className="sticky top-0 z-50">
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </DisclosureButton>
                                </div>
                                <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

                                        <div className="flex shrink-0 items-center" >
                                            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                                <img alt="Your Company" src="/skylife.svg" className="h-8 w-auto cursor-pointer rounded-lg" />
                                            </Link>
                                        </div>

                                        <div className="hidden sm:ml-6 sm:block">
                                            <div className="flex space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        to={item.name}
                                                        smooth={true}
                                                        duration={500}
                                                        offset={-70}
                                                        aria-current={item.current ? 'page' : undefined}
                                                        className={classNames(
                                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                            'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                                        )}
                                                        onClick={() => handleSectionClick(item)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className=" sm:hidden mx-3 items-center">
                                        {user ? (
                                            <>
                                                <img
                                                    src={user.photoURL}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full border cursor-pointer"
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                />
                                                {dropdownOpen && (
                                                    <div className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md z-50 border border-gray-200">
                                                        <div className="px-4 py-2 text-gray-700 font-medium border-b border-gray-100">
                                                            Hi, {user.displayName.split(" ")[0]}
                                                        </div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="block w-full text-red-500 text-left px-4 py-2 hover:bg-grey-100 hover:text-red-800 transition"
                                                        >
                                                            Logout
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div
                                                className="border border-blue-500 text-blue-500 px-4 py-2 rounded cursor-pointer hover:bg-blue-100 transition"
                                                onClick={googleLogin}
                                            >
                                                SignUp
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden sm:block flex items-center">
                                        {user ? (
                                            <>
                                                <img
                                                    src={user.photoURL}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full border cursor-pointer"
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                />
                                                {dropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50 border border-gray-200">
                                                        <div className="px-4 py-2 text-gray-700 font-medium border-b border-gray-100">
                                                            Hi! {user.displayName.split(" ")[0]}
                                                        </div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="block w-full text-red-500 text-left px-4 py-2 hover:bg-grey-100 hover:text-red-800 transition"
                                                        >
                                                            Logout
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div
                                                className="border border-blue-500 text-blue-500 px-4 py-2 rounded cursor-pointer hover:bg-blue-100 transition inline-flex items-center justify-center w-auto"
                                                onClick={googleLogin}
                                            >
                                                SignUp
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DisclosurePanel className="sm:hidden">
                            {({ close }) => (
                                <div className="flex flex-col space-y-1 px-2 pb-3 pt-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.name}
                                            smooth={true}
                                            duration={500}
                                            offset={-260}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-900 text-white cursor-pointer'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'block rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                            )}
                                            onClick={() => {
                                                handleSectionClick(item);
                                                close();
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>
        </div >
    );
}
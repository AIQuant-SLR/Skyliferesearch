import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

export function GoogleSignin({ closeModal }) {
    const { setUser } = useAuth();

    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account"
        });
        try{
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                setUser(result.user);
                toast.success("User logged in successfully.", {
                    position: "bottom-left"
                }
                );
                localStorage.setItem("user", JSON.stringify(result.user));
                closeModal();  // Close the modal after login
            }
        }
        catch(error) {
            console.error("Error during Google login", error);
            toast.error("Error during Google login");
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
                <p className="text-lg text-gray-700 font-semibold">Welcome to Skylife Research</p>
                <button
                    className="text-gray-500 hover:text-red-500 text-lg font-bold transition"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    ✕
                </button>
            </div>
            <div className="mb-4 ">
                <p className=" px-10"> Sign-in to personal account to stay connected with us.</p>
                <img src="./skylife.svg" alt="" className="rounded-lg " />
            </div>
            <button
                onClick={googleLogin}
                className="flex items-center justify-between text-black px-6 py-2 border rounded-lg border-black-500 hover:bg-blue-200 transition w-full "
            >
                <img
                    src="./g.png"
                    alt="Google Logo"
                    className="w-5 h-5" // Adjust size
                />
                <span className="ml-auto">Sign in with Google</span>
            </button>
        </div>
    )
}


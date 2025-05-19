import { useAuth } from "../context/AuthContext.jsx";
import { useState } from 'react'
import { GoogleSignin } from '../components/googleSignin.jsx'
import { toast } from 'react-toastify';

export function Portfolio() {
    const {user}=useAuth();
    const [showModal, setShowModal] = useState(false)
    const [stockName, setStockName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [numberOfStocks, setNumberOfStocks] = useState('');

    const handleClick = () => {
        if (user) {
            // User is logged in, proceed with the action
            if (!stockName || !startDate || !numberOfStocks) {
                toast.error("Please fill out all fields before submitting.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
          console.log("Backend will setUP soon!!")
        } else {
          setShowModal(true)
            toast.error("Please sign-in to generate your portfolio.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
      }
    
      const closeModal = () => {
        setShowModal(false)
      }
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg my-10 portfolio">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Stock Portfolio</h2>
  
        <div className="space-y-4">
          {/* Stock Entry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Stock Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Name</label>
              <input
                type="text"
                placeholder="e.g., AAPL"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}  
                className="w-full text-black px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 text-black py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Stocks</label>
              <input
                type="number"
                min="1"
                placeholder="e.g., 50"
                value={numberOfStocks}
                onChange={(e) => setNumberOfStocks(e.target.value)}
                className="w-full px-3 py-2 text-black border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="text-center mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={handleClick}>
              Generate Result
            </button>
          </div>
        </div>
        {showModal && (
        <>
          <div
            className=" fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-40"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <GoogleSignin closeModal={closeModal} />
          </div>
        </>
      )}
      </div>
    );
  }
  
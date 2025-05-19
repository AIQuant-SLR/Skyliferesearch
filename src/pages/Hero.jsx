
import React, { useEffect, useState, useRef } from "react";
import NetworkGraph from "../components/NetworkGraph";
import { GoogleSignin } from "../components/googleSignin";
import StocksInfo from "../components/StocksInfo";
import { Portfolio } from "../components/Portfolio";

export default function Hero() {
    const [grData, setGrData] = useState({ myArray: [] });
    const [totalData, setTotalData] = useState({ myArray: [] })
    const [open, setOpen] = useState(false)
    const [obj, setObj] = useState([]);
    const [pt_width, setWidth] = useState()
    const [loading, setLoading] = useState(false);
    const [currDate, setCurrDate] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [connectedNodes, setConnectedNodes] = useState([]);
    const [connectedLinks, setConnectedLinks] = useState([]);
    const [width, setInnerWidth] = useState(window.innerWidth);

    const pt_container = useRef()
    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    // useEffect(()=>{
    //     console.log( import.meta.env.VITE_API_TOKEN);
        
    // },[])
    useEffect(() => {
        setWidth(pt_container.current.clientWidth)
        const fetchData = async () => {
            try {
                setLoading(true);
                const catchedData = localStorage.getItem('networkData')
                const fullData = localStorage.getItem('fullData')
                const clickDate = localStorage.getItem('clickDate')
                const objNetwork = JSON.parse(localStorage.getItem('obj') || "[]");
                const cachedTimestamp = localStorage.getItem("networkDate");
                const now = new Date().getTime();
                const twelveHours = 12 * 60 * 60 * 1000;

                if (Array.isArray(objNetwork) && catchedData && fullData && clickDate && now - cachedTimestamp <= twelveHours) {

                    setObj(objNetwork)
                    setCurrDate(clickDate)
                    objNetwork.forEach((st, i) => {
                        setTotalData((pre) => ({ ...pre, [st]: JSON.parse(fullData)[i] }));
                        setGrData((pre) => ({ ...pre, [st]: JSON.parse(catchedData)[i] }));
                    });
                    setLoading(false);
                    return;
                }
                const response = await fetch("https://api.skyliferesearch.com/network-graph", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                const obj = Object.keys(data).sort((a, b) => {
                    const num1 = a.split("_")[2];
                    const num2 = b.split("_")[2];
                    return num2 - num1;
                });
                setObj(obj);
                setCurrDate(obj[0]);
                localStorage.setItem('clickDate', obj[0])
                const processed_data = obj.map((st) => {
                    return data[st]
                        .filter((stc) => stc.weight > 0.55)
                        .sort((a, b) => {
                            const nodeA = a.weight
                            const nodeB = b.weight
                            return nodeB - nodeA
                        })
                        .map((stock) => ({
                            ...stock,
                            source: stock.source.split("-")[0],
                            target: stock.target.split("-")[0],
                            weight: "0." + Math.floor(stock.weight * 100),
                        }));
                });
                const completeData = obj.map((st) => {
                    return data[st]
                        .sort((a, b) => {
                            const nodeA = a.weight
                            const nodeB = b.weight
                            return nodeB - nodeA
                        })
                        .map((stock) => ({
                            ...stock,
                            source: stock.source.split("-")[0],
                            target: stock.target.split("-")[0],
                            weight: "0." + Math.floor(stock.weight * 100),
                        }));
                });
                // console.log(processed_data)
                localStorage.setItem('networkData', processed_data)
                obj.forEach((st, key) => {
                    setGrData((pre) => ({ ...pre, [st]: processed_data[key] }));
                    setTotalData((pre) => ({ ...pre, [st]: completeData[key] }))
                });
                localStorage.setItem("networkData", JSON.stringify(processed_data));
                localStorage.setItem("fullData", JSON.stringify(completeData));
                localStorage.setItem('obj', JSON.stringify(obj))
                localStorage.setItem("networkDate", now.toString());
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error(err);
            }
        };
        fetchData();
    }, [width]);
    return (
        <>
        <div className="relative px-6 py-2 lg:px-8 text-white overflow-hidden bg-black-400" id="Home">
            <div className="absolute inset-0 bg-black">
                {/* <ParticlesBg type="lines" bg={true} /> */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.4)_5%,rgba(20,20,20,1)_90%)] opacity-60"></div>
            </div>
            <div className="relative z-10 mx-auto max-w-7xl py-10 flex flex-col items-center text-center">
                <div className="my-6">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                        Skylife Research
                    </h1>
                    <h2 className="text-lg text-gray-400 mt-2 max-w-3xl">
                        Redefining portfolio management using graph theory.
                    </h2>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-b black to-gray-900 md:p-6 rounded-lg mt-4 w-full">
                    <div className="flex flex-col md:flex-row justify-center items-center w-full gap-6">
                        <div className="w-full md:w-2/3 lg:w-[800px] flex flex-col justify-center items-center rounded-2xl"
                            ref={pt_container}>
                            {open && <StocksInfo data={totalData[currDate]} setOpen={setOpen} />}
                            {loading ? (
                                <p className="text-gray-300 text-center">Fetching Network Graph...</p>
                            ) : (
                                <NetworkGraph
                                    data={grData[currDate]}
                                    setHoveredNode={setHoveredNode}
                                    setConnectedNodes={setConnectedNodes}
                                    setConnectedLinks={setConnectedLinks}
                                    pt_width={pt_width}
                                />
                            )}
                            <div
                                className="mt-2 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg cursor-pointer transition duration-300 hover:bg-indigo-700 active:scale-95"
                                onClick={() => setOpen(true)}
                            >
                                Info
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-auto lg:max-w-none p-6 bg-gray-900 shadow-md rounded-2xl text-gray-300 mt-2">
                        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4 text-center flex flex-col items-center gap-2">
                            {hoveredNode ? `Stocks correlated to ${hoveredNode}` : "Correlated Stocks"}
                        </h3>
                        <div className="w-full flex justify-center mb-4 md:mb-6">
                            <div className="px-2 py-2 text-white-500 text-xl font-semibold">Date</div>
                            <select
                                value={currDate || ""}
                                onChange={(e) => setCurrDate(e.target.value)}
                                className="w-full md:w-auto px-2 py-2 bg-gray-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                {obj.map((st_name) => {
                                    const timestamp = st_name.split("_")[2];
                                    const formattedDate = `${timestamp.substring(6, 8)}-${timestamp.substring(4, 6)}-${timestamp.substring(0, 4)}`;
                                    return (
                                        <option key={st_name} value={st_name}>
                                            {formattedDate}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {hoveredNode ? (
                            <div className="overflow-x-auto">
                                <ul className="inline-flex flex-wrap gap-2 min-w-fit">
                                    {connectedLinks.map((node, index) => (
                                        <li
                                            key={index}
                                            className="px-3 py-1 bg-gray-800 rounded-lg text-gray-300 text-sm transition-colors hover:bg-gray-700"
                                        >
                                            {node.source.id === hoveredNode
                                                ? `${node.target.id} (${node.weight})`
                                                : `${node.source.id} (${node.weight})`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">
                                Hover over a node to see connections
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <Portfolio/>
        </>
    );
}

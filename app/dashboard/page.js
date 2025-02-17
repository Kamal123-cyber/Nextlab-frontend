"use client";

import { useEffect, useState } from "react";
import CONSTANT from "../Constant";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState({ name: "User", points: 0, tasksCompleted: 0 });
    const [screenshots, setScreenshots] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log("selectedTask", selectedTask)


    const fetchTasks = async () => {
        const token = localStorage.getItem("access_token"); // Get access token from localStorage
        if (!token) {
            console.error("No access token found!");
            return;
        }
        console.log(token, 'token')
        try {
            const response = await fetch(`${CONSTANT.BASE_URL}/api/rewards/tasks/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();
            setTasks(data);

            // Update user info based on the fetched data
            const completedTasks = data.filter(task => task.is_completed).length;
            const totalPoints = data.reduce((sum, task) => sum + task.points_earned, 0);

            setUser(prev => ({
                ...prev,
                tasksCompleted: completedTasks,
                points: totalPoints
            }));
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);

    // const handleDrop = (event) => {
    //     event.preventDefault();
    //     const file = event.dataTransfer.files[0];
    //     if (file && selectedTask) {
    //         setScreenshots(prev => ({
    //             ...prev,
    //             [selectedTask]: URL.createObjectURL(file)
    //         }));
    //         setIsModalOpen(false);
    //     }
    // };

    // const handleDragOver = (event) => {
    //     event.preventDefault();
    // };

    const openModal = (taskId) => {
        setSelectedTask(taskId);
        setIsModalOpen(true);
    };
   

    const handleFileUpload = async (file) => {
        if (!file || !selectedTask) return;

        try {
            const token = localStorage.getItem("access_token"); // Get auth token
            const formData = new FormData();
            formData.append("screenshot", file); // Ensure this matches Django API
            const response = await fetch(`${CONSTANT.BASE_URL}/api/rewards/tasks/${selectedTask}/upload/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            // ✅ Read response JSON only once
            const data = await response.json();
            console.log("Response Data:", data);
        
            if (data.message) {
                setScreenshots((prev) => ({
                    ...prev,
                    [selectedTask]: URL.createObjectURL(file),
                }));
                fetchTasks();
                setTimeout(() => {
                    alert("Screenshot uploaded successfully!");
                }, 1000);
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading screenshot.");
        }
        
    };


    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto p-8 space-y-8">
                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-lg text-gray-600">Welcome back, manage your tasks and track your progress.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-gray-900">Total Points</h3>
                            <span className="text-yellow-500 text-xl">🏆</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{user.points}</div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-gray-900">Tasks Completed</h3>
                            <span className="text-green-500 text-xl">✓</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{user.tasksCompleted}</div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-gray-900">Pending Tasks</h3>
                            <span className="text-blue-500 text-xl">⏰</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {tasks.filter(task => !task.is_completed).length}
                        </div>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            App Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Screenshot
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Points Earned
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {task.app_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {screenshots[task.id] ? (
                                                    <img
                                                        src={screenshots[task.id]}
                                                        alt="Task Screenshot"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() => openModal(task.uid)}
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        Upload Screenshot
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {task.points_earned}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-sm font-medium rounded-full
                            ${task.is_completed
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {task.is_completed ? "Completed" : "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                {/* // Modal Component */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Upload Screenshot</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>
                            {/* <div>{selectedTask}</div> */}

                            {/* Drag and Drop Area */}
                            <div
                                className="border-2 border-dashed rounded-lg p-8 text-center"
                                onDragOver={(event) => event.preventDefault()} // Prevent default drag behavior
                                onDrop={(event) => {
                                    event.preventDefault(); // Stop the default drop action
                                    const file = event.dataTransfer.files[0];
                                    handleFileUpload(file);
                                    setIsModalOpen(false);
                                }}
                            >
                                <div className="text-center">
                                    <span className="block text-3xl mb-4">📤</span>
                                    <p className="text-sm text-gray-500">Drag and drop your screenshot here</p>
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}

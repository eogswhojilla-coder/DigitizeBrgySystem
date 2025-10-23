import React, { useState } from "react";
import { Bell, Calendar, Send } from "lucide-react";
import Layout from "../layout";

function AnnouncementForm() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [date, setDate] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && message && date) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 3000);
        }
    };

    const handleReset = () => {
        setTitle("");
        setMessage("");
        setDate("");
        setSubmitted(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-lg px-8 py-8 text-center shadow-lg">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white bg-opacity-20 p-4 rounded-full">
                            <Bell className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Create Announcement
                    </h1>
                    <p className="text-blue-100">
                        Post important announcements for your community here.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-b-lg shadow-lg">
                    {/* Left Column - Form */}
                    <div className="p-8 border-r border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Field */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                    Announcement Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-800 text-lg"
                                    placeholder="Enter announcement title..."
                                    required
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-800 resize-none"
                                    rows="12"
                                    placeholder="Write your announcement message here..."
                                    required
                                />
                            </div>

                            {/* Date Field */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                    <Calendar className="inline w-4 h-4 mr-1 mb-1" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-800"
                                    required
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Publish
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition duration-200"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Success Message */}
                            {submitted && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                    <p className="text-green-700 font-medium">
                                        ✓ Announcement published successfully!
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="p-8 bg-gray-50">
                        <h3 className="text-gray-600 font-semibold mb-4 text-sm uppercase tracking-wide">
                            Live Preview
                        </h3>

                        {title || message || date ? (
                            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm min-h-[400px]">
                                {title && (
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                        {title}
                                    </h2>
                                )}
                                {date && (
                                    <div className="flex items-center gap-2 text-blue-600 mb-4">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">
                                            {new Date(date).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                )}
                                {message && (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 min-h-[400px] flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">
                                        Start typing to see preview...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Layout>
            <AnnouncementForm />
        </Layout>
    );
}

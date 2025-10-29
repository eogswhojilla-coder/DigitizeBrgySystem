import { Badge, Modal } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Bell, Calendar, Clock } from "lucide-react";

export default function ViewDaySection({ data = [] }) {
    const [open, setOpen] = useState(false);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <>
            <button
                className="w-full h-full text-left focus:outline-none hover:bg-blue-50 p-1 rounded transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                }}
            >
                <ul className="m-0 p-0 list-none">
                    {data.map((item, index) => (
                        <li key={index} className="text-xs">
                            <Badge 
                                status="success" 
                                text={
                                    <span className="text-blue-600 font-medium">
                                        {item.content || item.name}
                                    </span>
                                } 
                            />
                        </li>
                    ))}
                </ul>
            </button>

            <Modal
                open={open}
                title={
                    <div className="flex items-center gap-2 text-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <span>Announcements for This Day</span>
                    </div>
                }
                footer={null}
                onCancel={() => setOpen(false)}
                width={800}
            >
                <div className="space-y-4 max-h-[600px] overflow-y-auto p-2">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="border-2 border-blue-200 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Bell className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-xl mb-1">
                                        {item.name || item.content || "Untitled Announcement"}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>Posted {moment(item.created_at).fromNow()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                        <span className="font-semibold text-green-800 text-sm">Start Date & Time</span>
                                    </div>
                                    <div className="font-bold text-green-900">
                                        {moment(item.start || item.start_at).format("MMMM DD, YYYY")}
                                    </div>
                                    <div className="text-sm text-green-700 flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {moment(item.start || item.start_at).format("hh:mm A")}
                                    </div>
                                </div>
                                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-red-600" />
                                        <span className="font-semibold text-red-800 text-sm">End Date & Time</span>
                                    </div>
                                    <div className="font-bold text-red-900">
                                        {moment(item.end || item.end_at).format("MMMM DD, YYYY")}
                                    </div>
                                    <div className="text-sm text-red-700 flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {moment(item.end || item.end_at).format("hh:mm A")}
                                    </div>
                                </div>
                            </div>

                            {item.description && (
                                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                    <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-blue-600 rounded"></span>
                                        Description
                                    </div>
                                    <div
                                        className="text-gray-700 text-sm prose max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: item.description,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
}
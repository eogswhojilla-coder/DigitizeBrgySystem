import { Badge, Modal } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";

export default function ViewDaySection({ data = [] }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (data.length > 0) {
            console.log("ViewDaySection received data:", data);
        }
    }, [data]);

    // Don't render if no data
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <>
            <button
                className="w-full h-full text-left focus:outline-none hover:bg-gray-50 p-1 rounded"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                }}
            >
                <ul className="m-0 p-0 list-none">
                    {data.map((item, index) => (
                        <li key={index} className="text-xs">
                            <Badge status={item.type || "success"} text={item.content || item.name} />
                        </li>
                    ))}
                </ul>
            </button>

            <Modal
                open={open}
                title="🗓 View Day Events"
                footer={null}
                onCancel={() => setOpen(false)}
                width={700}
            >
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <h4 className="font-semibold text-gray-800 mb-2 text-lg">
                                {item.name || item.content || "Untitled Event"}
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="text-sm text-gray-600 bg-white p-2 rounded">
                                    <div className="font-medium text-green-600 mb-1">📅 Start:</div>
                                    <div className="font-semibold">
                                        {moment(item.start || item.start_at).format("MMMM DD, YYYY")}
                                    </div>
                                    <div className="text-gray-500">
                                        {moment(item.start || item.start_at).format("hh:mm A")}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 bg-white p-2 rounded">
                                    <div className="font-medium text-red-600 mb-1">📅 End:</div>
                                    <div className="font-semibold">
                                        {moment(item.end || item.end_at).format("MMMM DD, YYYY")}
                                    </div>
                                    <div className="text-gray-500">
                                        {moment(item.end || item.end_at).format("hh:mm A")}
                                    </div>
                                </div>
                            </div>
                            {item.description && (
                                <div className="bg-white p-3 rounded mt-3">
                                    <div className="font-medium text-gray-700 mb-2">Description:</div>
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

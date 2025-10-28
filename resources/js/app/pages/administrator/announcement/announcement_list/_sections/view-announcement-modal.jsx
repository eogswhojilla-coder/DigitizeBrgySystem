import React from 'react';
import Modal from '@/app/_components/modal';
import dayjs from 'dayjs';
import { Calendar, Clock, Tag } from 'lucide-react';

export default function ViewAnnouncementModal({ isOpen, onClose, announcement }) {
    if (!announcement) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Announcement Details"
            width="w-4/5 max-w-3xl"
        >
            <div className="space-y-6">
                {/* Title */}
                <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase">Title</label>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">{announcement.name}</h2>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            announcement.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {announcement.status?.toUpperCase()}
                    </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                            <Calendar className="w-5 h-5" />
                            <span className="font-semibold">Start Date</span>
                        </div>
                        <p className="text-gray-800">
                            {dayjs(announcement.start_at).format('MMMM DD, YYYY')}
                        </p>
                        <p className="text-sm text-gray-600">
                            {dayjs(announcement.start_at).format('hh:mm A')}
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                            <Calendar className="w-5 h-5" />
                            <span className="font-semibold">End Date</span>
                        </div>
                        <p className="text-gray-800">
                            {dayjs(announcement.end_at).format('MMMM DD, YYYY')}
                        </p>
                        <p className="text-sm text-gray-600">
                            {dayjs(announcement.end_at).format('hh:mm A')}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase block mb-2">
                        Description
                    </label>
                    <div
                        className="prose max-w-none bg-gray-50 p-4 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: announcement.description }}
                    />
                </div>

                {/* Images */}
                {announcement.files && announcement.files.length > 0 && (
                    <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase block mb-2">
                            Attachments ({announcement.files.length})
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {announcement.files.map((file, index) => (
                                <img
                                    key={index}
                                    src={file.files}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Created Date */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                            Created on{' '}
                            {dayjs(announcement.created_at).format('MMMM DD, YYYY hh:mm A')}
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
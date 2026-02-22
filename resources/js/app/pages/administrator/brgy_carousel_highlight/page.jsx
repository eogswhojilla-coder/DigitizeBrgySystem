import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Layout from '../layout';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline';

export default function BarangayHighlightsIndex({ highlights }) {
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = (id) => {
        router.delete(route('admin.highlights.destroy', id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedHighlight(null);
            },
        });
    };

    const handleToggleActive = (id) => {
        router.post(route('admin.highlights.toggle-active', id));
    };

    return (
        <Layout>
            <div className="p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Barangay Highlights
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage carousel highlights shown on the homepage
                            </p>
                        </div>
                        <Link
                            href={route('admin.highlights.create')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Highlight
                        </Link>
                    </div>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {highlights && highlights.length > 0 ? (
                        highlights.map((highlight) => (
                            <div
                                key={highlight.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {highlight.image ? (
                                        <img
                                            src={highlight.image}
                                            alt={highlight.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <PhotoIcon className="w-16 h-16 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                highlight.is_active
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {highlight.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Order Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                                            #{highlight.order}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                            {highlight.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {highlight.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {highlight.description}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="px-4 pb-4 flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleToggleActive(highlight.id)
                                        }
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        {highlight.is_active ? (
                                            <EyeSlashIcon className="w-4 h-4" />
                                        ) : (
                                            <EyeIcon className="w-4 h-4" />
                                        )}
                                        <span className="text-sm">
                                            {highlight.is_active
                                                ? 'Hide'
                                                : 'Show'}
                                        </span>
                                    </button>
                                    <Link
                                        href={route(
                                            'admin.highlights.edit',
                                            highlight.id,
                                        )}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        <span className="text-sm">Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedHighlight(highlight);
                                            setShowDeleteModal(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span className="text-sm">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                No highlights yet
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Create your first barangay highlight to display
                                on the homepage carousel
                            </p>
                            <Link
                                href={route('admin.highlights.create')}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add First Highlight
                            </Link>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedHighlight && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Confirm Delete
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "
                                {selectedHighlight.title}"? This action cannot
                                be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedHighlight(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() =>
                                        handleDelete(selectedHighlight.id)
                                    }
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

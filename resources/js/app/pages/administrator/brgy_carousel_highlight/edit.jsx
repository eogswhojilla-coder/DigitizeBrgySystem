import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import Layout from '../layout';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function EditHighlight({ highlight }) {
    const { data, setData, post, processing, errors } = useForm({
        title: highlight.title || '',
        description: highlight.description || '',
        category: highlight.category || '',
        image: null,
        order: highlight.order || 0,
        is_active: highlight.is_active ?? true,
        _method: 'PUT',
    });

    const [imagePreview, setImagePreview] = useState(highlight.image || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.highlights.update', highlight.id));
    };

    const categories = [
        'Infrastructure',
        'Community',
        'Technology',
        'Healthcare',
        'Education',
        'Environment',
        'Safety',
        'Culture',
    ];

    return (
        <Layout>
            <div className="p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.highlights.index')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Edit Highlight
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Update highlight information
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Form Fields */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Modern Barangay Hall"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter a brief description..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Order and Active Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) =>
                                                setData(
                                                    'order',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Lower numbers appear first
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="flex items-center mt-3">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) =>
                                                    setData(
                                                        'is_active',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">
                                                Active (show on homepage)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Image Upload */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Highlight Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg mb-2"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setData('image', null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-8">
                                                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Click to upload image
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                        >
                                            {imagePreview
                                                ? 'Change Image'
                                                : 'Choose Image'}
                                        </label>
                                    </div>
                                    {errors.image && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                                        💡 Tips
                                    </h4>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>
                                            • Use high-quality images (min
                                            1200x600px)
                                        </li>
                                        <li>
                                            • Keep file size under 5MB for fast
                                            loading
                                        </li>
                                        <li>
                                            • Use landscape orientation for best
                                            results
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3 justify-end border-t pt-6">
                            <Link
                                href={route('admin.highlights.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing
                                    ? 'Updating...'
                                    : 'Update Highlight'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

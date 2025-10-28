import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '@/app/_components/table';
import Modal from '@/app/_components/modal';
import dayjs from 'dayjs';
import SwalAlert from '@/app/_components/swal';
import { delete_announcement_service, update_announcement_service } from '@/app/services/accouncement-service';
import { get_announcement_thunk } from '@/app/redux/announcement-thunk';
import { Eye, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/app/_components/input';
import Wysiwyg from '@/app/_components/wysiwyg';
import Button from '@/app/_components/button';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function AnnouncementTableSection() {
    const dispatch = useDispatch();
    const { announcements } = useSelector((state) => state.announcements || {});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    // Extract data array from pagination object
    const announcementData = announcements?.data || [];

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm();

    const handleDelete = async (id, name) => {
        const result = await SwalAlert({
            type: 'warning',
            title: 'Delete Announcement',
            text: `Are you sure you want to delete "${name}"?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await delete_announcement_service(id);
                await SwalAlert({
                    type: 'success',
                    title: 'Deleted!',
                    text: 'Announcement has been deleted.',
                });
                dispatch(get_announcement_thunk());
            } catch (error) {
                await SwalAlert({
                    type: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message || 'Failed to delete announcement',
                });
            }
        }
    };

    const handleEdit = (announcement) => {
        setSelectedAnnouncement(announcement);
        setValue('title', announcement.name);
        setValue('description', announcement.description);
        setValue('status', announcement.status);
        setValue('date_range', [
            dayjs(announcement.start_at),
            dayjs(announcement.end_at),
        ]);
        setEditModalOpen(true);
    };

    const handleView = (announcement) => {
        setSelectedAnnouncement(announcement);
        setViewModalOpen(true);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        const start_at = data.date_range[0].format('YYYY-MM-DD HH:mm:ss');
        const end_at = data.date_range[1].format('YYYY-MM-DD HH:mm:ss');

        formData.append('id', selectedAnnouncement.id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('start_at', start_at);
        formData.append('end_at', end_at);
        formData.append('status', data.status || 'active');
        formData.append('_method', 'PUT');

        try {
            await update_announcement_service(formData);
            await SwalAlert({
                type: 'success',
                title: 'Updated!',
                text: 'Announcement updated successfully',
            });
            dispatch(get_announcement_thunk());
            setEditModalOpen(false);
            reset();
        } catch (error) {
            await SwalAlert({
                type: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to update announcement',
            });
        }
    };

    const columns = [
        { header: '#', accessor: 'index' },
        { header: 'Title', accessor: 'title' },
        { header: 'Description', accessor: 'description' },
        { header: 'Start Date', accessor: 'start_date' },
        { header: 'End Date', accessor: 'end_date' },
        { header: 'Status', accessor: 'status' },
        { header: 'Actions', accessor: 'actions' },
    ];

    const tableData = announcementData.map((announcement, index) => ({
        index: index + 1,
        title: (
            <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-800">{announcement.name}</span>
            </div>
        ),
        description: (
            <div 
                className="max-w-xs truncate text-gray-600"
                dangerouslySetInnerHTML={{ 
                    __html: announcement.description?.replace(/<[^>]*>/g, '').substring(0, 60) + '...' 
                }}
            />
        ),
        start_date: (
            <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-green-600" />
                <span>{dayjs(announcement.start_at).format('MMM DD, YYYY')}</span>
            </div>
        ),
        end_date: (
            <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-red-600" />
                <span>{dayjs(announcement.end_at).format('MMM DD, YYYY')}</span>
            </div>
        ),
        status: (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    announcement.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : announcement.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                }`}
            >
                {announcement.status?.toUpperCase()}
            </span>
        ),
        actions: (
            <div className="flex gap-2">
                <button
                    onClick={() => handleView(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleDelete(announcement.id, announcement.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
    }));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {announcementData.length > 0 ? (
                <Table columns={columns} data={tableData} />
            ) : (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No announcements found</p>
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Announcement"
                width="w-4/5 max-w-4xl"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                        label="Title"
                        type="text"
                        name="title"
                        error={errors?.title?.message}
                        register={register('title', { required: 'Title is required' })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date Range
                        </label>
                        <Controller
                            name="date_range"
                            control={control}
                            rules={{ required: 'Date range is required' }}
                            render={({ field }) => (
                                <RangePicker
                                    {...field}
                                    className="w-full"
                                    size="large"
                                    showTime={{ format: 'hh:mm A', use12Hours: true }}
                                    format="MM-DD-YYYY hh:mm A"
                                />
                            )}
                        />
                        {errors?.date_range && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.date_range.message}
                            </div>
                        )}
                    </div>

                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                            <Wysiwyg
                                name="description"
                                label="Description"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors?.description?.message}
                            />
                        )}
                    />

                    <div className="flex gap-2 justify-end mt-4">
                        <Button type="button" onClick={() => setEditModalOpen(false)} className="bg-gray-500">
                            Cancel
                        </Button>
                        <Button type="submit" loading={isSubmitting}>
                            Update Announcement
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                title="Announcement Details"
                width="w-4/5 max-w-3xl"
            >
                {selectedAnnouncement && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-500 uppercase">Title</label>
                            <h2 className="text-2xl font-bold text-gray-800 mt-1">{selectedAnnouncement.name}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-green-700 mb-2">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-semibold">Start Date</span>
                                </div>
                                <p className="text-gray-800">
                                    {dayjs(selectedAnnouncement.start_at).format('MMMM DD, YYYY hh:mm A')}
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700 mb-2">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-semibold">End Date</span>
                                </div>
                                <p className="text-gray-800">
                                    {dayjs(selectedAnnouncement.end_at).format('MMMM DD, YYYY hh:mm A')}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-500 uppercase block mb-2">
                                Description
                            </label>
                            <div 
                                className="prose max-w-none bg-gray-50 p-4 rounded-lg"
                                dangerouslySetInnerHTML={{ __html: selectedAnnouncement.description }} 
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
import React, { useEffect } from 'react';
import Modal from '@/app/_components/modal';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/app/_components/input';
import Wysiwyg from '@/app/_components/wysiwyg';
import Button from '@/app/_components/button';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { update_announcement_service } from '@/app/services/accouncement-service';
import SwalAlert from '@/app/_components/swal';

const { RangePicker } = DatePicker;

export default function EditAnnouncementModal({ isOpen, onClose, announcement, onSuccess }) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm();

    useEffect(() => {
        if (announcement) {
            setValue('title', announcement.name);
            setValue('description', announcement.description);
            setValue('status', announcement.status);
            setValue('date_range', [
                dayjs(announcement.start_at),
                dayjs(announcement.end_at),
            ]);
        }
    }, [announcement, setValue]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        const start_at = data.date_range[0].format('YYYY-MM-DD HH:mm:ss');
        const end_at = data.date_range[1].format('YYYY-MM-DD HH:mm:ss');

        formData.append('id', announcement.id);
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
            onSuccess();
            onClose();
            reset();
        } catch (error) {
            await SwalAlert({
                type: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to update announcement',
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                    <Button type="button" onClick={onClose} className="bg-gray-500">
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        Update Announcement
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
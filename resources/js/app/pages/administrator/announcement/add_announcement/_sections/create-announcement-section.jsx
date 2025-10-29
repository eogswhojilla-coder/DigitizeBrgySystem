import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import Input from "@/app/_components/input";
import Wysiwyg from "@/app/_components/wysiwyg";
import { DatePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button as ButtonAntD } from "antd";
import { create_announcement_service } from "@/app/services/accouncement-service";
import SwalAlert from "@/app/_components/swal";
import { useDispatch } from "react-redux";
import { get_announcement_thunk } from "@/app/redux/announcement-thunk";

const { RangePicker } = DatePicker;

export default function CreateAnnouncementSection() {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            files: [],
            date_range: [dayjs(), dayjs()],
        },
    });

    async function submit_data(params) {
        const formData = new FormData();
        const start_at = params.date_range[0].format("YYYY-MM-DD HH:mm:ss");
        const end_at = params.date_range[1].format("YYYY-MM-DD HH:mm:ss");

        formData.append("title", params.title ?? "");
        formData.append("description", params.description ?? "");
        formData.append("start_at", start_at);
        formData.append("end_at", end_at);

        // Append files if any
        if (params.files?.length) {
            params.files.forEach((file, index) => {
                formData.append(`files[${index}]`, file.originFileObj);
            });
        }

        try {
            await create_announcement_service(formData);
            await SwalAlert({
                type: "success",
                title: "Success!",
                text: "Announcement created successfully",
            });

            // Refresh announcements list
            dispatch(get_announcement_thunk());

            setIsOpen(false);
            reset();
        } catch (error) {
            await SwalAlert({
                type: "error",
                title: "Error",
                text:
                    error?.response?.data?.message ||
                    error.message ||
                    "Failed to create announcement",
            });
        }
    }

    const onOk = (value) => {
        console.log("onOk: ", value);
    };

    return (
        <div>
            <Button className="my-4" onClick={() => setIsOpen(!isOpen)}>
                Create Announcement
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create Announcement"
                width="max-w-4xl"
            >
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(submit_data)}
                >
                    <div className="flex flex-row gap-4">
                        <div className="flex-col gap-3 flex flex-1 mt-8">
                            <Input
                                label="Announcement Title"
                                type="text"
                                name="title"
                                error={errors?.title?.message}
                                register={register("title", {
                                    required: "Title is required",
                                })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Range
                                </label>
                                <Controller
                                    name="date_range"
                                    control={control}
                                    rules={{
                                        required: "Date range is required",
                                    }}
                                    render={({ field }) => (
                                        <RangePicker
                                            {...field}
                                            value={field.value}
                                            onChange={(value) =>
                                                field.onChange(value)
                                            }
                                            className="w-full border-gray-500"
                                            size="large"
                                            showTime={{
                                                format: "hh:mm A",
                                                use12Hours: true,
                                            }}
                                            format="MM-DD-YYYY hh:mm A"
                                            disabledDate={(current) =>
                                                current &&
                                                current < dayjs().startOf("day")
                                            }
                                            onOk={onOk}
                                        />
                                    )}
                                />
                                {errors?.date_range && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.date_range.message}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Images
                                </label>
                                <Controller
                                    name="files"
                                    control={control}
                                    render={({ field }) => (
                                        <Upload
                                            listType="picture"
                                            beforeUpload={() => false}
                                            onChange={({ fileList }) =>
                                                field.onChange(fileList)
                                            }
                                            fileList={field.value}
                                            multiple
                                        >
                                            <ButtonAntD
                                                type="primary"
                                                icon={<UploadOutlined />}
                                            >
                                                Upload Images
                                            </ButtonAntD>
                                        </Upload>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "Description is required" }}
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
                        </div>
                    </div>

                    <Button loading={isSubmitting} type="submit">
                        CREATE ANNOUNCEMENT
                    </Button>
                </form>
            </Modal>
        </div>
    );
}

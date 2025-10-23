import React, { useState } from "react";
import axios from "axios";
import { DatePicker, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";

import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import Input from "@/app/_components/input";
import Wysiwyg from "@/app/_components/wysiwyg";
import moment from "moment";
import { useSelector } from "react-redux";
import { department_slug } from "@/app/lib/search-lib";
import store from "@/app/store/store";
import {
    create_accounts_thunk,
    get_account_by_department_thunk,
} from "@/app/redux/account-thunk";
import SwalAlert from "@/app/_components/swal";
import { create_accounts_service } from "@/app/services/accounts-service";

const { Dragger } = Upload;
const { RangePicker } = DatePicker;

export default function CreateUserSection() {
    const [open, setOpen] = useState(false);
    const { categories } = useSelector((store) => store.categories);
    const { sites } = useSelector((store) => store.sites);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            department: department_slug(),
        },
    });
    async function submit_data(data) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });

        try {
            const res = await create_accounts_service(formData);
            await store.dispatch(
                get_account_by_department_thunk({
                    department: department_slug(),
                })
            );
            await SwalAlert({
                type: "success",
            });
            reset();
            setOpen(false);
        } catch (err) {
            await SwalAlert({
                type: "error",
                title: err.response.data.message,
            });
        }
    }
    console.log("sites", sites);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Create Account</Button>
            <Modal
                width="max-w-lg"
                isOpen={open}
                onClose={setOpen}
                title={`Create ${department_slug()} Account`}
            >
                <form
                    onSubmit={handleSubmit(submit_data)}
                    className="flex flex-col gap-4"
                >
                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-4">
                            <Input
                                label="Department"
                                type="text"
                                name="station"
                                disabled
                                value={department_slug()}
                            />

                            <Select
                                label="Location"
                                name="location"
                                options={[
                                    {
                                        label: "San Carlos",
                                        value: "San Carlos",
                                    },
                                    {
                                        label: "Carcar",
                                        value: "Carcar",
                                    },
                                ]}
                                error={errors?.location?.message}
                                register={register("location", {
                                    required: "This field is required",
                                })}
                            />

                            <Input
                                label="Fullname"
                                type="text"
                                name="name"
                                error={errors?.name?.message}
                                register={register("name", {
                                    required: "This field is required",
                                })}
                            />
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                error={errors?.email?.message}
                                register={register("email", {
                                    required: "This field is required",
                                })}
                            />

                            <Input
                                label="Position"
                                type="text"
                                name="position"
                                error={errors?.position?.message}
                                register={register("position", {
                                    required: "This field is required",
                                })}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        SUBMIT
                    </Button>
                </form>
            </Modal>
        </>
    );
}

import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import Modal from '@/app/_components/modal';
import Select from '@/app/_components/select';
import Input from '@/app/_components/input';
import Button from '@/app/_components/button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { get_barangay_residents_thunk } from '@/app/redux/barangay-resident-thunk';

export default function AssignPositionSection({ isOpen, onClose, resident }) {
    const [positions, setPositions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Fetch positions when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPositions();
        }
    }, [isOpen]);

    const fetchPositions = async () => {
        try {
            const response = await axios.get('/api/positions');
            setPositions(response.data.data || []);
        } catch (error) {
            console.error('Error fetching positions:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load positions',
            });
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await axios.put(`/api/barangay_residents/${resident.id}/assign-position`, {
                position: data.position,
                startDate: data.startDate,
                endDate: data.endDate,
                isOfficial: true,
            });

            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Position assigned successfully. The resident is now an official.',
                confirmButtonColor: '#3b82f6',
            });

            reset();
            onClose(false);
            dispatch(get_barangay_residents_thunk());
        } catch (error) {
            console.error('Error assigning position:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to assign position',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!resident) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="max-w-2xl">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Assign Position</h2>
                        <p className="text-sm text-gray-600">
                            Assign an official position to {resident.firstName} {resident.lastName}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Resident Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Full Name</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {resident.firstName} {resident.middleName} {resident.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Resident ID</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    RN-{resident.residentId || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Position Selection */}
                    <div className="space-y-4">
                        <Select
                            register={register('position', {
                                required: 'Position is required',
                            })}
                            name="position"
                            label="Select Position"
                            error={errors?.position?.message}
                            options={[
                                { value: '', label: 'Select a position' },
                                ...(positions || []).map((position) => ({
                                    value: position.position,
                                    label: position.position,
                                })),
                            ]}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                register={register('startDate', {
                                    required: 'Start date is required',
                                })}
                                error={errors?.startDate?.message}
                                label="Start Date"
                                type="date"
                                name="startDate"
                            />
                            <Input
                                register={register('endDate', {
                                    required: 'End date is required',
                                })}
                                error={errors?.endDate?.message}
                                label="End Date"
                                type="date"
                                name="endDate"
                            />
                        </div>
                    </div>

                    {/* Info Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Once a position is assigned, this resident will be 
                            automatically classified as an official and will appear in the "List of Officials" module.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                reset();
                                onClose(false);
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="success"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Assigning...' : 'Assign Position'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

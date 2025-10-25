import React from 'react';
import Layout from '../../layout';
import CertificateTypeSection from './sections/certificate-type-section';
import CertificateRequestSection from './sections/certificate-request-section';
import { Tab } from '@headlessui/react';

export default function Page() {
    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Certificate Management
                </h1>

                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        <Tab className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                             ${selected 
                                ? 'bg-white text-blue-700 shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                             }`
                        }>
                            Certificate Types
                        </Tab>
                        <Tab className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                             ${selected 
                                ? 'bg-white text-blue-700 shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                             }`
                        }>
                            Certificate Requests
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        <Tab.Panel className="rounded-xl bg-white p-3">
                            <CertificateTypeSection />
                        </Tab.Panel>
                        <Tab.Panel className="rounded-xl bg-white p-3">
                            <CertificateRequestSection />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </Layout>
    );
}

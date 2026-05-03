import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header="Access Control">
            <Head title="Access Control" />

            <div className="p-4 bg-[#c0c0c0] min-h-full">
                <div className="max-w-xl border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] p-4 bg-[#c0c0c0]">
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#808080]">
                        <img src="https://win98icons.alexmeub.com/icons/png/keys-0.png" alt="Key" className="w-8 h-8" style={{ imageRendering: 'pixelated' }} />
                        <div>
                            <h2 className="text-black font-bold text-lg" style={{ fontFamily: 'Tahoma, sans-serif' }}>Security Settings</h2>
                            <p className="text-black text-xs">Change your administrator password here.</p>
                        </div>
                    </div>

                    <UpdatePasswordForm className="w-full" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ projectsCount, messagesCount }) {
    return (
        <AuthenticatedLayout header="Dashboard Overview">
            <Head title="Dashboard" />

            <div className="flex gap-4 p-4">
                {/* Projects Stat */}
                <div className="flex-1 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] p-6 flex flex-col items-center shadow-[1px_1px_0_#000]">
                    <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" alt="Projects" className="w-16 h-16 mb-4" style={{ imageRendering: 'pixelated' }} />
                    <h3 className="text-lg text-black font-bold">Total Projects</h3>
                    <p className="text-5xl text-[#000080] font-bold mt-2">{projectsCount}</p>
                    <Link href={route('projects.index')} className="mt-6 px-6 py-2 w-full text-center bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] text-black font-bold active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000]">Manage Projects</Link>
                </div>

                {/* Messages Stat */}
                <div className="flex-1 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] p-6 flex flex-col items-center shadow-[1px_1px_0_#000]">
                    <img src="https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png" alt="Messages" className="w-16 h-16 mb-4" style={{ imageRendering: 'pixelated' }} />
                    <h3 className="text-lg text-black font-bold">Inbox Messages</h3>
                    <p className="text-5xl text-[#000080] font-bold mt-2">{messagesCount}</p>
                    <Link href={route('messages.index')} className="mt-6 px-6 py-2 w-full text-center bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] text-black font-bold active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000]">View Messages</Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

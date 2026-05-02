import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, Trash2, Mail, MailOpen } from 'lucide-react';

export default function Index({ messages }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this message?')) {
            destroy(route('messages.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Messages">
            <Head title="Messages" />

            {/* Toolbar Area */}
            <div className="flex gap-2 mb-4">
                {/* Reserved for future toolbar buttons if needed */}
            </div>

            {/* Retro Table Wrapper */}
            <div className="bg-white border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white shadow-[-1px_-1px_0_#000_inset] overflow-x-auto">
                <table className="w-full text-left text-sm text-black border-collapse">
                    <thead className="bg-[#c0c0c0]">
                        <tr>
                            <th className="px-2 py-1 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] font-normal text-black text-center shadow-[1px_1px_0_#000] w-12">Status</th>
                            <th className="px-2 py-1 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] font-normal text-black shadow-[1px_1px_0_#000]">Sender</th>
                            <th className="px-2 py-1 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] font-normal text-black shadow-[1px_1px_0_#000] hidden md:table-cell">Message Preview</th>
                            <th className="px-2 py-1 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] font-normal text-black shadow-[1px_1px_0_#000]">Date</th>
                            <th className="px-2 py-1 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] font-normal text-black text-right shadow-[1px_1px_0_#000]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-2 py-4 text-center text-black bg-white">
                                    No messages found.
                                </td>
                            </tr>
                        ) : (
                            messages.map((message) => (
                                <tr key={message.id} className="hover:bg-[#000080] hover:text-white group bg-white text-black">
                                    <td className="px-2 py-1 border-r border-b border-[#c0c0c0] text-center">
                                        {!message.is_read ? (
                                            <Mail className="w-4 h-4 mx-auto group-hover:text-white text-[#000080]" />
                                        ) : (
                                            <MailOpen className="w-4 h-4 mx-auto group-hover:text-white text-[#808080]" />
                                        )}
                                    </td>
                                    <td className="px-2 py-1 border-r border-b border-[#c0c0c0]">
                                        <div>{message.name}</div>
                                        <div className="text-xs group-hover:text-gray-300 text-gray-600 font-normal">{message.email}</div>
                                    </td>
                                    <td className="px-2 py-1 border-r border-b border-[#c0c0c0] hidden md:table-cell">
                                        <div className="truncate max-w-md">{message.message}</div>
                                    </td>
                                    <td className="px-2 py-1 border-r border-b border-[#c0c0c0] text-xs">
                                        {new Date(message.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-1 border-b border-[#c0c0c0] text-right">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={route('messages.show', message.id)}
                                                className="bg-[#c0c0c0] text-black px-2 py-0.5 inline-flex items-center gap-1 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000] text-xs"
                                                title="View Message"
                                            >
                                                <Eye className="w-3 h-3" /> View
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(message.id)}
                                                className="bg-[#c0c0c0] text-black px-2 py-0.5 inline-flex items-center gap-1 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000] text-xs outline-none focus:border-dotted focus:border-black"
                                                title="Delete Message"
                                            >
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}

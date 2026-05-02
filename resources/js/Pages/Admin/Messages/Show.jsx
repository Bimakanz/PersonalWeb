import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ message }) {
    const { delete: destroy } = useForm();
    const { data, setData, post, processing, reset } = useForm({
        admin_reply: message.admin_reply || ''
    });

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this message?')) {
            destroy(route('messages.destroy', message.id));
        }
    };

    return (
        <AuthenticatedLayout windowTitle={`Message - ${message.name}`}>
            <Head title={`Message - ${message.name}`} />

            <div className="p-4 bg-[#c0c0c0] text-black font-sans min-h-full" style={{ fontFamily: 'Tahoma, "MS Sans Serif", sans-serif' }}>
                <div className="flex gap-2 mb-4 pb-2 border-b-2 border-b-white border-t-2 border-t-transparent shadow-[0_1px_0_#808080_inset]">
                    <Link 
                        href={route('messages.index')}
                        className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white font-bold text-sm outline-none"
                    >
                        Back
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white font-bold text-sm flex gap-1 items-center outline-none ml-auto"
                    >
                        <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png" className="w-4 h-4" alt="delete" style={{ imageRendering: 'pixelated' }} />
                        Delete
                    </button>
                </div>

                <div className="flex gap-4">
                    <img src="https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png" className="w-12 h-12" alt="message" style={{ imageRendering: 'pixelated' }} />
                    <div className="flex-1">
                        <fieldset className="border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-4 mb-4 shadow-[1px_1px_0_#000]">
                            <legend className="px-1 font-bold">Message Details</legend>

                            <div className="grid grid-cols-[100px_1fr] gap-2 items-center mb-2">
                                <label className="text-sm">From:</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={message.name} 
                                    className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#e0e0e0] px-2 py-0.5 text-sm w-full outline-none shadow-[1px_1px_0_#000_inset]"
                                />
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-2 items-center mb-2">
                                <label className="text-sm">Email:</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={message.email} 
                                        className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#e0e0e0] px-2 py-0.5 text-sm w-full outline-none shadow-[1px_1px_0_#000_inset]"
                                    />
                                    <a 
                                        href={`mailto:${message.email}`}
                                        className="px-3 py-0.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white font-bold text-sm shrink-0 outline-none flex items-center shadow-[1px_1px_0_#000]"
                                    >
                                        Reply
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-2 items-center mb-4">
                                <label className="text-sm">Date:</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={new Date(message.created_at).toLocaleString()} 
                                    className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#e0e0e0] px-2 py-0.5 text-sm w-full outline-none shadow-[1px_1px_0_#000_inset]"
                                />
                            </div>

                            <div className="flex flex-col gap-1 mb-4">
                                <label className="text-sm">Message:</label>
                                <textarea 
                                    readOnly
                                    value={message.message}
                                    className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white px-2 py-1 text-sm w-full outline-none min-h-[150px] resize-none shadow-[1px_1px_0_#000_inset]"
                                />
                            </div>

                            <div className="border-t-2 border-t-[#808080] border-b-2 border-b-white my-4"></div>

                            <form onSubmit={(e) => { e.preventDefault(); post(route('messages.reply', message.id)); }}>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-[#000080]">Admin Reply:</label>
                                    <textarea 
                                        value={data.admin_reply}
                                        onChange={e => setData('admin_reply', e.target.value)}
                                        placeholder="Write your reply here..."
                                        className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white px-2 py-1 text-sm w-full outline-none min-h-[100px] resize-none shadow-[1px_1px_0_#000_inset]"
                                    />
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-6 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white font-bold text-sm outline-none shadow-[1px_1px_0_#000] disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Reply'}
                                    </button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

const Win98Btn = ({ children, onClick, disabled, type = 'button', className = '' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] text-sm font-bold active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white outline-none disabled:opacity-50 ${className}`}
    >
        {children}
    </button>
);

const Win98Input = ({ className = '', ...props }) => (
    <input
        {...props}
        className={`border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white px-2 py-1 text-sm outline-none ${className}`}
    />
);

const Label = ({ children }) => <label className="text-xs font-bold">{children}</label>;

function detectVideoType(src) {
    if (!src) return 'none';
    if (src.match(/youtube\.com|youtu\.be/)) return 'youtube';
    if (src.match(/tiktok\.com/)) return 'tiktok';
    return 'direct';
}

export default function VideosIndex({ videos }) {
    const fileRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [showLibrary, setShowLibrary] = useState(false);
    const [detailVideo, setDetailVideo] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '', url: '', file: null, sort_order: 0,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setData('file', file); setFileName(file.name); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.videos.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setFileName(''); },
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this video?')) return;
        router.delete(route('admin.videos.destroy', id));
        if (detailVideo?.id === id) setDetailVideo(null);
    };

    const getYouTubeEmbed = (src) => {
        const m = src?.match(/(?:watch\?v=|youtu\.be\/)([^&\s?]+)/);
        return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=0` : null;
    };

    const renderPreview = (v) => {
        const type = detectVideoType(v.src);
        if (type === 'youtube') {
            const url = getYouTubeEmbed(v.src);
            return url ? <iframe src={url} className="w-full h-48 border-0 bg-black" allowFullScreen /> : null;
        }
        if (type === 'direct') {
            return <video src={v.src} controls className="w-full max-h-48 bg-black" />;
        }
        return <div className="w-full h-24 bg-[#808080] flex items-center justify-center text-sm text-gray-700">TikTok — preview not available</div>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Videos" />
            <div className="p-6 max-w-5xl mx-auto flex flex-col gap-4" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Win98Btn onClick={() => setShowLibrary(v => !v)}>
                        {showLibrary ? '▲ Hide Library' : '▼ View Library'} ({videos.length})
                    </Win98Btn>
                </div>

                {/* Add Form */}
                <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
                    <div className="bg-[#000080] text-white text-sm font-bold px-2 py-1">➕ Add New Video</div>
                    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                                <Label>Title *</Label>
                                <Win98Input type="text" placeholder="Video title" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full" />
                                {errors.title && <p className="text-red-700 text-xs">{errors.title}</p>}
                            </div>
                            <div className="flex flex-col gap-1 w-20">
                                <Label>Order</Label>
                                <Win98Input type="number" value={data.sort_order} onChange={e => setData('sort_order', e.target.value)} className="w-full" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>URL <span className="font-normal text-gray-600">(YouTube / TikTok / direct .mp4)</span></Label>
                            <Win98Input type="text" placeholder="https://youtube.com/watch?v=... or direct .mp4 URL" value={data.url} onChange={e => setData('url', e.target.value)} className="w-full" />
                            {errors.url && <p className="text-red-700 text-xs">{errors.url}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 border-t border-[#808080]" />
                            <span className="text-xs text-gray-600">OR upload file</span>
                            <div className="flex-1 border-t border-[#808080]" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Video File <span className="font-normal text-gray-600">(mp4 / webm — max 100MB)</span></Label>
                            <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFileChange} className="hidden" />
                            <div className="flex gap-2 items-center">
                                <Win98Btn onClick={() => fileRef.current?.click()}>Browse...</Win98Btn>
                                <span className="text-xs text-gray-700 truncate">{fileName || 'No file selected'}</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <Win98Btn type="submit" disabled={processing}>{processing ? 'Uploading...' : '✓ Add Video'}</Win98Btn>
                        </div>
                    </form>
                </div>

                {/* Library */}
                {showLibrary && (
                    <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
                        <div className="bg-[#000080] text-white text-sm font-bold px-2 py-1">📼 Video Library ({videos.length})</div>
                        <div className="flex" style={{ minHeight: 300 }}>
                            {/* List */}
                            <div className="w-72 border-r-2 border-r-[#808080] overflow-auto bg-white">
                                {videos.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic p-4">No videos yet.</p>
                                ) : videos.map(v => (
                                    <div
                                        key={v.id}
                                        onClick={() => setDetailVideo(v)}
                                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-b border-[#e0e0e0] ${detailVideo?.id === v.id ? 'bg-[#000080] text-white' : 'hover:bg-[#e8e8f8] text-black'}`}
                                    >
                                        <span className="text-xl shrink-0">🎬</span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold truncate">{v.title}</p>
                                            <p className={`text-xs truncate ${detailVideo?.id === v.id ? 'text-blue-200' : 'text-gray-500'}`}>{v.src}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Detail */}
                            <div className="flex-1 p-4 bg-[#c0c0c0] flex flex-col gap-3">
                                {detailVideo ? (
                                    <>
                                        <h3 className="font-bold text-base">{detailVideo.title}</h3>
                                        {renderPreview(detailVideo)}
                                        <fieldset className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-2 pt-0 relative">
                                            <legend className="px-1 text-xs absolute -top-2 left-2 bg-[#c0c0c0]">Source</legend>
                                            <p className="text-xs break-all text-gray-700 mt-1">{detailVideo.src}</p>
                                        </fieldset>
                                        <div className="flex justify-end">
                                            <Win98Btn onClick={() => handleDelete(detailVideo.id)}>🗑 Delete</Win98Btn>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                                        Select a video from the list
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

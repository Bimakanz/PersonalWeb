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

export default function WallpapersIndex({ folders }) {
    const imageRef = useRef(null);
    const [imageFileName, setImageFileName] = useState('');
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState({});

    const folderForm = useForm({ name: '' });
    const wallpaperForm = useForm({ wallpaper_folder_id: '', name: '', image: null });

    const handleFolderSubmit = (e) => {
        e.preventDefault();
        folderForm.post(route('admin.wallpapers.storeFolder'), { onSuccess: () => folderForm.reset() });
    };

    const handleWallpaperSubmit = (e) => {
        e.preventDefault();
        wallpaperForm.post(route('admin.wallpapers.storeWallpaper'), {
            forceFormData: true,
            onSuccess: () => { wallpaperForm.reset(); setImageFileName(''); },
        });
    };

    const toggleFolder = (id) => setExpandedFolders(p => ({ ...p, [id]: !p[id] }));

    return (
        <AuthenticatedLayout>
            <Head title="Wallpapers" />
            <div className="p-6 max-w-5xl mx-auto flex flex-col gap-4" style={{ fontFamily: 'Tahoma, sans-serif' }}>

                <div className="flex gap-4 items-start">
                    {/* Left: forms */}
                    <div className="flex flex-col gap-4 w-72 shrink-0">
                        {/* Create Folder */}
                        <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
                            <div className="bg-[#000080] text-white text-sm font-bold px-2 py-1">📁 New Folder</div>
                            <form onSubmit={handleFolderSubmit} className="p-4 flex flex-col gap-2">
                                <Label>Folder Name *</Label>
                                <Win98Input type="text" value={folderForm.data.name} onChange={e => folderForm.setData('name', e.target.value)} className="w-full" />
                                {folderForm.errors.name && <p className="text-red-700 text-xs">{folderForm.errors.name}</p>}
                                <div className="flex justify-end">
                                    <Win98Btn type="submit" disabled={folderForm.processing}>Create Folder</Win98Btn>
                                </div>
                            </form>
                        </div>

                        {/* Upload Wallpaper */}
                        <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
                            <div className="bg-[#000080] text-white text-sm font-bold px-2 py-1"> Upload Wallpaper</div>
                            <form onSubmit={handleWallpaperSubmit} className="p-4 flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <Label>Folder *</Label>
                                    <select
                                        value={wallpaperForm.data.wallpaper_folder_id}
                                        onChange={e => wallpaperForm.setData('wallpaper_folder_id', e.target.value)}
                                        className="border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white px-2 py-1 text-sm outline-none w-full"
                                    >
                                        <option value="">— Select Folder —</option>
                                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                    {wallpaperForm.errors.wallpaper_folder_id && <p className="text-red-700 text-xs">{wallpaperForm.errors.wallpaper_folder_id}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Wallpaper Name *</Label>
                                    <Win98Input type="text" value={wallpaperForm.data.name} onChange={e => wallpaperForm.setData('name', e.target.value)} className="w-full" />
                                    {wallpaperForm.errors.name && <p className="text-red-700 text-xs">{wallpaperForm.errors.name}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Image File *</Label>
                                    <input ref={imageRef} type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) { wallpaperForm.setData('image', file); setImageFileName(file.name); }
                                    }} />
                                    <div className="flex gap-2 items-center">
                                        <Win98Btn type="button" onClick={() => imageRef.current?.click()}>Browse...</Win98Btn>
                                        <span className="text-xs text-gray-700 truncate max-w-[140px]">{imageFileName || 'No file selected'}</span>
                                    </div>
                                    {wallpaperForm.errors.image && <p className="text-red-700 text-xs">{wallpaperForm.errors.image}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <Win98Btn type="submit" disabled={wallpaperForm.processing}>
                                        {wallpaperForm.processing ? 'Uploading...' : '↑ Upload'}
                                    </Win98Btn>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Explorer + Preview */}
                    <div className="flex-1 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] flex flex-col" style={{ minHeight: 400 }}>
                        <div className="bg-[#000080] text-white text-sm font-bold px-2 py-1 shrink-0">🗂️ Wallpaper Explorer</div>
                        <div className="flex flex-1 overflow-hidden">
                            {/* Tree panel — light gray matching Win98 */}
                            <div className="w-52 border-r-2 border-r-[#808080] overflow-auto bg-white p-2 font-mono text-xs">
                                <p className="text-gray-500 mb-1 text-[10px]">📁 My Computer / Images / background</p>
                                {folders.length === 0 ? (
                                    <p className="text-gray-400 italic pl-2">No folders</p>
                                ) : folders.map(folder => (
                                    <div key={folder.id}>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer text-gray-900 hover:bg-[#000080] hover:text-white px-1 py-0.5 rounded group"
                                            onClick={() => toggleFolder(folder.id)}
                                        >
                                            <span className="text-[10px] text-gray-500 group-hover:text-gray-200">{expandedFolders[folder.id] ? '▾' : '▸'}</span>
                                            <span>📁</span>
                                            <span className="flex-1 truncate">{folder.name}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); if (confirm('Delete folder?')) router.delete(route('admin.wallpapers.destroyFolder', folder.id)); }}
                                                className="text-red-600 hover:text-red-800 text-[10px] px-0.5 invisible group-hover:visible"
                                            >✕</button>
                                        </div>
                                        {expandedFolders[folder.id] && folder.wallpapers.map(wp => (
                                            <div
                                                key={wp.id}
                                                className={`ml-4 flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded group ${selectedWallpaper?.id === wp.id ? 'bg-[#000080] text-white' : 'text-gray-800 hover:bg-[#000080] hover:text-white'}`}
                                                onClick={() => setSelectedWallpaper(wp)}
                                            >
                                                <span>🖼</span>
                                                <span className="flex-1 truncate">{wp.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Delete wallpaper?')) {
                                                            router.delete(route('admin.wallpapers.destroyWallpaper', wp.id));
                                                            if (selectedWallpaper?.id === wp.id) setSelectedWallpaper(null);
                                                        }
                                                    }}
                                                    className="text-red-500 hover:text-red-300 text-[10px] invisible group-hover:visible"
                                                >✕</button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Preview panel */}
                            <div className="flex-1 flex flex-col bg-[#c0c0c0]">
                                <div className="px-2 py-1 border-b border-[#808080] flex items-center gap-2 text-sm bg-[#c0c0c0]">
                                    <span className="font-bold">Picture:</span>
                                    <div className="border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white px-2 py-0.5 text-xs flex-1 flex items-center justify-between">
                                        <span>{selectedWallpaper?.name ?? 'Select an image'}</span>
                                        <span className="text-gray-400">▼</span>
                                    </div>
                                </div>
                                <div className="flex-1 m-2 border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white flex items-center justify-center overflow-hidden">
                                    {selectedWallpaper ? (
                                        selectedWallpaper.image_url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                                            <video
                                                key={selectedWallpaper.id}
                                                src={selectedWallpaper.image_url}
                                                className="w-full h-full object-contain bg-black"
                                                autoPlay loop muted playsInline controls
                                            />
                                        ) : (
                                            <img
                                                key={selectedWallpaper.id}
                                                src={selectedWallpaper.image_url}
                                                alt={selectedWallpaper.name}
                                                className="w-full h-full object-contain"
                                            />
                                        )
                                    ) : (
                                        <p className="text-gray-400 text-xs italic">Select a file from the tree</p>
                                    )}
                                </div>
                                <p className="text-gray-500 text-[10px] px-3 pb-2">no credit link</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

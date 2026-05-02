import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

const Win98Btn = ({ children, onClick, disabled, type = 'button', danger = false }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] text-sm font-bold active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white outline-none disabled:opacity-50 ${danger ? 'text-red-800' : 'text-black'}`}
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

const Win98Textarea = ({ className = '', ...props }) => (
    <textarea
        {...props}
        className={`border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white px-2 py-1 text-sm outline-none resize-vertical ${className}`}
    />
);

const Win98Select = ({ className = '', children, ...props }) => (
    <select
        {...props}
        className={`border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white px-2 py-1 text-sm outline-none ${className}`}
    >
        {children}
    </select>
);

const Label = ({ children }) => <label className="text-xs font-bold">{children}</label>;

const STATUS_LABELS = {
    watched:   { label: '✓ Watched',   color: 'text-green-800', bg: 'bg-green-100' },
    watchlist: { label: '⏳ Watchlist', color: 'text-yellow-800',bg: 'bg-yellow-100'},
};

function ImageUploadField({ label, fieldKey, preview, onFile, onUrl, urlValue, size = 'h-24' }) {
    const ref = useRef(null);
    const [mode, setMode] = useState(urlValue ? 'url' : 'file');

    const handleUrlChange = (val) => {
        onUrl(fieldKey, val);
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <div className="flex gap-1">
                    <button type="button" onClick={() => setMode('file')}
                        className={`text-xs px-2 py-0.5 border outline-none ${
                            mode === 'file'
                                ? 'bg-[#000080] text-white border-[#000080]'
                                : 'bg-[#c0c0c0] text-black border-[#808080] hover:bg-[#d0d0d0]'
                        }`}>Upload</button>
                    <button type="button" onClick={() => setMode('url')}
                        className={`text-xs px-2 py-0.5 border outline-none ${
                            mode === 'url'
                                ? 'bg-[#000080] text-white border-[#000080]'
                                : 'bg-[#c0c0c0] text-black border-[#808080] hover:bg-[#d0d0d0]'
                        }`}>URL</button>
                </div>
            </div>

            {/* Preview */}
            <div className={`w-full ${size} border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-[#808080] flex items-center justify-center overflow-hidden`}>
                {preview
                    ? <img src={preview} alt={label} className="w-full h-full object-cover"
                        onError={e => { e.target.style.display='none'; }}
                      />
                    : <span className="text-xs text-gray-300 italic">No image</span>
                }
            </div>

            {mode === 'file' ? (
                <>
                    <input ref={ref} type="file" accept="image/*" onChange={e => onFile(fieldKey, e.target.files[0])} className="hidden" />
                    <div className="flex items-center gap-2 mt-1">
                        <Win98Btn onClick={() => ref.current?.click()}>Browse...</Win98Btn>
                        <span className="text-xs text-gray-600 truncate">{preview && !urlValue ? '(file selected)' : 'No file chosen'}</span>
                    </div>
                </>
            ) : (
                <div className="mt-1">
                    <Win98Input
                        type="text"
                        className="w-full text-xs"
                        placeholder="Paste image URL (e.g. https://i.pinimg.com/...)"
                        value={urlValue}
                        onChange={e => handleUrlChange(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}

function ShowForm({ show = null, onCancel }) {
    const isEdit = !!show;
    const [form, setForm] = useState({
        title:       show?.title       ?? '',
        description: show?.description ?? '',
        status:      show?.status      ?? 'watched',
    });
    const [files, setFiles] = useState({});
    const [urlInputs, setUrlInputs] = useState({
        main_image: show?.main_image?.startsWith('http') ? show.main_image : '',
        poster_1:   show?.poster_1?.startsWith('http')   ? show.poster_1   : '',
        poster_2:   show?.poster_2?.startsWith('http')   ? show.poster_2   : '',
        poster_3:   show?.poster_3?.startsWith('http')   ? show.poster_3   : '',
    });
    const [previews, setPreviews] = useState({
        main_image: show?.main_image ?? null,
        poster_1:   show?.poster_1   ?? null,
        poster_2:   show?.poster_2   ?? null,
        poster_3:   show?.poster_3   ?? null,
    });
    const [processing, setProcessing] = useState(false);

    const handleFile = (field, file) => {
        if (!file) return;
        setFiles(f => ({ ...f, [field]: file }));
        setUrlInputs(u => ({ ...u, [field]: '' })); // clear URL if file chosen
        setPreviews(p => ({ ...p, [field]: URL.createObjectURL(file) }));
    };

    const handleUrl = (field, val) => {
        setUrlInputs(u => ({ ...u, [field]: val }));
        setFiles(f => { const n = { ...f }; delete n[field]; return n; }); // clear file if URL typed
        setPreviews(p => ({ ...p, [field]: val || null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
        // Files take priority over URLs
        Object.entries(files).forEach(([k, v]) => fd.append(k, v));
        // Send URL values for fields that don't have a file
        Object.entries(urlInputs).forEach(([k, v]) => {
            if (v && !files[k]) fd.append(`${k}_url`, v);
        });

        const url = isEdit
            ? route('admin.shows.update', show.id)
            : route('admin.shows.store');

        router.post(url, fd, {
            forceFormData: true,
            onSuccess: () => { setProcessing(false); onCancel?.(); },
            onError:   () => setProcessing(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            {/* Title + Status */}
            <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                    <Label>Title *</Label>
                    <Win98Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full" placeholder="Show title..." />
                </div>
                <div className="flex flex-col gap-1 w-36">
                    <Label>Status *</Label>
                    <Win98Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="watching">Watching</option>
                        <option value="watched">Watched</option>
                        <option value="watchlist">Watchlist</option>
                    </Win98Select>
                </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <Label>Description</Label>
                <Win98Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full" placeholder="Short description..." />
            </div>

            {/* Main image */}
            <ImageUploadField label="Main Image (Banner)" fieldKey="main_image"
                preview={previews.main_image} onFile={handleFile}
                onUrl={handleUrl} urlValue={urlInputs.main_image} size="h-32" />

            {/* 3 Posters */}
            <div>
                <Label>Posters (3 small)</Label>
                <div className="flex gap-3 mt-1">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="flex-1">
                            <ImageUploadField label={`Poster ${n}`} fieldKey={`poster_${n}`}
                                preview={previews[`poster_${n}`]} onFile={handleFile}
                                onUrl={handleUrl} urlValue={urlInputs[`poster_${n}`]} size="h-24" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 justify-end">
                {onCancel && <Win98Btn onClick={onCancel}>Cancel</Win98Btn>}
                <Win98Btn type="submit" disabled={processing}>
                    {processing ? 'Saving...' : (isEdit ? '✓ Update Show' : '✓ Add Show')}
                </Win98Btn>
            </div>
        </form>
    );
}

export default function ShowsIndex({ shows = [] }) {
    const [tab, setTab] = useState('watched');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editShow, setEditShow] = useState(null);

    const TABS = ['watched', 'watchlist'];
    const filtered = shows.filter(s => s.status === tab);

    const handleDelete = (show) => {
        if (!confirm(`Delete "${show.title}"?`)) return;
        router.delete(route('admin.shows.destroy', show.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Shows" />
            <div className="p-4 flex flex-col gap-4" style={{ fontFamily: 'Tahoma, sans-serif' }}>

                {/* Header + Add button */}
                <div className="flex items-center justify-between">
                    <Win98Btn onClick={() => { setShowAddForm(v => !v); setEditShow(null); }}>
                        {showAddForm ? '✕ Cancel' : '＋ Add New Show'}
                    </Win98Btn>
                </div>

                {/* Add Form Panel */}
                {showAddForm && (
                    <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
                        <div className="bg-[#000080] text-white text-sm font-bold px-2 py-1">➕ Add New Show</div>
                        <div className="p-4">
                            <ShowForm onCancel={() => setShowAddForm(false)} />
                        </div>
                    </div>
                )}

                {/* Edit Form Panel */}
                {editShow && (
                    <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
                        <div className="bg-[#000080] text-white text-sm font-bold px-2 py-1">✏ Editing: {editShow.title}</div>
                        <div className="p-4">
                            <ShowForm show={editShow} onCancel={() => setEditShow(null)} />
                        </div>
                    </div>
                )}

                {/* Shows list with tabs */}
                <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080]">
                    {/* Tabs */}
                    <div className="flex border-b-2 border-b-[#808080]">
                        {TABS.map(t => {
                            const st = STATUS_LABELS[t];
                            const active = tab === t;
                            const count = shows.filter(s => s.status === t).length;
                            return (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`px-4 py-1 text-sm font-bold border-r border-r-[#808080] outline-none
                                        ${active
                                            ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white -mb-0.5 z-10'
                                            : 'bg-[#a0a0a0] text-gray-700 hover:bg-[#b0b0b0]'
                                        }`}
                                >
                                    {st.label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* List content */}
                    <div className="p-3 flex flex-col gap-2">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-gray-600 italic text-center py-6">
                                No shows in {STATUS_LABELS[tab].label} yet.
                            </p>
                        ) : filtered.map(show => (
                            <div key={show.id} className="flex gap-3 border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white p-2">
                                {/* Main image */}
                                <div className="w-24 h-20 bg-[#808080] shrink-0 overflow-hidden border border-[#808080]">
                                    {show.main_image
                                        ? <img src={show.main_image} alt={show.title} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                    }
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm">{show.title}</span>
                                        <span className={`text-xs px-1 border ${STATUS_LABELS[show.status].color} ${STATUS_LABELS[show.status].bg}`}>
                                            {STATUS_LABELS[show.status].label}
                                        </span>
                                    </div>
                                    {show.description && (
                                        <p className="text-xs text-gray-600 mb-1 line-clamp-2">{show.description}</p>
                                    )}
                                    {/* Mini posters */}
                                    <div className="flex gap-1 mb-2">
                                        {[show.poster_1, show.poster_2, show.poster_3].filter(Boolean).map((p, i) => (
                                            <img key={i} src={p} alt="" className="w-8 h-11 object-cover border border-[#808080]" />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Win98Btn onClick={() => { setEditShow(show); setShowAddForm(false); }}>✏ Edit</Win98Btn>
                                        <Win98Btn onClick={() => handleDelete(show)} danger>🗑 Delete</Win98Btn>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

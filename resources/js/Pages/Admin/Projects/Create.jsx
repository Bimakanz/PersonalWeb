import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        tags: '',
        github_link: '',
        preview_link: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout header="Add New Project">
            <Head title="Add Project" />

            {/* Toolbar Area */}
            <div className="flex gap-2 mb-4">
                <Link
                    href={route('projects.index')}
                    className="bg-[#c0c0c0] text-black px-4 py-1 flex items-center gap-2 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000] text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </Link>
            </div>

            {/* Form Wrapper - Tab-like or Settings Panel style */}
            <div className="bg-[#c0c0c0] p-4 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] shadow-[1px_1px_0_#000]">
                <form onSubmit={submit} className="space-y-4">
                    
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full bg-white text-black border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white px-2 py-1 outline-none focus:bg-[#000080] focus:text-white shadow-[-1px_-1px_0_#000_inset]"
                            required
                        />
                        {errors.title && <div className="text-red-600 font-bold text-xs mt-1">{errors.title}</div>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows="4"
                            className="w-full bg-white text-black border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white px-2 py-1 outline-none focus:bg-[#000080] focus:text-white shadow-[-1px_-1px_0_#000_inset] resize-none"
                            required
                        ></textarea>
                        {errors.description && <div className="text-red-600 font-bold text-xs mt-1">{errors.description}</div>}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={data.tags}
                            onChange={e => setData('tags', e.target.value)}
                            placeholder="React, Laravel, Tailwind"
                            className="w-full bg-white text-black border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white px-2 py-1 outline-none focus:bg-[#000080] focus:text-white shadow-[-1px_-1px_0_#000_inset] placeholder:text-gray-400"
                        />
                        {errors.tags && <div className="text-red-600 font-bold text-xs mt-1">{errors.tags}</div>}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-black mb-1">GitHub Link</label>
                            <input
                                type="url"
                                value={data.github_link}
                                onChange={e => setData('github_link', e.target.value)}
                                className="w-full bg-white text-black border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white px-2 py-1 outline-none focus:bg-[#000080] focus:text-white shadow-[-1px_-1px_0_#000_inset]"
                            />
                            {errors.github_link && <div className="text-red-600 font-bold text-xs mt-1">{errors.github_link}</div>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-black mb-1">Preview Link</label>
                            <input
                                type="url"
                                value={data.preview_link}
                                onChange={e => setData('preview_link', e.target.value)}
                                className="w-full bg-white text-black border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white px-2 py-1 outline-none focus:bg-[#000080] focus:text-white shadow-[-1px_-1px_0_#000_inset]"
                            />
                            {errors.preview_link && <div className="text-red-600 font-bold text-xs mt-1">{errors.preview_link}</div>}
                        </div>
                    </div>

                    {/* File Input */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Project Image (HD Thumbnail)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                id="file-input"
                                onChange={e => setData('image', e.target.files[0])}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('file-input').click()}
                                className="bg-[#c0c0c0] text-black px-4 py-1 flex items-center gap-2 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000] text-sm"
                            >
                                Browse...
                            </button>
                            <span className="text-sm text-black bg-white px-2 py-1 border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white shadow-[-1px_-1px_0_#000_inset] flex-1 truncate">
                                {data.image ? data.image.name : 'No file chosen.'}
                            </span>
                        </div>
                        {errors.image && <div className="text-red-600 font-bold text-xs mt-1">{errors.image}</div>}
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-t-[#808080] border-b-2 border-b-white my-4"></div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2">
                        <Link
                            href={route('projects.index')}
                            className="bg-[#c0c0c0] text-black px-6 py-1 flex items-center gap-2 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000] text-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#c0c0c0] text-black font-bold px-6 py-1 flex items-center gap-2 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-black border-b-black shadow-[1px_1px_0_#000] active:border-t-black active:border-l-black active:border-r-white active:border-b-white active:shadow-none text-sm outline-none focus:border-dotted focus:border-black"
                        >
                            <Save className="w-4 h-4" /> {processing ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

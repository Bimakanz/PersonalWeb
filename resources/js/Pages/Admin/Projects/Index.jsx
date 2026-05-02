import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Index({ projects, auth }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            destroy(route('projects.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manage Projects">
            <Head title="Projects" />

            {/* Toolbar */}
            <div className="flex gap-2 mb-4">
                <Link
                    href={route('projects.create')}
                    className="bg-[#c0c0c0] text-black px-4 py-1 flex items-center gap-2 border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none shadow-[1px_1px_0_#000] text-sm"
                >
                    <Plus className="w-4 h-4" /> Add New Project
                </Link>
            </div>

            {/* Retro Table Wrapper */}
            <div className="bg-white border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white overflow-x-auto shadow-[-1px_-1px_0_#000_inset]">
                <table className="w-full text-left text-sm text-black font-sans border-collapse">
                    <thead className="bg-[#c0c0c0]">
                        <tr>
                            <th className="px-4 py-2 border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] font-bold">Project Name</th>
                            <th className="px-4 py-2 border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] font-bold">Tags</th>
                            <th className="px-4 py-2 border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-8 text-center text-gray-600 bg-white border border-gray-300">
                                    No projects found.
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id} className="hover:bg-[#000080] hover:text-white group">
                                    <td className="px-4 py-2 flex items-center gap-4 border-b border-gray-300 border-r">
                                        {project.image ? (
                                            <img src={`/storage/${project.image}`} className="w-12 h-12 object-cover border border-[#808080]" alt="thumbnail" />
                                        ) : (
                                            <div className="w-12 h-12 bg-[#c0c0c0] border border-[#808080] flex items-center justify-center text-[10px] text-black">No Img</div>
                                        )}
                                        <div>
                                            <div className="font-bold group-hover:text-white">{project.title}</div>
                                            <div className="text-xs text-gray-600 group-hover:text-gray-300 truncate max-w-[200px]">{project.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-300 border-r">
                                        {project.tags && project.tags.split(',').map(tag => (
                                            <span key={tag} className="inline-block px-1 mr-1 text-xs border border-[#808080] bg-[#c0c0c0] text-black">{tag.trim()}</span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center align-middle">
                                        <div className="flex items-center justify-center gap-1">
                                            <Link
                                                href={route('projects.edit', project.id)}
                                                className="w-7 h-7 flex items-center justify-center bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white group-hover:text-black"
                                                title="Edit"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="w-7 h-7 flex items-center justify-center bg-[#c0c0c0] text-black border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white group-hover:text-black"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
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

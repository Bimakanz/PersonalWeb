import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    
    const [time, setTime] = useState(new Date());
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    
    // Window state
    const [isClosed, setIsClosed] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    
    // Dragging state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Reset window state when navigating to a new page
    useEffect(() => {
        setIsClosed(false);
        setIsMinimized(false);
        setPosition({ x: 0, y: 0 });
    }, [url]);

    const handlePointerDown = (e) => {
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        }
    };

    const handlePointerUp = (e) => {
        if (isDragging) {
            setIsDragging(false);
            e.target.releasePointerCapture(e.pointerId);
        }
    };

    // Extract text from header if possible, otherwise fallback
    let windowTitle = 'Videos';
    if (header && header.props && header.props.children) {
        windowTitle = header.props.children;
    } else if (typeof header === 'string') {
        windowTitle = header;
    }

    return (
        <div
            className="min-h-screen bg-[#008080] font-sans select-none overflow-hidden flex flex-col"
            style={{
                fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
                backgroundImage: "url('https://i.pinimg.com/originals/78/b5/cc/78b5cc349c51859e0d5174ab5ce37c7a.gif')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
            }}
        >
            {/* Start Menu Overlay */}
            {isStartMenuOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsStartMenuOpen(false)}
                ></div>
            )}

            {/* Desktop Area */}
            <div className="flex-1 p-4 relative h-[calc(100vh-2rem)] overflow-hidden">
                {/* Desktop Icons */}
                <div className="absolute top-4 left-4 flex flex-col gap-6 w-24 z-0">
                    <Link href={route('dashboard')} className="flex flex-col items-center gap-1 group">
                        <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" alt="Dashboard" className="w-10 h-10 group-hover:brightness-110 group-active:brightness-75 drop-shadow-md" style={{ imageRendering: 'pixelated' }} />
                        <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Dashboard</span>
                    </Link>
                    <Link href={route('projects.index')} className="flex flex-col items-center gap-1 group">
                        <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" alt="Projects" className="w-10 h-10 group-hover:brightness-110 group-active:brightness-75 drop-shadow-md" style={{ imageRendering: 'pixelated' }} />
                        <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Projects</span>
                    </Link>
                    <Link href={route('messages.index')} className="flex flex-col items-center gap-1 group">
                        <img src="https://win98icons.alexmeub.com/icons/png/envelope_closed-0.png" alt="Messages" className="w-10 h-10 group-hover:brightness-110 group-active:brightness-75 drop-shadow-md" style={{ imageRendering: 'pixelated' }} />
                        <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Messages</span>
                    </Link>
                    <Link href={route('admin.videos.index')} className="flex flex-col items-center gap-1 group">
                        <img src="https://win98icons.alexmeub.com/icons/png/cd_audio_cd_a-4.png" alt="Videos" className="w-10 h-10 group-hover:brightness-110 group-active:brightness-75 drop-shadow-md" style={{ imageRendering: 'pixelated' }} />
                        <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Videos</span>
                    </Link>
                    <Link href={route('admin.wallpapers.index')} className="flex flex-col items-center gap-1 group">
                        <img src="https://win98icons.alexmeub.com/icons/png/display_properties-0.png" alt="Wallpapers" className="w-10 h-10 group-hover:brightness-110 group-active:brightness-75 drop-shadow-md" style={{ imageRendering: 'pixelated' }} />
                        <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Wallpapers</span>
                    </Link>
                    <Link href={route('admin.shows.index')} className="flex flex-col items-center gap-1 group">
                        <img src="https://cdn-icons-png.flaticon.com/512/3418/3418886.png" alt="Shows" className="w-10 h-10 group-hover:brightness-110 group-active:brightness-75 drop-shadow-md" style={{ imageRendering: 'pixelated' }} />
                        <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Shows</span>
                    </Link>
                </div>

                {/* Main Content Area (Window Wrapper) */}
                {!isClosed && !isMinimized && (
                    <div 
                        className="absolute z-10 w-full max-w-6xl bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] shadow-[1px_1px_0_#000] flex flex-col max-h-[85vh]"
                        style={{ 
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            left: '50%',
                            top: '5%',
                            marginLeft: '-576px' // Half of max-w-6xl (1152px) to center it initially
                        }}
                    >
                        {/* Title Bar */}
                        <div 
                            className="bg-[#000080] flex justify-between items-center px-1 py-1 mx-0.5 mt-0.5 shrink-0 select-none cursor-default"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <div className="flex items-center gap-1 pointer-events-none">
                                <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" alt="icon" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                                <span className="text-white font-bold text-sm tracking-wide">{windowTitle}</span>
                            </div>
                            <div className="flex gap-0.5" onPointerDown={e => e.stopPropagation()}>
                                <button 
                                    onClick={() => setIsMinimized(true)}
                                    className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none pt-0.5 outline-none"
                                >
                                    _
                                </button>
                                <button 
                                    className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none pt-0.5 outline-none"
                                >
                                    □
                                </button>
                                <button 
                                    onClick={() => setIsClosed(true)}
                                    className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none pt-0.5 outline-none"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Menu Bar (File, Edit, View, Help) */}
                        <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] border-b border-[#808080] shrink-0 text-black">
                            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><span className="underline">F</span>ile</span>
                            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><span className="underline">E</span>dit</span>
                            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><span className="underline">V</span>iew</span>
                            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><span className="underline">H</span>elp</span>
                        </div>

                        {/* Window Content */}
                        <div className="p-4 overflow-auto flex-1 bg-white border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white m-1 shadow-[-1px_-1px_0_#000_inset] text-black">
                            {children}
                        </div>
                    </div>
                )}
            </div>

            {/* Taskbar */}
            <div className="h-8 bg-[#c0c0c0] border-t-2 border-t-white flex items-center justify-between px-1 shadow-[0_-1px_0_#000_inset] z-50 relative shrink-0">
                
                {/* Start Menu Popup */}
                {isStartMenuOpen && (
                    <div className="absolute bottom-8 left-0 w-56 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0_#000] flex p-0.5 z-50">
                        {/* Sidebar banner */}
                        <div className="w-8 bg-gradient-to-b from-[#000080] to-[#1084d0] relative overflow-hidden">
                            <span className="absolute bottom-2 left-1.5 text-white text-lg font-bold tracking-widest origin-bottom-left -rotate-90 whitespace-nowrap">
                                Windows <span className="font-normal text-[#c0c0c0]">98</span>
                            </span>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="flex-1 py-1">
                            <div className="px-3 py-2 mb-1 flex flex-col gap-0 border-b border-[#808080]">
                                <span className="text-xs text-gray-700">Logged in as:</span>
                                <span className="text-sm text-black font-bold truncate max-w-[150px]">Sxna</span>
                            </div>

                            <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-3 py-1.5 mt-1 hover:bg-[#000080] hover:text-white group text-black text-left focus:outline-none">
                                <img src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-0.png" alt="Shut Down" className="w-6 h-6" style={{ imageRendering: 'pixelated' }} />
                                <span className="text-sm group-hover:text-white">Shut Down...</span>
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex gap-1 h-full py-1">
                    <button 
                        onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                        className={`flex items-center gap-1 px-1.5 h-full bg-[#c0c0c0] border-2 font-bold text-black text-sm outline-none ${isStartMenuOpen ? 'border-t-[#808080] border-l-[#808080] border-r-white border-b-white shadow-none bg-[#dfdfdf]' : 'border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none'}`}
                    >
                        <img src="https://win98icons.alexmeub.com/icons/png/windows_slanted-1.png" alt="Start" className="w-4 h-4" />
                        Start
                    </button>
                    
                    <div className="h-full border-l-2 border-l-[#808080] border-r-2 border-r-white mx-1"></div>

                    {/* Active Program indicator in taskbar */}
                    {!isClosed && (
                        <button 
                            onClick={() => setIsMinimized(!isMinimized)}
                            className={`flex items-center gap-1 px-2 h-full bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-b-2 focus:outline-none ${isMinimized ? 'border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none' : 'border-t-[#808080] border-l-[#808080] border-r-white border-b-white shadow-[1px_1px_0_#000_inset]'}`}
                        >
                            <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" alt="Active" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                            <span className="font-bold text-black text-xs truncate max-w-[150px]">{windowTitle}</span>
                        </button>
                    )}
                </div>
                
                <div className="flex items-center gap-2 h-full py-1">
                    {/* Clock Tray */}
                    <div className="h-full px-2 flex items-center gap-1 bg-[#c0c0c0] border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white shadow-[1px_1px_0_#000_inset]">
                        <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png" alt="Sound" className="w-3 h-3" style={{ imageRendering: 'pixelated' }} />
                        <span className="text-black text-xs">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

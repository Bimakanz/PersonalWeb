import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BIOS_LINES = [
    'PhoenixBIOS 1.4 Release 6.0',
    'Copyright 1985-2001 Phoenix Technologies Ltd.',
    'All Rights Reserved',
    'Copyright 2001-2003 VMware, Inc.',
    'VMware BIOS build 314',
    '',
    'ATAPI CD-ROM: VMware Virtual IDECDROM Drive',
    'Initializing',
    'User: unknown',
    'IP: 180.267.41.676',
    'System: Windows 10',
    '',
    'Use the ↑(Up) and ↓(Down) key to move the pointer to desired boot device.',
    'Press (Enter) to attempt to boot',
];

const MENU_OPTIONS = [
    { label: 'Start Windows Normally', group: 'BOOT OPTIONS:' },
    { label: 'Install Windows', group: 'BOOT OPTIONS:' },
    { label: 'Onboard NIC (IPV4)', group: 'BOOT OPTIONS:' },
    { label: 'Onboard NIC (IPV6)', group: 'BOOT OPTIONS:' },
];

function BiosScreen({ onBoot }) {
    const [selected, setSelected] = useState(0);
    const [visibleLines, setVisibleLines] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < BIOS_LINES.length) {
                setVisibleLines((prev) => [...prev, BIOS_LINES[i]]);
                i++;
            } else {
                clearInterval(timer);
                setTimeout(() => setShowMenu(true), 600);
            }
        }, 40); // Kecepatan muncul teks BIOS
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!showMenu) return; // Hanya bisa ditekan kalau menu sudah muncul

        const handleKey = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelected((s) => Math.max(0, s - 1));
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelected((s) => Math.min(MENU_OPTIONS.length - 1, s + 1));
            }
            if (e.key === 'Enter') {
                if (selected === 0) onBoot();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selected, showMenu, onBoot]);

    return (
        <div className="h-screen bg-black text-white font-mono p-6 flex flex-col text-sm md:text-base overflow-hidden relative">
            {/* Top Right Exit Info */}
            <div className="hidden md:block absolute top-6 right-6 text-gray-500 text-xs italic tracking-wide animate-pulse">
                Fullscreen for best Performance
            </div>

            {/* Animated BIOS Lines */}
            <div className={showMenu ? "mb-6" : ""}>
                {visibleLines.map((line, i) => (
                    <div key={i} className="text-gray-300 leading-tight mb-1">
                        {line || '\u00A0'}
                    </div>
                ))}
                {!showMenu && <span className="animate-pulse text-white font-bold">_</span>}
            </div>

            {/* Menu Sections & ASCII ART (Hanya muncul jika showMenu true) */}
            {showMenu && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <div className="mb-6 space-y-6">
                        <div>
                            <div className="text-gray-300 mb-2">BOOT OPTIONS:</div>
                            <div className="pl-6 flex flex-col items-start space-y-1">
                                {MENU_OPTIONS.filter(o => o.group === 'BOOT OPTIONS:').map((opt, i) => {
                                    const globalIndex = MENU_OPTIONS.findIndex(x => x.label === opt.label);
                                    const isSelected = selected === globalIndex;
                                    return (
                                        <div
                                            key={opt.label}
                                            onClick={() => onBoot()}
                                            onTouchEnd={(e) => {
                                                e.preventDefault();
                                                onBoot();
                                            }}
                                            className={`inline-block cursor-pointer ${isSelected ? 'bg-gray-200 text-black' : 'text-gray-300'}`}
                                        >
                                            {opt.label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ASCII ART */}
                    <style>
                        {`
                        @keyframes rgb-shift {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        .rgb-text {
                            background: linear-gradient(270deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000);
                            background-size: 800% 800%;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            animation: rgb-shift 5s linear infinite;
                        }
                        `}
                    </style>
                    <div className="mt-8 md:mt-12 font-bold whitespace-pre rgb-text scale-[0.4] sm:scale-50 md:scale-100 origin-top-left -ml-2 md:ml-0 w-max max-w-none">
                        <pre>
                            {`
███████╗██╗  ██╗███╗   ██╗ █████╗ ██╗███████╗    ███████╗██████╗  █████╗  ██████╗███████╗
██╔════╝╚██╗██╔╝████╗  ██║██╔══██╗╚═╝██╔════╝    ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝
███████╗ ╚███╔╝ ██╔██╗ ██║███████║   ███████╗    ███████╗██████╔╝███████║██║     █████╗  
╚════██║ ██╔██╗ ██║╚██╗██║██╔══██║   ╚════██║    ╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝  
███████║██╔╝ ██╗██║ ╚████║██║  ██║   ███████║    ███████║██║     ██║  ██║╚██████╗███████╗
╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚══════╝    ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
`}
                        </pre>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function Window({ id, title, children, onClose, onMinimize, onFocus, minimized, zIndex, initialPos, darkTheme, isActive, height = 400, width = 450 }) {
    const [pos, setPos] = useState(initialPos || { x: 100, y: 80 });
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setPos({ x: 0, y: 0 });
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const onPointerDown = (e) => {
        if (isMobile) return;
        setDragging(true);
        setRel({ x: e.clientX - pos.x, y: e.clientY - pos.y });
        e.target.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        setPos({ x: e.clientX - rel.x, y: e.clientY - rel.y });
    };

    const onPointerUp = (e) => {
        setDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    // Note: Do not return null when minimized so that video/iframe doesn't stop playing

    const isActuallyDark = darkTheme || id === 'wallpaper_engine' || id === 'video_player';
    const titleBarClass = isActive ? "bg-black text-white" : "bg-[#808080] text-[#dfdfdf]";

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
                left: pos.x,
                top: pos.y,
                position: 'absolute',
                zIndex: zIndex || 50,
                width: isMobile ? '100%' : width,
                maxWidth: '100%',
                height: isMobile ? 'calc(100% - 40px)' : height,
                maxHeight: '100%',
                display: minimized ? 'none' : 'flex',
                flexDirection: 'column'
            }}
            onPointerDownCapture={onFocus}
            className={`border-2 shadow-[2px_2px_0_#000] select-none ${darkTheme ? 'border-gray-500 bg-[#333b3a]' : 'border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0]'}`}
        >
            {/* Title Bar */}
            <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className={`${titleBarClass} px-1 py-0.5 flex items-center justify-between cursor-default shrink-0 m-0.5`}
            >
                <div className="flex items-center gap-1 pointer-events-none">
                    {isActuallyDark ? (
                        <img src={id === 'video_player' ? 'https://xque.dev/disk.png' : id === 'wallpaper_engine' ? 'https://win98icons.alexmeub.com/icons/png/display_properties-0.png' : ''} className={`${id === 'video_player' ? 'w-5 h-5' : 'w-4 h-4'} ${id !== 'video_player' && id !== 'wallpaper_engine' ? 'hidden' : ''} object-contain`} alt="icon" style={{ imageRendering: 'pixelated' }} />
                    ) : (
                        <img src="https://win98icons.alexmeub.com/icons/png/notepad_file-0.png" className="w-4 h-4" alt="icon" style={{ imageRendering: 'pixelated' }} />
                    )}
                    <span className="text-sm font-bold tracking-wide" style={{ fontFamily: 'Tahoma, "MS Sans Serif", sans-serif' }}>{title}</span>
                </div>
                <div className="flex gap-0.5" onPointerDown={e => e.stopPropagation()}>
                    {isActuallyDark ? (
                        <>
                            <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] pb-1">?</button>
                            <button onClick={onMinimize} className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] pt-0.5">_</button>
                            <button onClick={onClose} className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] ml-1 pb-1">×</button>
                        </>
                    ) : (
                        <>
                            <button onClick={onMinimize} className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] pt-0.5">_</button>
                            <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] pt-0.5">□</button>
                            <button onClick={onClose} className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-r border-b border-r-[#808080] border-b-[#808080] flex items-center justify-center font-bold text-black text-xs shadow-[1px_1px_0_#000] pt-0.5">×</button>
                        </>
                    )}
                </div>
            </div>
            {/* Content */}
            <div className={`flex-1 overflow-hidden flex flex-col ${darkTheme ? 'bg-[#4a5553]' : 'bg-[#c0c0c0]'}`}>
                {children}
            </div>
        </motion.div>
    );
}

function ImageViewer({ src, onClose }) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleWheel = (e) => {
        setScale(s => Math.min(Math.max(0.2, s - e.deltaY * 0.005), 5));
    };

    const handlePointerDown = (e) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - pos.x, y: e.clientY - pos.y });
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        setPos({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#4a5553] z-30 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center bg-[#2b3331] p-1 border-b border-[#202020] z-40">
                <div className="flex gap-1">
                    <button onClick={() => setScale(s => s + 0.2)} className="w-6 h-6 flex items-center justify-center bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-xs font-bold shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white">+</button>
                    <button onClick={() => setScale(s => Math.max(0.2, s - 0.2))} className="w-6 h-6 flex items-center justify-center bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-xs font-bold shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white">-</button>
                    <button onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }} className="px-2 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-xs shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white">Reset</button>
                </div>
                <button onClick={onClose} className="px-2 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-xs font-bold shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white">Close</button>
            </div>
            <div
                className="flex-1 relative overflow-hidden bg-[#333b3a] cursor-move"
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <img
                    src={src}
                    alt="Preview"
                    className="absolute max-w-none pointer-events-none"
                    style={{
                        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`,
                        left: '50%',
                        top: '50%',
                        transformOrigin: 'center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                />
            </div>
        </motion.div>
    );
}

function NotepadContent({ projects = [] }) {
    const [tab, setTab] = useState('Home');
    const [selectedProject, setSelectedProject] = useState(null);
    const [fullScreenImage, setFullScreenImage] = useState(null);

    const tabs = ['Home', 'About', 'Projects'];

    return (
        <div className="flex flex-col h-full text-white p-2 text-sm bg-[#4a5553]">
            {/* Tabs Container */}
            <div className="flex items-end px-2 z-10 -mb-[2px] pt-1">
                {tabs.map((t, i) => (
                    <button
                        key={t}
                        onClick={() => { setTab(t); setSelectedProject(null); }}
                        className={`px-3 py-1 outline-none relative ${i > 0 ? '-ml-[2px]' : ''} ${tab === t
                                ? 'text-white border-t-2 border-l-2 border-r-2 border-t-white border-l-white border-r-[#202020] bg-[#4a5553] z-20 pb-[6px] -mt-1 shadow-[1px_0_0_#000]'
                                : 'text-gray-300 border-t-2 border-l-2 border-r-2 border-t-white border-l-white border-r-[#202020] bg-[#4a5553] z-0 pb-1 mt-1 hover:text-white shadow-[1px_0_0_#000]'
                            }`}
                    >
                        <span style={{ textShadow: '1px 1px 0px #000' }}>{t}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-[#202020] border-b-[#202020] z-10 bg-[#4a5553] overflow-auto shadow-[1px_1px_0_#000] relative" style={{ fontFamily: 'Tahoma, "MS Sans Serif", sans-serif' }}>

                {/* Project Detail Overlay */}
                <AnimatePresence>
                    {fullScreenImage && <ImageViewer key="viewer" src={fullScreenImage} onClose={() => setFullScreenImage(null)} />}
                </AnimatePresence>

                {selectedProject && (
                    <div className="absolute inset-0 bg-[#4a5553] z-20 p-4 flex flex-col gap-3 overflow-auto">
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="self-start px-2 py-0.5 text-xs bg-[#4a5553] border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-[#202020] border-b-[#202020] text-white outline-none active:border-t-[#202020] active:border-l-[#202020] active:border-r-white active:border-b-white"
                            style={{ textShadow: '1px 1px 0px #000' }}
                        >← Back</button>

                        <h2 className="text-lg font-bold" style={{ textShadow: '1px 1px 0px #000' }}>{selectedProject.title}</h2>

                        {selectedProject.image && (
                            <div
                                className="border-2 border-t-[#202020] border-l-[#202020] border-r-white border-b-white p-1 bg-black/20 w-full cursor-pointer hover:bg-black/40 transition-colors group relative"
                                onClick={() => setFullScreenImage(`/storage/${selectedProject.image}`)}
                            >
                                <img
                                    src={`/storage/${selectedProject.image}`}
                                    alt={selectedProject.title}
                                    className="w-full h-auto"
                                    onError={e => e.target.style.display = 'none'}
                                />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 pointer-events-none"></div>
                            </div>
                        )}

                        <p className="text-sm text-white leading-relaxed" style={{ textShadow: '1px 1px 0px #000' }}>
                            {selectedProject.description || 'No description provided.'}
                        </p>

                        {selectedProject.tags && (
                            <div className="flex flex-wrap gap-1">
                                {selectedProject.tags.split(',').map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-1.5 py-0.5 text-[10px] border border-white/30 text-gray-300"
                                        style={{ textShadow: '1px 1px 0px #000' }}
                                    >{tag.trim()}</span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 flex-wrap mt-1">
                            {selectedProject.github_link && (
                                <a
                                    href={selectedProject.github_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-0.5 text-xs bg-[#4a5553] border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-[#202020] border-b-[#202020] text-white outline-none"
                                    style={{ textShadow: '1px 1px 0px #000' }}
                                >GitHub →</a>
                            )}
                            {selectedProject.preview_link && (
                                <a
                                    href={selectedProject.preview_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-0.5 text-xs bg-[#4a5553] border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-[#202020] border-b-[#202020] text-white outline-none"
                                    style={{ textShadow: '1px 1px 0px #000' }}
                                >Preview →</a>
                            )}
                        </div>
                    </div>
                )}

                <div className="p-4">
                    {tab === 'Home' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-xl font-bold mb-3 tracking-wide" style={{ textShadow: '1px 1px 0px #000' }}>hi, I'm Sxna</h2>
                            <div className="w-32 h-32 border-2 border-t-[#202020] border-l-[#202020] border-r-white border-b-white p-1 bg-black/20 mb-3 shadow-[1px_1px_0_#000_inset]">
                                <img src="https://i.pinimg.com/originals/08/9f/0c/089f0c04efafb0c919fbdab7d52891bb.gif" alt="gif" className="w-full h-full object-cover" />
                            </div>
                            <p className="mb-4 text-white" style={{ textShadow: '1px 1px 0px #000' }}>A Student from PESAT Vocational highschool, and currently grade XI. <br /> And i am a fullstack developer?.. or maybe a frontend</p>

                            <fieldset className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-3 pt-1 relative mt-4 shadow-[1px_1px_0_#000]">
                                <legend className="px-1 text-xs text-white absolute -top-2 left-2 bg-[#4a5553]" style={{ textShadow: '1px 1px 0px #000' }}>Sena's Note</legend>
                                <p className="text-sm leading-relaxed text-white" style={{ textShadow: '1px 1px 0px #000', paddingTop: '10px' }}>
                                    this is an old windows aethsetic webpage I made to display some info about me. i also added some random tiktoks, music, anime, and games.<br /><br />
                                    if you're seeing this, this page is ongoing. <br /> Maybe im going to make this webpage better, but i think now is okay tho
                                </p>
                            </fieldset>
                        </motion.div>
                    )}

                    {tab === 'About' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-xl font-bold mb-3 tracking-wide" style={{ textShadow: '1px 1px 0px #000' }}>who is Sxna?</h2>
                            <p className="mb-3 text-white" style={{ textShadow: '1px 1px 0px #000' }}>just a random kid that don't feel like living anymore <br /> (istg im so cool and emo ngl)</p>
                            <div className="w-32 h-32 border-2 border-t-[#202020] border-l-[#202020] border-r-white border-b-white p-1 bg-black/20 mb-4 shadow-[1px_1px_0_#000_inset]">
                                <img src="https://i.pinimg.com/originals/45/ab/99/45ab9927564f81ae76917f5fe76cc66d.gif" alt="Rei" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-sm leading-relaxed text-white" style={{ textShadow: '1px 1px 0px #000' }}>
                                I hate bugs, I hate humans, I hate everything. <br /> istg im so edgy 💔
                            </p>
                        </motion.div>
                    )}

                    {tab === 'Projects' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                            {projects.length === 0 ? (
                                <p className="text-gray-400 italic text-sm" style={{ textShadow: '1px 1px 0px #000' }}>No projects yet.</p>
                            ) : (
                                projects.map((project, i) => (
                                    <div key={project.id}>
                                        <div className="flex items-start justify-between gap-2 py-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white text-sm" style={{ textShadow: '1px 1px 0px #000' }}>{project.title}</p>
                                                <p className="text-gray-300 text-xs mt-0.5 leading-relaxed" style={{ textShadow: '1px 1px 0px #000' }}>
                                                    {project.description?.length > 80 ? project.description.slice(0, 80) + '…' : project.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedProject(project)}
                                                className="shrink-0 px-3 py-0.5 text-xs bg-[#4a5553] border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-[#202020] border-b-[#202020] text-white outline-none active:border-t-[#202020] active:border-l-[#202020] active:border-r-white active:border-b-white"
                                                style={{ textShadow: '1px 1px 0px #000' }}
                                            >View</button>
                                        </div>
                                        {i < projects.length - 1 && (
                                            <div className="border-t border-t-[#202020] border-b border-b-white/10" />
                                        )}
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MessageBoardContent({ initialMessages = [] }) {
    const [name, setName] = useState('unknown');
    const [joined, setJoined] = useState(false);
    const [localMessages, setLocalMessages] = useState(initialMessages.map(m => ({
        id: m.id,
        sender: m.name,
        text: m.message,
        image: m.image_path ? (m.image_path.startsWith('http') ? m.image_path : `/storage/${m.image_path}`) : null,
        admin_reply: m.admin_reply
    })));
    const [imagePreview, setImagePreview] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [isLive, setIsLive] = useState(false);
    const fileInputRef = useRef(null);
    const endOfMessagesRef = useRef(null);
    const lastMessageIdRef = useRef(initialMessages.length > 0 ? Math.max(...initialMessages.map(m => m.id ?? 0)) : 0);
    const isAtBottomRef = useRef(true);
    const chatContainerRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        message: '',
        image: null,
    });

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
    };

    useEffect(() => {
        const scrollToBottom = () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };
        scrollToBottom();
        const timer = setTimeout(scrollToBottom, 50);
        const timer2 = setTimeout(scrollToBottom, 150);
        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);

    useEffect(() => {
        if (joined) {
            const scrollToBottom = () => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            };
            scrollToBottom();
            const timer = setTimeout(scrollToBottom, 100);
            return () => clearTimeout(timer);
        }
    }, [joined]);

    useEffect(() => {
        if (!joined) return;

        const poll = async () => {
            try {
                const res = await fetch('/api/messages');
                if (!res.ok) return;
                const fetched = await res.json();

                setLocalMessages(prev => {
                    const prevMax = lastMessageIdRef.current;
                    const hasNew = fetched.some(m => m.id > prevMax);
                    if (!hasNew) return prev;
                    const newMax = Math.max(...fetched.map(m => m.id));
                    lastMessageIdRef.current = newMax;
                    if (isAtBottomRef.current) {
                        setTimeout(() => endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                    return fetched;
                });

                setIsLive(true);
            } catch (e) {
                setIsLive(false);
            }
        };

        poll();
        const interval = setInterval(poll, 5000);
        return () => clearInterval(interval);
    }, [joined]);

    const handleJoin = () => {
        if (name.trim()) {
            setData('name', name);
            setData('email', name.replace(/\s+/g, '').toLowerCase() + '@guest.com');
            setJoined(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('image', file);
        const reader = new FileReader();
        reader.onload = ev => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSend = (e) => {
        e?.preventDefault();
        if (!data.message.trim() && !data.image) return;

        setLocalMessages(prev => [...prev, {
            id: Date.now(),
            sender: name,
            text: data.message,
            image: imagePreview
        }]);
        setImagePreview(null);

        post(route('contact.store'), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset('message', 'image');
                if (fileInputRef.current) fileInputRef.current.value = '';
                endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    };

    return (
        <div className="relative flex flex-col h-full bg-[#1a1a1a] text-white p-2" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            {/* Fullscreen Image Modal */}
            {modalImage && (
                <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm" onClick={() => setModalImage(null)}>
                    <img src={modalImage} alt="Expanded view" className="max-w-full max-h-full object-contain shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
                    <button className="absolute top-6 right-6 w-8 h-8 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] text-black font-bold text-lg flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white outline-none" onClick={() => setModalImage(null)}>
                        X
                    </button>
                </div>
            )}

            {/* The Chat Area (Blurred if not joined) */}
            <div className={`flex flex-col h-full transition-all duration-300 ${!joined ? 'blur-sm opacity-60 select-none pointer-events-none' : ''}`}>
                <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-auto mb-2 text-sm flex flex-col gap-3 p-1">
                    <div className="text-gray-500 italic">
                        -- Message Board --
                    </div>
                    {localMessages.length === 0 && (
                        <div className="text-gray-600 italic text-xs">No messages yet. Be the first to say something!</div>
                    )}
                    {localMessages.map((msg) => (
                        <div key={msg.id}>
                            <span className="font-bold text-gray-300">{msg.sender}:</span>
                            {msg.text && <div className="text-gray-400 mt-0.5">{msg.text}</div>}
                            {msg.image && (
                                <img
                                    src={msg.image}
                                    alt="uploaded"
                                    className="mt-1 max-w-[200px] max-h-[150px] object-contain border border-[#333] cursor-pointer hover:border-[#666] transition-colors"
                                    onClick={() => setModalImage(msg.image)}
                                />
                            )}
                            {msg.admin_reply && (
                                <div className="mt-2 ml-4 border-l-2 border-[#555] pl-2">
                                    <span className="text-[#888] font-bold italic text-[11px]">↳ Sxna Replied to {msg.sender} :</span>
                                    <div className="text-gray-300 mt-0.5 text-xs">{msg.admin_reply}</div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>

                {/* Image preview strip */}
                {imagePreview && (
                    <div className="mb-1 px-1">
                        <div className="relative inline-block">
                            <img src={imagePreview} alt="preview" className="h-10 w-10 object-cover border border-[#444]" />
                            <button
                                onClick={() => { setImagePreview(null); setData('image', null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#3a3a3a] text-white text-[9px] leading-none flex items-center justify-center border-t border-l border-t-white/30 border-l-white/30 border-r border-b border-r-[#000] border-b-[#000] active:border-t-[#000] active:border-l-[#000] active:border-r-white/30 active:border-b-white/30 outline-none font-bold"
                            >×</button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSend} className="flex gap-1 h-8 shrink-0">
                    {/* Image upload button */}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="chat-image-input" />
                    <label
                        htmlFor="chat-image-input"
                        className="flex items-center justify-center w-8 h-full bg-[#3a3a3a] border-t border-l border-t-white/30 border-l-white/30 border-r border-b border-r-[#000] border-b-[#000] cursor-pointer text-gray-300 hover:text-white"
                        title="Upload image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                            <polyline points="16 16 12 12 8 16"></polyline>
                            <line x1="12" y1="12" x2="12" y2="21"></line>
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                        </svg>
                    </label>
                    <input
                        type="text"
                        value={data.message}
                        onChange={e => setData('message', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
                        className="flex-1 bg-[#222] border-t border-l border-t-[#000] border-l-[#000] border-r border-b border-r-[#444] border-b-[#444] px-2 text-sm text-white outline-none"
                        placeholder="Type a message..."
                        disabled={processing || !joined}
                    />
                    <button
                        type="submit"
                        disabled={processing || !joined}
                        className="bg-[#3a3a3a] px-3 font-bold border-t border-l border-t-white/30 border-l-white/30 border-r border-b border-r-[#000] border-b-[#000] active:border-t-[#000] active:border-l-[#000] active:border-r-white/30 active:border-b-white/30 text-sm outline-none text-white"
                    >
                        Send
                    </button>
                </form>
            </div>

            {/* Login Overlay */}
            {!joined && (
                <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
                    <div className="bg-[#2b2b2b] border-t border-l border-t-[#666] border-l-[#666] border-r border-b border-r-[#111] border-b-[#111] p-5 shadow-[4px_4px_10px_rgba(0,0,0,0.6)] w-full max-w-[260px]">
                        <h3 className="font-bold mb-3 text-white text-md tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Your Username</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleJoin()}
                            className="w-full bg-[#1a1a1a] border-t border-l border-t-[#000] border-l-[#000] border-r border-b border-r-[#444] border-b-[#444] px-2 py-1.5 text-sm text-gray-400 font-mono outline-none mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleJoin}
                                className="bg-[#444] hover:bg-[#4a4a4a] px-3 py-1 text-sm border-t border-l border-t-white/30 border-l-white/30 border-r border-b border-r-[#111] border-b-[#111] active:border-t-[#111] active:border-l-[#111] active:border-r-white/30 active:border-b-white/30 outline-none text-white shadow-sm transition-colors"
                            >
                                Start Chatting
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function detectVideoType(src) {
    if (!src) return { type: 'none' };
    const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (ytMatch) return { type: 'youtube', id: ytMatch[1] };
    const ttMatch = src.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (ttMatch) return { type: 'tiktok', id: ttMatch[1] };
    return { type: 'direct', src };
}

function ContactContent() {
    return (
        <div className="flex flex-col h-full text-black select-none" style={{ fontFamily: 'Tahoma, "MS Sans Serif", sans-serif', fontSize: 11, background: '#c0c0c0' }}>
            {/* Menu bar */}
            <div className="flex items-center gap-4 px-2 py-0.5 border-b border-[#808080] shrink-0" style={{ fontSize: 11 }}>
                <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">File</span>
                <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Edit</span>
            </div>

            {/* Sunken content panel */}
            <div className="flex-1 m-2 p-3 overflow-auto"
                style={{
                    background: '#ffffff',
                    border: '2px solid',
                    borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                    boxShadow: 'inset 1px 1px 0 #000'
                }}
            >
                <p style={{ marginBottom: 10, lineHeight: 1.5 }}>
                    if you want to get in contact with me, you can message me on discord at{' '}
                    <a href="https://discord.com/users/934030671742115880" target="_blank" rel="noreferrer"
                        style={{ color: '#0000ee', textDecoration: 'underline' }}>sxna</a>{' '}
                </p>
                <p style={{ marginBottom: 14, lineHeight: 1.5 }}>
                    if you want my insta or tiktok just ask, but here are some of my other social media or anything
                </p>

                {/* Icon buttons — chunky Win95 bevel style */}
                <div style={{ display: 'flex', gap: 8 }}>
                    {/* GitHub */}
                    <a href="https://github.com/Bimakanz" target="_blank" rel="noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 36, height: 36,
                            background: '#000000',
                            border: '2px solid',
                            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                            boxShadow: '1px 1px 0 #000',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                        title="GitHub"
                    >
                        <svg viewBox="0 0 24 24" fill="white" width="20" height="20" style={{ imageRendering: 'pixelated' }}>
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                    </a>

                    {/* Discord */}
                    <a href="https://discord.com/users/934030671742115880" target="_blank" rel="noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 36, height: 36,
                            background: '#7289da',
                            border: '2px solid',
                            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                            boxShadow: '1px 1px 0 #000',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                        title="Discord"
                    >
                        <svg viewBox="0 0 24 24" fill="white" width="20" height="20" style={{ imageRendering: 'pixelated' }}>
                            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                    </a>


                </div>
            </div>
        </div>
    );
}


function VideoPlayerContent({ videos = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const videoRef = useRef(null);
    const current = videos[currentIndex];
    const embed = detectVideoType(current?.src);
    const [showSkipInfo, setShowSkipInfo] = useState(false);

    const skipToNext = () => {
        setShowSkipInfo(false);
        if (videos.length <= 1) {
            // Force replay if there's only 1 video
            if (embed.type === 'direct' && videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => { });
            } else {
                // For iframe, forcing a re-render by briefly setting index to -1 and back to 0
                setCurrentIndex(-1);
                setTimeout(() => setCurrentIndex(0), 10);
            }
        } else {
            setCurrentIndex(i => (i + 1) % Math.max(videos.length, 1));
        }
    };

    useEffect(() => {
        if (currentIndex === -1) return;
        if (embed.type === 'direct' && videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.play().catch(() => { });
        }
    }, [currentIndex]);

    useEffect(() => {
        if (embed.type === 'direct' && videoRef.current) videoRef.current.volume = volume;
    }, [volume]);

    if (videos.length === 0) {
        return <div className="flex h-full bg-black items-center justify-center text-gray-500 text-sm font-mono">No videos available.</div>;
    }

    const getEmbedUrl = () => {
        if (embed.type === 'youtube') return `https://www.youtube.com/embed/${embed.id}?autoplay=1&mute=0&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&loop=1&playlist=${embed.id}`;
        if (embed.type === 'tiktok') return `https://www.tiktok.com/embed/v2/${embed.id}`;
        return null;
    };
    const embedUrl = getEmbedUrl();

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] text-white select-none" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            {/* Menu bar */}
            <div className="flex items-center gap-4 px-2 py-0.5 bg-[#c0c0c0] text-black text-xs border-b border-[#808080] shrink-0">
                {['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'].map(m => <span key={m} className="cursor-default hover:bg-[#000080] hover:text-white px-1">{m}</span>)}

                <div className="ml-auto relative">
                    <span
                        className="cursor-pointer font-bold"
                        onClick={() => setShowSkipInfo(!showSkipInfo)}
                    >
                        Click to skip video
                    </span>
                    {showSkipInfo && (
                        <div className="absolute top-full right-0 mt-1 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] px-4 py-1 z-50 whitespace-nowrap text-black font-normal shadow-[2px_2px_0_#000]">
                            just click the video to skip
                        </div>
                    )}
                </div>
            </div>

            {/* Address bar */}
            <div className="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0] border-b-2 border-b-[#808080] shrink-0">
                <span className="text-xs text-black font-bold shrink-0">Address</span>
                <div className="flex-1 min-w-0 border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white bg-white px-2 text-xs text-black py-0.5 flex items-center gap-1">
                    <span className="truncate flex-1">{current?.src ?? ''}</span>
                    <span className="border-l border-gray-400 pl-1 text-gray-500 shrink-0">▼</span>
                </div>
                <span className="text-black text-sm shrink-0">🔊</span>
                <input
                    type="range" min={0} max={1} step={0.01} value={volume}
                    onChange={e => setVolume(parseFloat(e.target.value))}
                    className="w-28 accent-[#1084d0]"
                />
            </div>

            {/* Video area */}
            <div className="flex-1 relative overflow-hidden bg-black" onClick={embed.type !== 'direct' ? undefined : skipToNext} style={{ cursor: embed.type === 'direct' ? 'pointer' : 'default' }}>
                {embed.type === 'direct' && current && (
                    <video
                        ref={videoRef} key={embed.src || current.src} src={embed.src || current.src}
                        autoPlay loop={false} onEnded={skipToNext}
                        className="w-full h-full object-contain"
                        style={{ pointerEvents: 'none' }}
                    />
                )}
                {(embed.type === 'youtube' || embed.type === 'tiktok') && embedUrl && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <iframe
                            key={embedUrl}
                            src={embedUrl}
                            className="absolute pointer-events-none border-0"
                            style={{
                                width: embed.type === 'youtube' ? '150%' : '100%',
                                height: embed.type === 'youtube' ? 'auto' : '100%',
                                aspectRatio: embed.type === 'youtube' ? '16/9' : 'auto',
                                transform: embed.type === 'youtube' ? 'scale(1.35)' : 'none'
                            }}
                            allow="autoplay; encrypted-media"
                            allowFullScreen={false}
                        />
                        <div className="absolute inset-0 z-10 cursor-pointer" onClick={skipToNext} title="Click to skip" />
                    </div>
                )}
                <div className="absolute bottom-1 right-2 text-white/30 text-[10px] font-mono pointer-events-none z-20 select-none">{current?.title}</div>
            </div>
        </div>
    );
}

function WallpaperEngineContent({ folders = [], onWallpaperChange }) {
    const [expanded, setExpanded] = useState({ mypc: false, images: false, background: false });
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selected, setSelected] = useState(null); // highlighted in tree
    const [applied, setApplied] = useState(null); // currently applied (for preview only, not yet wallpaper)

    const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));
    const toggleFolder = (id) => setExpandedFolders(p => ({ ...p, [id]: !p[id] }));

    // Only highlight, don't apply yet
    const handleSelect = (wp) => setSelected(wp);

    // Apply when button pressed
    const handleSetWallpaper = () => {
        if (!selected) return;
        setApplied(selected);
        onWallpaperChange?.(selected.image_url);
    };

    const NodeRow = ({ depth = 0, icon, label, open, onClick, children, selected: isSel }) => (
        <div>
            <div
                className={`flex items-center gap-1 cursor-pointer py-[1px] ${isSel ? 'bg-[#000080] text-white' : 'text-gray-300 hover:bg-[#1a3a7a]'}`}
                style={{ paddingLeft: `${6 + depth * 14}px` }}
                onClick={onClick}
            >
                <span className="text-[10px] text-gray-500 w-3 shrink-0 select-none">{open !== undefined ? (open ? '▾' : '▸') : '■'}</span>
                <span className="shrink-0 text-sm leading-none">{icon}</span>
                <span className="text-[11px] leading-5">{label}</span>
            </div>
            {open && children}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-black text-white select-none" style={{ fontFamily: 'Tahoma, monospace' }}>
            {/* Fake menu bar */}
            <div className="flex gap-4 px-2 py-0.5 bg-black text-white text-xs border-b border-[#444] shrink-0">
                <span className="hover:bg-gray-800 hover:text-white px-1 cursor-default">File</span>
                <span className="hover:bg-gray-800 hover:text-white px-1 cursor-default">Edit</span>
            </div>

            {/* Main area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Tree panel */}
                <div className="w-52 border-r border-[#444] overflow-auto bg-black shrink-0 pt-1">
                    <NodeRow depth={0} icon="🖥" label="My Computer" open={expanded.mypc} onClick={() => toggle('mypc')}>
                        <NodeRow depth={1} icon="📁" label="Images" open={expanded.images} onClick={() => toggle('images')}>
                            <NodeRow depth={2} icon="📁" label="background" open={expanded.background} onClick={() => toggle('background')}>
                                {folders.map(folder => (
                                    <div key={folder.id}>
                                        <NodeRow
                                            depth={3} icon="📁" label={folder.name}
                                            open={expandedFolders[folder.id]}
                                            onClick={() => toggleFolder(folder.id)}
                                        >
                                            {folder.wallpapers.map(wp => (
                                                <NodeRow
                                                    key={wp.id} depth={4} icon="🖼"
                                                    label={wp.name} open={undefined}
                                                    selected={selected?.id === wp.id}
                                                    onClick={() => handleSelect(wp)}
                                                />
                                            ))}
                                        </NodeRow>
                                    </div>
                                ))}
                            </NodeRow>
                        </NodeRow>
                    </NodeRow>
                </div>

                {/* Preview panel */}
                <div className="flex-1 flex flex-col bg-black">
                    {/* Picture selector header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-[#444] shrink-0">
                        <span className="text-gray-300 text-xs">Picture:</span>
                        <div className="flex-1 border border-white bg-black px-2 py-0.5 text-white text-[11px] flex items-center justify-between">
                            <span className="truncate">{selected?.name ?? 'Select an image'}</span>
                            <span className="text-gray-400 ml-2">▼</span>
                        </div>
                    </div>

                    {/* Preview image */}
                    <div className="flex-1 bg-black m-2 flex items-center justify-center border border-[#444] overflow-hidden">
                        {selected ? (
                            selected.image_url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                                <video key={selected.id} src={selected.image_url} className="w-full h-full object-contain" autoPlay loop muted playsInline />
                            ) : (
                                <img key={selected.id} src={selected.image_url} alt={selected.name} className="w-full h-full object-contain" />
                            )
                        ) : (
                            <p className="text-gray-700 text-xs italic">Select a file from the tree</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-3 pb-2 shrink-0">
                        <span className="text-gray-700 text-[10px]">no credit link</span>
                        <button
                            onClick={handleSetWallpaper}
                            disabled={!selected}
                            className="px-3 py-0.5 bg-black text-white text-xs border border-white hover:bg-gray-800 outline-none disabled:opacity-40"
                        >
                            Set as wallpaper
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShowsContent({ shows = [] }) {
    const [tab, setTab] = useState('watched');
    const [selectedId, setSelectedId] = useState(null);
    const [modalImage, setModalImage] = useState(null);

    const ALL_TABS = [
        { id: 'watched', label: 'Finished' },
        { id: 'watchlist', label: 'On-going' },
    ];

    const filtered = shows.filter(s => s.status === tab);
    const selected = shows.find(s => s.id === selectedId) || filtered[0];

    return (
        <div className="flex flex-col md:flex-row h-full bg-[#111] text-white select-none gap-2 p-1.5" style={{ fontFamily: '"MS Sans Serif", Tahoma, sans-serif' }}>

            {/* Fullscreen Image Modal */}
            {modalImage && (
                <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm" onClick={() => setModalImage(null)}>
                    <img src={modalImage} alt="Expanded view" className="max-w-full max-h-full object-contain shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
                    <button className="absolute top-6 right-6 w-8 h-8 bg-[#c0c0c0] border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] text-black font-bold text-lg flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white outline-none" onClick={() => setModalImage(null)}>
                        X
                    </button>
                </div>
            )}

            {/* Left Pane (Grid) */}
            <div className="flex-1 md:flex-[4] flex flex-col min-h-0 bg-black border-2 border-l-[#808080] border-t-[#808080] border-r-white border-b-white p-2 md:p-3">
                {/* Tabs */}
                <div className="flex gap-2 mb-4 shrink-0">
                    {ALL_TABS.map(t => {
                        const active = tab === t.id;
                        return (
                            <button key={t.id} onClick={() => { setTab(t.id); setSelectedId(null); }}
                                className={`px-4 py-1.5 text-sm transition-all border-2 ${active
                                        ? 'bg-[#333] border-t-black border-l-black border-r-white border-b-white text-white'
                                        : 'bg-[#555] border-t-white border-l-white border-r-black border-b-black text-white hover:bg-[#666]'
                                    }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-2 md:gap-4 place-content-start">
                    {filtered.length === 0 ? (
                        <div className="col-span-2 text-gray-500 italic text-center mt-10">No shows found.</div>
                    ) : filtered.map((show, idx) => (
                        <div
                            key={show.id}
                            onClick={() => setSelectedId(show.id)}
                            className={`flex flex-col p-2.5 border rounded-lg cursor-pointer transition-colors ${selected?.id === show.id ? 'border-[#555] bg-[#111]' : 'border-[#222] bg-transparent hover:border-[#444]'
                                }`}
                        >
                            <h3 className="font-bold text-[13px] mb-2">{show.title}</h3>
                            <div className="aspect-[3/4] w-full bg-black overflow-hidden rounded border border-[#111]">
                                {show.main_image ? (
                                    <img src={show.main_image} alt={show.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">No Image</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Pane (Details) */}
            <div className="flex-1 md:flex-[3] flex flex-col min-h-0 bg-black border-2 border-l-[#808080] border-t-[#808080] border-r-white border-b-white p-3 md:p-5 overflow-y-auto custom-scrollbar">
                {selected ? (
                    <>
                        <h2 className="text-2xl font-bold mb-4 tracking-wide">
                            {selected.title}
                        </h2>
                        {selected.description && (
                            <p className="text-[13px] text-[#e0e0e0] leading-relaxed mb-6 whitespace-pre-wrap">{selected.description}</p>
                        )}

                        {/* Main Poster in Details */}
                        <div className="w-full max-w-[280px] mx-auto bg-[#111] mb-6 shadow-2xl relative group cursor-pointer" onClick={() => selected.main_image && setModalImage(selected.main_image)}>
                            {selected.main_image ? (
                                <>
                                    <img src={selected.main_image} alt={selected.title} className="w-full h-auto object-contain rounded-sm" />
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-black/70 px-3 py-1 text-xs rounded-full">Click to view</span>
                                    </div>
                                </>
                            ) : (
                                <div className="aspect-[3/4] w-full flex items-center justify-center text-gray-500 text-xs border border-[#333]">No Image</div>
                            )}
                        </div>

                        {/* Mini Posters */}
                        <div className="flex justify-center gap-4 mt-6">
                            {[selected.poster_1, selected.poster_2, selected.poster_3].filter(Boolean).map((p, i) => (
                                <img key={i} src={p} alt={`Poster ${i + 1}`} onClick={() => setModalImage(p)} className="w-20 h-28 object-cover rounded-sm border border-[#444] shadow-md hover:scale-105 hover:border-white transition-all cursor-pointer" />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-600 italic">
                        Select a show to view details
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 14px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1a1a1a;
                    border-left: 1px solid #333;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #555;
                    border: 1px solid #777;
                }
                .custom-scrollbar::-webkit-scrollbar-button {
                    background: #444;
                    display: block;
                    height: 14px;
                    border: 1px solid #666;
                }
            `}} />
        </div>
    );
}

function BioContent() {
    return (
        <div className="w-full h-full bg-white flex flex-col">
            <iframe
                src="https://redacted.bio/sxena"
                title="Bio"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
        </div>
    );
}


function Desktop({ chatMessages, projects = [], videos = [], wallpaperFolders = [], shows = [], onShutdown }) {
    const [openWindows, setOpenWindows] = useState(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        return isMobile ? [
            { id: 'about_me', title: 'Notepad', pos: { x: 0, y: 0 }, isDark: true, minimized: false, zIndex: 60 }
        ] : [
            { id: 'about_me', title: 'Notepad', pos: { x: 700, y: 60 }, isDark: true, minimized: false, zIndex: 60 },
            { id: 'message_board', title: 'Message Board', pos: { x: 600, y: 150 }, isDark: true, minimized: false, zIndex: 51, height: 650 }
        ];
    });
    const [topZIndex, setTopZIndex] = useState(51);
    const [time, setTime] = useState(new Date());
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('guest_wallpaper') || null);

    const handleWallpaperChange = (url) => {
        setWallpaper(url);
        localStorage.setItem('guest_wallpaper', url);
    };

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const activeWindowId = useMemo(() => {
        const visibleWindows = openWindows.filter(w => !w.minimized);
        if (visibleWindows.length === 0) return null;
        return visibleWindows.reduce((prev, current) => ((prev.zIndex || 50) > (current.zIndex || 50)) ? prev : current).id;
    }, [openWindows]);

    const focusWindow = (id) => {
        if (activeWindowId === id) return; // Do not update state if already focused to prevent swallowing click events
        setTopZIndex(z => z + 1);
        setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: topZIndex + 1, minimized: false } : w));
    };

    const openWindow = (id, title, isDark) => {
        if (!openWindows.find((w) => w.id === id)) {
            setTopZIndex(z => z + 1);
            let height = 600;
            let width = 450;
            if (id === 'message_board') height = 650;
            if (id === 'contact') {
                width = 500;
                height = 300;
            }
            if (id === 'shows') {
                width = 950;
                height = 650;
            }
            if (id === 'bio') {
                width = 450;
                height = 700;
            }
            if (id === 'wallpaper_engine') {
                width = 750;
            }
            setOpenWindows((prev) => [...prev, { id, title, isDark, pos: { x: 100 + prev.length * 40, y: 100 + prev.length * 40 }, minimized: false, zIndex: topZIndex + 1, height, width }]);
        } else {
            focusWindow(id);
        }
    };

    const closeWindow = (id) => setOpenWindows((prev) => prev.filter((w) => w.id !== id));

    // activeWindowId is now moved above focusWindow

    const handleTaskbarClick = (id) => {
        const win = openWindows.find(w => w.id === id);
        if (win.minimized) {
            focusWindow(id);
        } else if (activeWindowId === id) {
            setOpenWindows((prev) => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
        } else {
            focusWindow(id);
        }
    };

    const getTaskbarIcon = (id) => {
        if (id === 'about_me') return "https://xque.dev/globe.gif";
        if (id === 'message_board') return "https://xque.dev/chat.webp";
        if (id === 'video_player') return "https://xque.dev/disk.png";
        if (id === 'wallpaper_engine') return "https://xque.dev/window.png";
        if (id === 'contact') return "https://xque.dev/mail.png";
        if (id === 'shows') return "https://xque.dev/anime.png";
        if (id === 'bio') return "https://xque.dev/redacted.png";
        return "https://win98icons.alexmeub.com/icons/png/notepad_file-0.png";
    };

    const isVideoWallpaper = wallpaper && wallpaper.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

    return (
        <div
            className="h-screen bg-[#008080] font-sans select-none overflow-hidden flex flex-col relative"
            style={{
                fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
                backgroundImage: isVideoWallpaper ? 'none' : (wallpaper ? `url('${wallpaper}')` : "url('https://github.com/Bimakanz/PersonalWeb/releases/download/assets/osaka.png')"),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {isVideoWallpaper && (
                <video
                    key={wallpaper}
                    src={wallpaper}
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                />
            )}
            {/* Desktop Area */}
            <div className="flex-1 p-4 relative h-[calc(100vh-2rem)] overflow-hidden z-10">
                {/* Desktop Icons */}
                <div className="absolute top-4 left-4 flex gap-4 z-0">
                    {/* First Column */}
                    <div className="flex flex-col gap-3 w-24">
                        <button onClick={() => openWindow('about_me', 'Notepad', true)} className="flex flex-col items-center gap-0 group outline-none">
                            <img src="https://xque.dev/globe.gif" alt="About" className="w-40 h-20 drop-shadow-md group-hover:brightness-110" />
                            <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">About</span>
                        </button>
                        <button onClick={() => openWindow('message_board', 'Message Board', true)} className="flex flex-col items-center gap-0 group outline-none">
                            <img src="https://xque.dev/chat.webp" alt="Message Board" className="w-40 h-20 drop-shadow-md group-hover:brightness-110" />
                            <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Message Board</span>
                        </button>
                        <button onClick={() => openWindow('video_player', '.Video', true)} className="flex flex-col items-center gap-0 group outline-none">
                            <img src="https://xque.dev/disk.png" alt="Video" className="w-40 h-20 drop-shadow-md group-hover:brightness-110 object-contain" style={{ imageRendering: 'pixelated' }} />
                            <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Video</span>
                        </button>
                        <button onClick={() => openWindow('wallpaper_engine', 'Wallpaper Engine', true)} className="flex flex-col items-center gap-0 group outline-none">
                            <img src="https://xque.dev/window.png" alt="Wallpaper" className="w-40 h-20 drop-shadow-md group-hover:brightness-110 object-contain" style={{ imageRendering: 'pixelated' }} />
                            <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Wallpaper</span>
                        </button>
                        <button onClick={() => openWindow('contact', 'Contact', false)} className="flex flex-col items-center gap-0 group outline-none">
                            <img src="https://xque.dev/mail.png" alt="Contact" className="w-40 h-20  drop-shadow-md group-hover:brightness-110 object-contain" style={{ imageRendering: 'pixelated' }} />
                            <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Contact</span>
                        </button>
                        <button onClick={() => openWindow('shows', 'Shows', true)} className="flex flex-col items-center gap-0 group outline-none">
                            <img src="https://xque.dev/anime.png" alt="Shows" className="w-40 h-20 drop-shadow-md group-hover:brightness-110 object-contain" style={{ imageRendering: 'pixelated' }} />
                            <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Shows</span>
                        </button>
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col gap-3 w-24">
                        <button onClick={() => openWindow('bio', 'Bio', false)} className="flex flex-col items-center gap-0 group outline-none">
                            <img src="https://xque.dev/redacted.png" alt="Bio" className="w-40 h-20 drop-shadow-md group-hover:brightness-110 object-contain" style={{ imageRendering: 'pixelated' }} />
                            <span className="text-white text-xs bg-transparent px-1 group-hover:bg-[#000080] group-hover:text-white border border-transparent group-hover:border-dotted group-hover:border-white text-center drop-shadow-md">Bio</span>
                        </button>
                    </div>
                </div>

                {/* Windows */}
                <AnimatePresence>
                    {openWindows.map((w) => {
                        return (
                            <Window key={w.id} id={w.id} title={w.title} darkTheme={w.isDark} isActive={activeWindowId === w.id && !w.minimized} onClose={() => closeWindow(w.id)} onMinimize={() => setOpenWindows(p => p.map(win => win.id === w.id ? { ...win, minimized: true } : win))} onFocus={() => focusWindow(w.id)} minimized={w.minimized} zIndex={w.zIndex} initialPos={w.pos} height={w.height || 400} width={w.width || 450}>
                                {w.id === 'about_me' && <NotepadContent projects={projects} />}
                                {w.id === 'message_board' && <MessageBoardContent initialMessages={chatMessages} />}
                                {w.id === 'video_player' && <VideoPlayerContent videos={videos} />}
                                {w.id === 'wallpaper_engine' && <WallpaperEngineContent folders={wallpaperFolders} onWallpaperChange={handleWallpaperChange} />}
                                {w.id === 'contact' && <ContactContent />}
                                {w.id === 'shows' && <ShowsContent shows={shows} />}
                                {w.id === 'bio' && <BioContent />}
                            </Window>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Taskbar */}
            {isStartMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsStartMenuOpen(false)} />
            )}
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
                                <span className="text-sm text-black font-bold truncate max-w-[150px]">guest</span>
                            </div>
                            <button
                                onClick={() => { setIsStartMenuOpen(false); onShutdown?.(); }}
                                className="w-full flex items-center gap-3 px-3 py-1.5 mt-1 hover:bg-[#000080] hover:text-white group text-black text-left focus:outline-none"
                            >
                                <img src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-0.png" alt="Shut Down" className="w-6 h-6" style={{ imageRendering: 'pixelated' }} />
                                <span className="text-sm group-hover:text-white">Shut Down...</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex gap-1 h-full py-1">
                    <button
                        onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                        className={`flex items-center gap-1 px-1.5 h-full bg-[#c0c0c0] border-2 font-bold text-black text-sm outline-none ${isStartMenuOpen
                                ? 'border-t-[#808080] border-l-[#808080] border-r-white border-b-white shadow-none bg-[#dfdfdf]'
                                : 'border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[1px_1px_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:shadow-none'
                            }`}
                    >
                        <img src="https://win98icons.alexmeub.com/icons/png/windows_slanted-1.png" alt="Start" className="w-4 h-4" />
                        Start
                    </button>

                    <div className="h-full border-l-2 border-l-[#808080] border-r-2 border-r-white mx-1"></div>

                    {openWindows.map(w => {
                        const isActive = activeWindowId === w.id && !w.minimized;
                        return (
                            <button
                                key={w.id}
                                onClick={() => handleTaskbarClick(w.id)}
                                className={`flex items-center gap-1 px-2 h-full bg-[#c0c0c0] font-bold text-black text-xs truncate max-w-[120px] focus:outline-none ${!isActive ? 'border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] shadow-[1px_1px_0_#000]' : 'border-t-2 border-l-2 border-t-[#808080] border-l-[#808080] border-r-2 border-b-2 border-r-white border-b-white shadow-[1px_1px_0_#000_inset]'}`}
                            >
                                <img src={getTaskbarIcon(w.id)} alt="Active" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }} />
                                <span className="font-bold text-black text-xs truncate max-w-[120px]">{w.title}</span>
                            </button>
                        )
                    })}
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

function Windows95Loading({ onComplete }) {
    useEffect(() => {
        const t = setTimeout(() => {
            onComplete();
        }, 2000);
        return () => clearTimeout(t);
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative select-none overflow-hidden" style={{ textShadow: '0 0 2px rgba(255,255,255,0.3)' }}>
            {/* Efek Garis CRT (TV Tabung Lama) */}
            <div className="absolute inset-0 pointer-events-none z-50" style={{ background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))', backgroundSize: '100% 4px, 3px 100%' }} />
            <div className="absolute inset-0 pointer-events-none z-50 opacity-20" style={{ background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)' }} />

            {/* Top Right Exit Info */}

            {/* Logo area */}
            <div className="flex flex-col items-center z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-end mb-8 md:mb-10">
                    {/* Authentic wavy Windows Logo */}
                    <div className="grid grid-cols-2 gap-[2px] md:gap-[3px] sm:mr-6 mb-4 sm:mb-0 w-12 h-12 md:w-16 md:h-16 transform -skew-y-[10deg] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        <div className="bg-[#f05129] rounded-tl-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]"></div>
                        <div className="bg-[#7fba00] rounded-tr-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]"></div>
                        <div className="bg-[#00a4ef] rounded-bl-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]"></div>
                        <div className="bg-[#ffba00] rounded-br-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]"></div>
                    </div>
                    <div className="flex flex-col items-center sm:items-start justify-end">
                        <div className="text-gray-300 text-lg md:text-2xl font-bold leading-none mb-1 tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>Microsoft<sup className="text-[10px] md:text-sm">®</sup></div>
                        <div className="text-white text-5xl md:text-7xl font-extrabold tracking-tighter leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>Windows 95</div>
                    </div>
                </div>

                {/* Highly authentic Loading Bar */}
                <div className="w-56 md:w-72 h-5 md:h-6 p-[2px] md:p-[3px] relative overflow-hidden bg-black flex gap-1 shadow-[1px_1px_0_rgba(255,255,255,0.2)]"
                    style={{ border: '2px solid', borderTopColor: '#404040', borderLeftColor: '#404040', borderRightColor: '#ffffff', borderBottomColor: '#ffffff' }}
                >
                    <motion.div
                        initial={{ left: '-40%' }}
                        animate={{ left: '100%' }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                        className="absolute top-[2px] bottom-[2px] w-[40%] flex justify-between gap-1"
                    >
                        <div className="flex-1 h-full bg-[#0000a8] shadow-[inset_1px_1px_0_rgba(255,255,255,0.3)]"></div>
                        <div className="flex-1 h-full bg-[#0000a8] shadow-[inset_1px_1px_0_rgba(255,255,255,0.3)]"></div>
                        <div className="flex-1 h-full bg-[#0000a8] shadow-[inset_1px_1px_0_rgba(255,255,255,0.3)]"></div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-between px-4 md:px-10 items-end">
                <div className="text-gray-400 text-[10px] md:text-sm tracking-wide max-w-[50%]" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Copyright © Microsoft Corporation
                </div>
                <div className="text-gray-200 text-lg md:text-2xl font-bold italic tracking-wider" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                    Microsoft<sup className="text-[10px] md:text-sm">®</sup>
                </div>
            </div>
        </div>
    );
}

function LoginScreen({ onLogin }) {
    // =========================================================================
    // ⚙️ PENGATURAN TAMPILAN LOGIN ⚙️
    // =========================================================================
    const ADMIN_AVATAR = "https://i.pinimg.com/originals/81/1d/25/811d255ce4eed0428b0b52b8ccb46c6f.gif";
    const GUEST_AVATAR = "https://i.pinimg.com/originals/c8/56/4a/c8564a53ab234f0ff5a4f6f5f92f9650.gif";

    const [bgData, setBgData] = useState(null);

    useEffect(() => {
        const rand = Math.random() * 100;
        let selectedUrl = "";
        let isRepeat = false;

        if (rand < 50) {
            selectedUrl = "https://i.pinimg.com/736x/12/e8/fc/12e8fcc8be3a42c50dcc79a24455e428.jpg"; // 50%
        } else if (rand < 70) {
            selectedUrl = "https://i.pinimg.com/736x/a5/47/91/a54791b2f500a6454fd17f8ab8d88adc.jpg"; // 20%
        } else if (rand < 90) {
            selectedUrl = "https://i.pinimg.com/originals/cb/e7/1b/cbe71bbc1a87f136fac57ed6001cbde0.gif"; // 20%
            isRepeat = true;
        } else {
            selectedUrl = "https://i.pinimg.com/originals/78/b5/cc/78b5cc349c51859e0d5174ab5ce37c7a.gif"; // 10%
            isRepeat = true;
        }

        setBgData({ url: selectedUrl, isRepeat });
    }, []);

    // Konfigurasi Inertia Form untuk Admin
    const [selectedUser, setSelectedUser] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@bimasena.dev', // Sesuai dengan data di database kamu
        password: '',
    });

    const handleAdminLogin = (e) => {
        e.preventDefault();
        post('/login'); // Akan mengirim request ke controller auth bawaan Laravel Breeze
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative select-none overflow-hidden"
            style={{
                background: 'radial-gradient(circle at 50% 100%, #1a365d 0%, #000000 70%)',
            }}
        >
            {/* Background Image */}
            {bgData ? (
                <div
                    className="absolute inset-0 w-full h-full opacity-60"
                    style={{
                        backgroundImage: `url(${bgData.url})`,
                        backgroundSize: bgData.isRepeat ? 'auto' : 'cover',
                        backgroundRepeat: bgData.isRepeat ? 'repeat' : 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                />
            ) : (
                <div className="absolute inset-0 pointer-events-none opacity-50">
                    <div className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] rounded-full border-[100px] border-blue-500/10 blur-3xl transform rotate-12"></div>
                </div>
            )}

            <div className="flex flex-row gap-6 md:gap-24 z-10 transition-all duration-500">
                {/* 1. TAMPILAN PILIH USER (Jika belum ada yang dipilih) */}
                {!selectedUser && (
                    <>
                        {/* Guest User */}
                        {GUEST_AVATAR !== "" && (
                            <div className="flex flex-col items-center group cursor-pointer" onClick={onLogin}>
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-[3px] border-white/20 group-hover:border-white transition-all overflow-hidden mb-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-105 bg-gray-800">
                                    <img src={GUEST_AVATAR} alt="Guest" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-white text-sm md:text-lg tracking-wide" style={{ fontFamily: 'Tahoma, Arial, sans-serif', textShadow: '2px 2px 2px #000, 1px 1px 0px #000', WebkitFontSmoothing: 'none', fontSmooth: 'never' }}>Guest</div>
                            </div>
                        )}

                        {/* Administrator User */}
                        {ADMIN_AVATAR !== "" && (
                            <div className="flex flex-col items-center group cursor-pointer" onClick={() => setSelectedUser('admin')}>
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-[3px] border-white/20 group-hover:border-white transition-all overflow-hidden mb-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-105 bg-gray-800">
                                    {ADMIN_AVATAR.match(/\.(mp4|webm)$/i) ? (
                                        <video src={ADMIN_AVATAR} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={ADMIN_AVATAR} alt="Administrator" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="text-white text-sm md:text-lg tracking-wide" style={{ fontFamily: 'Tahoma, Arial, sans-serif', textShadow: '2px 2px 2px #000, 1px 1px 0px #000', WebkitFontSmoothing: 'none', fontSmooth: 'never' }}>Administrator</div>
                            </div>
                        )}
                    </>
                )}

                {/* 2. TAMPILAN PASSWORD INPUT (Jika Admin dipilih) */}
                {selectedUser === 'admin' && (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onSubmit={handleAdminLogin}
                        className="flex flex-col items-center"
                    >
                        <div className="w-28 h-28 rounded-xl border-[3px] border-white/40 mb-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] bg-gray-800 overflow-hidden">
                            {ADMIN_AVATAR.match(/\.(mp4|webm)$/i) ? (
                                <video src={ADMIN_AVATAR} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                            ) : (
                                <img src={ADMIN_AVATAR} alt="Administrator" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="text-white text-xl tracking-wide mb-4" style={{ fontFamily: 'Tahoma, Arial, sans-serif', textShadow: '2px 2px 2px #000, 1px 1px 0px #000', WebkitFontSmoothing: 'none', fontSmooth: 'never' }}>Administrator</div>

                        {/* Password Field */}
                        <div className="flex flex-col items-center gap-1 mb-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="bg-[#2d2d2d] border border-[#555] text-white px-3 py-1.5 rounded-md outline-none focus:border-white focus:ring-1 focus:ring-white w-48 font-sans shadow-inner placeholder-gray-400 text-sm"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#444] hover:bg-[#555] border border-[#666] text-white px-3 py-1.5 rounded-md flex items-center justify-center transition-colors shadow-md disabled:opacity-50"
                                >
                                    →
                                </button>
                            </div>
                            {errors.email && (
                                <span className="text-red-400 text-xs font-bold font-sans animate-pulse">{errors.email}</span>
                            )}
                        </div>

                        {/* Switch User Button */}
                        <button
                            type="button"
                            onClick={() => setSelectedUser(null)}
                            className="text-gray-300 hover:text-white border border-gray-500 hover:border-gray-300 bg-black/40 hover:bg-black/60 px-5 py-1.5 rounded font-sans text-sm transition-all shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
                        >
                            Switch User
                        </button>
                    </motion.form>
                )}
            </div>
        </div>
    );
}

export default function Home({ projects, chatMessages = [], videos = [], wallpaperFolders = [], shows = [] }) {
    const [phase, setPhase] = useState('bios');
    const [titleText, setTitleText] = useState('Sxna');

    useEffect(() => {
        const chars = '!<>-_\\\\/[]{}—=+*^?#_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let timeoutId;

        const glitch = () => {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            setTitleText(`S${randomChar}na`);

            setTimeout(() => {
                setTitleText('Sxna');
            }, Math.random() * 100 + 50);

            // Random delay between 0.5s and 3.5s
            let nextGlitch = Math.random() * 3000 + 500;
            if (Math.random() > 0.7) {
                // 30% chance to do a quick double glitch
                nextGlitch = 150;
            }

            timeoutId = setTimeout(glitch, nextGlitch);
        };

        timeoutId = setTimeout(glitch, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <>
            <Head>
                <title>{titleText}</title>
                <meta name="description" content="Sxna — Portfolio" />
            </Head>

            <div className="bg-black min-h-screen">
                <AnimatePresence mode="wait">
                    {phase === 'bios' && (
                        <motion.div key="bios" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                            <BiosScreen onBoot={() => setPhase('loading')} />
                        </motion.div>
                    )}
                    {phase === 'loading' && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                            <Windows95Loading onComplete={() => setPhase('login')} />
                        </motion.div>
                    )}
                    {phase === 'login' && (
                        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                            <LoginScreen onLogin={() => setPhase('desktop')} />
                        </motion.div>
                    )}
                    {phase === 'desktop' && (
                        <motion.div key="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
                            <Desktop
                                projects={projects}
                                chatMessages={chatMessages}
                                videos={videos}
                                wallpaperFolders={wallpaperFolders}
                                shows={shows}
                                onShutdown={() => setPhase('bios')}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

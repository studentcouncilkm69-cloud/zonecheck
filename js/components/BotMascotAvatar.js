const BotMascotAvatar = ({ size = "md", isFloating = false }) => {
    const dimClass = size === "lg" ? "w-14 h-14" : size === "sm" ? "w-8 h-8" : "w-10 h-10";
    return (
        <div className={`relative ${dimClass} rounded-full bg-gradient-to-b from-[#E11D48] to-[#9F1239] p-1 shadow-lg flex items-center justify-center select-none shrink-0 border-2 border-white ${isFloating ? 'animate-bot-float' : ''}`}>
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
                <line x1="32" y1="2" x2="32" y2="11" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="32" cy="2" r="4" fill="#FBBF24" />
                <circle cx="7" cy="34" r="4.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="57" cy="34" r="4.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
                <rect x="9" y="11" width="46" height="42" rx="21" fill="#FFFFFF" />
                <rect x="14" y="18" width="36" height="24" rx="12" fill="#0F172A" />
                <g className="animate-bot-blink">
                    <circle cx="24" cy="29" r="4.2" fill="#38BDF8" />
                    <circle cx="40" cy="29" r="4.2" fill="#38BDF8" />
                    <circle cx="25.5" cy="27.5" r="1.4" fill="#FFFFFF" />
                    <circle cx="41.5" cy="27.5" r="1.4" fill="#FFFFFF" />
                </g>
                <ellipse cx="19" cy="34.5" rx="2.5" ry="1.3" fill="#FB7185" opacity="0.85" />
                <ellipse cx="45" cy="34.5" rx="2.5" ry="1.3" fill="#FB7185" opacity="0.85" />
                <path d="M 27 35 Q 32 39 37 35" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
        </div>
    );
};

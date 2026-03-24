import React, { useState } from 'react';

const UserMenu = ({ user, activeTeamId, onTeamSwitch, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    console.log("DEBUG: UserMenu received teams:", user?.teams);

    return (
// Wrap everything in a relative div with the MouseLeave
        <div
            className="relative"
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                // Use onMouseEnter to make it feel snappier if you like
                onMouseEnter={() => setIsOpen(true)}
                onClick={() => setIsOpen(!isOpen)}
                className="font-bold text-[var(--cruk-darkblue)] hover:text-blue-700 flex items-center focus:outline-none p-2"
            >
                {user.name}
                <span className="ml-1 text-[10px]">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div
                    // Added a small negative top margin (mt-[-2px]) to close the gap
                    className="absolute right-0 mt-0 w-64 bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden"
                >
                    <div className="p-3 bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-500 font-bold">
                        Active Research Context
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {user.teams?.map(team => (
                            <button
                                key={team.id}
                                onClick={() => {
                                    // 1. Trigger the parent's handleTeamSwitch
                                    onTeamSwitch(team.id.toString());
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center
                                    ${activeTeamId === team.id.toString()
                                        ? 'bg-blue-50 text-[var(--cruk-darkblue)] font-bold'
                                        : 'hover:bg-gray-50'}`}
                            >
                                <span>{team.name}</span>
                                {/* 2. Visual confirmation check */}
                                {activeTeamId === team.id.toString() && (
                                    <span className="text-green-600">✓</span>
                                )}
                            </button>
                        ))}
                 </div>
                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 border-t hover:bg-red-50 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
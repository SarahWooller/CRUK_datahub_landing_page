import React, { useState, useEffect } from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, itemType = "Dataset" }) => {
    const [confirmInput, setConfirmInput] = useState('');
    const targetTitle = title || `${itemType} Record`;

    useEffect(() => {
        if (isOpen) {
            setConfirmInput('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isMatch = confirmInput.trim() === targetTitle.trim();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isMatch) {
            onConfirm();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-red-700 font-bold text-lg">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Delete {itemType}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                        This action <strong className="text-red-600">cannot be undone</strong>. This will permanently delete the {itemType.toLowerCase()} and remove all associated metadata.
                    </p>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Target Name to Confirm:
                        </label>
                        <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 text-gray-800 font-mono text-sm font-bold select-all break-all shadow-inner">
                            {targetTitle}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Type the name above to enable deletion:
                        </label>
                        <input
                            type="text"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder={targetTitle}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isMatch}
                            className={`px-5 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-sm ${
                                isMatch
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200 cursor-pointer'
                                    : 'bg-red-300 cursor-not-allowed opacity-60'
                            }`}
                        >
                            Delete Permanently
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

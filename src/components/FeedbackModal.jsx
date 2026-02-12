import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import questionData from '../feedback/questions.json';

const FeedbackModal = ({ isOpen, onClose, activeSection, allFeedback, onSaveDraft, onFinalSubmit }) => {
    const nodeRef = useRef(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const currentQuestions = questionData[activeSection] || questionData.default;
    const formValues = watch();

    const filterDataForSection = (data) => {
        const filtered = {};
        currentQuestions.forEach(q => {
            if (data[q.id] !== undefined) {
                filtered[q.id] = data[q.id];
            }
        });
        return filtered;
    };

    useEffect(() => {
        if (isOpen) {
            const savedSectionData = allFeedback[activeSection] || {};
            currentQuestions.forEach(q => {
                setValue(q.id, savedSectionData[q.id] || "");
            });
        }
    }, [activeSection, isOpen, allFeedback, setValue, currentQuestions]);

    const onSave = (data) => {
        onSaveDraft(activeSection, filterDataForSection(data));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
            <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="parent">
                <div ref={nodeRef} className="pointer-events-auto" style={{ position: 'absolute' }}>
                    <Resizable
                        defaultSize={{ width: 520, height: 'auto' }}
                        className="bg-white rounded-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden"
                    >
                        {/* Header with explicit inline styles to force dark blue */}
                        <div className="drag-handle bg-gray-50 border-b border-gray-200 p-5 flex justify-between items-center cursor-grab">
                            <div className="flex flex-col">
                                <h2
                                    style={{ color: '#00007a', display: 'block' }}
                                    className="text-2xl font-bold tracking-tight"
                                >
                                    Feedback Form
                                </h2>
                                <span
                                    style={{ color: '#00007a', opacity: 0.7 }}
                                    className="text-xs font-black uppercase tracking-widest"
                                >
                                    Section: {activeSection}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                style={{ color: '#00007a' }}
                                className="text-4xl leading-none hover:text-red-600 transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSave)} className="p-8 space-y-6 bg-white overflow-y-auto max-h-[70vh]">
                            {currentQuestions.map((q) => (
                                <div key={q.id}>
                                    <label
                                        style={{ color: '#1e1b4b' }}
                                        className="block text-sm font-black uppercase mb-2"
                                    >
                                        {q.label}
                                    </label>
                                    {q.type === 'number' ? (
                                        <input
                                            type="number"
                                            {...register(q.id)}
                                            className="w-24 p-3 border border-gray-300 rounded-lg text-lg"
                                        />
                                    ) : (
                                        <textarea
                                            {...register(q.id)}
                                            className="w-full p-4 border border-gray-300 rounded-lg text-lg min-h-[120px] focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-base hover:bg-indigo-100 transition-colors"
                                >
                                    Save Notes for {activeSection}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onFinalSubmit(activeSection, filterDataForSection(formValues))}
                                    style={{ backgroundColor: '#00007a' }}
                                    className="w-full py-5 text-white rounded-lg font-bold text-lg hover:opacity-90 shadow-md transition-all"
                                >
                                    Finalize & Send Email
                                </button>
                            </div>
                        </form>
                    </Resizable>
                </div>
            </Draggable>
        </div>
    );
};

export default FeedbackModal;
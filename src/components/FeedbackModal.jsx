import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';

const generalCommentField = {
    id: "general_comments",
    label: "General Comments",
    type: "textarea"

};

// ... (imports remain the same)

const FeedbackModal = ({ isOpen, onClose, activeSection, allFeedback, onSaveDraft, onFinalSubmit, questionData }) => {
    const nodeRef = useRef(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const sectionData = questionData[activeSection] || questionData.default;
    const currentQuestions = [...sectionData.questions, generalCommentField];
    const displayTitle = sectionData.sectionTitle;

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
            reset({});
            const savedSectionData = allFeedback[activeSection] || {};
            currentQuestions.forEach(q => {
                setValue(q.id, savedSectionData[q.id] || "");
            });
        }
    }, [activeSection, isOpen, setValue, reset]);

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
                        {/* Reduced padding from p-5 to p-4 */}
                        <div className="drag-handle bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center cursor-grab">
                            <div className="flex flex-col">
                                <h2
                                    style={{ color: '#00007a', display: 'block' }}
                                    className="text-xl font-bold tracking-tight"
                                >
                                    Feedback Form
                                </h2>
                                <span
                                    style={{ color: '#00007a', opacity: 0.7 }}
                                    className="text-[10px] font-black uppercase tracking-widest"
                                >
                                    Section: {displayTitle}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                style={{ color: '#00007a' }}
                                className="text-3xl leading-none hover:text-red-600 transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Reduced padding from p-8 to p-5 and spacing from space-y-6 to space-y-4 */}
                        <form onSubmit={handleSubmit(onSave)} className="p-5 space-y-4 bg-white overflow-y-auto max-h-[60vh]">
                            {currentQuestions.map((q) => (
                                <div key={q.id}>
                                    <label
                                        style={{ color: '#1e1b4b' }}
                                        className="block text-xs font-black uppercase mb-1"
                                    >
                                        {q.label}
                                    </label>
                                    {q.type === 'number' ? (
                                        <input
                                            type="number"
                                            {...register(q.id)}
                                            min={q.min}
                                            max={q.max}
                                            className="w-20 p-2 border border-gray-300 rounded-lg text-base"
                                        />
                                    ) : (
                                        <textarea
                                            {...register(q.id)}
                                            /* Reduced min-height from 120px to 80px and padding from p-4 to p-3 */
                                            className="w-full p-3 border border-gray-300 rounded-lg text-base min-h-[80px] focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                </div>
                            ))}

                            {/* Reduced padding and gap for the button container */}
                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors"
                                >
                                    Save Notes for {displayTitle}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onFinalSubmit(activeSection, filterDataForSection(formValues))}
                                    style={{ backgroundColor: '#00007a' }}
                                    className="w-full py-4 text-white rounded-lg font-bold text-base hover:opacity-90 shadow-md transition-all"
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
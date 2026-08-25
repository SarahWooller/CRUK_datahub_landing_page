import React from 'react';
import { createPortal } from 'react-dom';
import FeedbackModal from './FeedbackModal.jsx';
import FeedbackFallback from './FeedbackFallback.jsx';
import { useFeedback } from '../hooks/useFeedback';
import viewQuestions from '../feedback/searchpage.json'; // Or create a new questions file for this page

export const FeedbackWidget = () => {
    // This hook manages all the open/close/save state internally
    const {
        allFeedback,
        isFeedbackOpen,
        setIsFeedbackOpen,
        fallbackData,
        setFallbackData,
        handleSaveDraft,
        handleFinalSubmit
    } = useFeedback(viewQuestions);

    const widgetJSX = (
        <>
            {/* 1. The Fallback Toast/Notification */}
            <FeedbackFallback
                data={fallbackData}
                onDismiss={() => setFallbackData(null)}
                onCopy={(text) => {
                    navigator.clipboard.writeText(text);
                    setFallbackData(null);
                }}
            />

            {/* 2. The Modal Overlay */}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                activeSection="alt_studies_view" // Unique ID for this page
                allFeedback={allFeedback}
                onSaveDraft={handleSaveDraft}
                onFinalSubmit={handleFinalSubmit}
                questionData={viewQuestions}
            />

            {/* 3. The Floating Trigger Button */}
            <button
                onClick={() => setIsFeedbackOpen(true)}
                className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 z-[9999] font-bold"
            >
                Feedback
            </button>
        </>
    );
    return createPortal(widgetJSX, document.body);
};
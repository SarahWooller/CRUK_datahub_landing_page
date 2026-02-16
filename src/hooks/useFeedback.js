import { useState } from 'react';

export const useFeedback = (questionData) => {
    const [allFeedback, setAllFeedback] = useState({});
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [fallbackData, setFallbackData] = useState(null);

    const handleSaveDraft = (section, answers) => {
        setAllFeedback(prev => ({ ...prev, [section]: answers }));
    };

    const handleFinalSubmit = (currentSection, currentAnswers, recipient = "skw24@sussex.ac.uk") => {
        // Use the questionData passed during initialization
        const finalData = { ...allFeedback, [currentSection]: currentAnswers };

        const feedbackEntries = Object.entries(finalData).filter(([_, answers]) => {
            return answers && Object.values(answers).some(val => val !== "" && val !== null);
        });

        if (feedbackEntries.length === 0) {
            alert("No feedback recorded yet");
            return;
        }

        const report = feedbackEntries.map(([sectionKey, answers]) => {
            const sectionConfig = questionData[sectionKey] || questionData.default;
            const displayTitle = sectionConfig?.sectionTitle || sectionKey.toUpperCase();

            const lines = Object.entries(answers).map(([qId, val]) => {
                const question = sectionConfig?.questions?.find(q => q.id === qId);
                const label = question ? question.label : qId;
                return `${label}: ${val}`;
            }).join('%0D%0A');

            return `SECTION: ${displayTitle}%0D%0A${lines}`;
        }).join('%0D%0A%0D%0A-----------------%0D%0A%0D%0A');

        const plainTextReport = report.replace(/%0D%0A/g, '\n');
        let appWasDetected = false;

        const triggerDetection = () => { appWasDetected = true; };
        window.addEventListener('blur', triggerDetection);

        window.location.href = `mailto:${recipient}?subject=CRUK Datahub Feedback&body=${report}`;

        setTimeout(() => {
            window.removeEventListener('blur', triggerDetection);
            if (!appWasDetected) setFallbackData(plainTextReport);
        }, 1000);

        setAllFeedback({});
        setIsFeedbackOpen(false);
    };

    return {
        allFeedback,
        isFeedbackOpen,
        setIsFeedbackOpen,
        fallbackData,
        setFallbackData,
        handleSaveDraft,
        handleFinalSubmit
    };
};
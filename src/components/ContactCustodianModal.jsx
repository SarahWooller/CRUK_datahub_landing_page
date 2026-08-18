import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const ContactCustodianModal = ({ isOpen, onClose, teamId, teamName, datasetName }) => {
    const [user, setUser] = useState(null);
    const [contactNumber, setContactNumber] = useState('');
    const [enquiryText, setEnquiryText] = useState('');
    const [consentGiven, setConsentGiven] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            const storedName = localStorage.getItem('userName');
            const storedEmail = localStorage.getItem('userEmail');
            const storedOrg = localStorage.getItem('userOrg');

            if (storedName && storedEmail) {
                setUser({
                    name: storedName,
                    email: storedEmail,
                    applicant_organisation: storedOrg || 'University of Sussex'
                });
            } else {
                setUser(null);
            }

            // Reset state
            setContactNumber('');
            setEnquiryText('');
            setConsentGiven(false);
            setError(null);
            setSuccessMessage('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    if (!user) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">You must be signed in to contact a Data Custodian.</p>
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!consentGiven) {
            setError("You must consent to your data being stored.");
            return;
        }

        if (enquiryText.length > 1500) {
            setError("Your enquiry must be 1500 characters or less.");
            return;
        }

        if (enquiryText.trim() === '') {
            setError("Please enter your enquiry.");
            return;
        }

        if (!teamId) {
            setError("No team associated with this dataset. Unable to send enquiry.");
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const MIDDLELAYER_URL = import.meta.env.VITE_MIDDLELAYER_URL || "http://localhost:8002";

        try {
            const response = await fetch(`${MIDDLELAYER_URL}/teams/${teamId}/enquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    contact_number: contactNumber || null,
                    dataset_name: datasetName || null,
                    enquiry_text: enquiryText,
                    consent_given: consentGiven,
                    applicant_name: user?.name,
                    applicant_email: user?.email,
                    applicant_organisation: user?.applicant_organisation
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to send enquiry.");
            }

            setSuccessMessage("Your enquiry has been successfully submitted and saved.");
            setTimeout(() => {
                onClose();
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-2xl relative my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">{teamName}</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Send a general enquiry regarding <strong>{datasetName || 'this dataset'}</strong>. You will receive an email copy of the enquiry sent. The Data Custodian will reply via email to your preferred email address, with a copy shared with the CRUK metadata catalogue.
                </p>

                {successMessage ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
                        {successMessage}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Name <span className="text-red-500">*</span></label>
                            <p className="text-xs text-gray-500 mb-1">This is automatically filled from your profile and cannot be changed in this form.</p>
                            <input
                                type="text"
                                value={user.name || ''}
                                disabled
                                className="w-full border border-gray-200 rounded p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Applicant organisation <span className="text-red-500">*</span></label>
                            <p className="text-xs text-gray-500 mb-1">This is automatically filled from your profile and cannot be changed in this form.</p>
                            <input
                                type="text"
                                value={user.applicant_organisation || 'University of Sussex'}
                                disabled
                                className="w-full border border-gray-200 rounded p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={user.email || ''}
                                disabled
                                className="w-full border border-gray-200 rounded p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact number (optional)</label>
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Your enquiry <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <textarea
                                    rows="5"
                                    maxLength="1500"
                                    value={enquiryText}
                                    onChange={(e) => setEnquiryText(e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
                                ></textarea>
                                <span className="absolute -top-6 right-0 text-xs text-gray-400">
                                    ({enquiryText.length}/1500)
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex items-start">
                            <input
                                type="checkbox"
                                id="consent"
                                checked={consentGiven}
                                onChange={(e) => setConsentGiven(e.target.checked)}
                                className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="consent" className="text-sm text-gray-600">
                                I consent to my personal data being processed and stored in order to facilitate this enquiry.
                            </label>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded text-white font-medium ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow'}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send message'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

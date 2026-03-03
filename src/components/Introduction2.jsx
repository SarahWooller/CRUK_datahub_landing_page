import React from 'react';

export const Introduction = () => {

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight">
                Unleashing the power of big data
            </h1>

            <div className="space-y-6 text-gray-700 text-lg sm:text-xl leading-relaxed">
                <p className="font-medium text-gray-900">
                    Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK.
                </p>

                <p>
                    The CRUK datahub is a catalogue of the datasets we fund. In this pilot stage the hub will be populated first with highly curated datasets from our Cancer Research Horizons and from the Data 4 Childhood and Young Persons Cancers and then broadening out to include both historical datasets and those that will result from CRUK projects just starting.
                </p>

                <p>
                    Where there are no access limitations to the data, the hub will include direct links. However, in many cases access is via a data access committee. Clicking on any of the links below will take you to a details page where you can find metadata about the study, including details of how to access the datasets.
                </p>
            </div>
        </div>
    );

};
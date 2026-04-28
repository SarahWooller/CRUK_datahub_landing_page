import React from 'react';

export const Introduction = () => {

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight">
                Unleashing the power of big data
            </h1>
             <h1 className="text-xl sm:text-xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight">
                 Browse our Research Projects </h1>


            <div className="space-y-6 text-gray-700 text-lg sm:text-xl leading-relaxed">
                <p className="font-medium text-gray-900">
                    Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK.
                </p>

                <p>
                    Here you can search our current research grants, lead investigators, and project scopes.
                </p>


            </div>
        </div>
    );

};
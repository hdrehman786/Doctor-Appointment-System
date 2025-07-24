import React from 'react';
import doctors from "../assets/doctors.jpg";

const About = () => {
    return (
        <section className="bg-white py-12 md:py-16">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

                    <div className="md:w-2/5 w-full flex-shrink-0">
                        <img
                            src={doctors}
                            alt="A team of professional doctors"
                            className="w-full h-full object-cover rounded-xl shadow-md"
                        />
                    </div>

                    <div className="md:w-3/5 w-full flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Connecting You to Exceptional Healthcare
                        </h1>

                        <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                            Welcome to our platform, designed to be your trusted partner in health. We've created a seamless, user-friendly experience to connect you with top-tier medical professionals, making quality care more accessible, convenient, and reliable than ever before.
                        </p>

                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            Our strength lies in our exceptional team of doctors. Each member is a highly skilled and compassionate expert in their field, dedicated not just to treating conditions, but to building lasting, trust-based relationships with every patient they serve.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                            Our Vision
                        </h2>

                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            We envision a future where healthcare is proactive, personalized, and empowering. Our goal is to leverage technology to foster a community built on wellness, providing you with the tools and support needed to manage your health with confidence and live your life to the fullest.
                        </p>
                    </div>

                </div>

                <div className="bg-white py-12">
                    <div className="container mx-auto px-4">

                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Why Choose Us?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Efficiency Card */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900">
                                    Efficiency
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Our streamlined platform saves you time, allowing you to book appointments and consult with doctors in just a few clicks.
                                </p>
                            </div>

                            {/* Convenience Card */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900">
                                    Convenience
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Access top-quality healthcare from the comfort of your home, on your schedule. No more waiting rooms or travel hassles.
                                </p>
                            </div>

                            {/* Personalization Card */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900">
                                    Personalization
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    We connect you with the right specialist for your needs, ensuring you receive care that is tailored specifically to you.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
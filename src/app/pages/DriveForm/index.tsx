import React, { useState } from 'react';
import { Steps, Card, Layout } from 'antd';
import { FormData } from './types/formTypes';
import DisclaimerStep from './steps/DisclaimerStep';
import NameStep from './steps/NameStep';
import AddressStep from './steps/AddressStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import ContactStep from './steps/ContactStep';
import Header from './components/Header';
import Footer from './components/Footer';

const { Content } = Layout;

const DriverForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        disclaimerAccepted: false,
        firstName: '',
        middleName: '',
        lastName: '',
        streetAddress: '',
        unitApt: '',
        location: '',
        socialNumber: '',
        dateOfBirth: '',
        gender: '',
        cellPhone: '',
        homePhone: '',
    });

    const handleNext = (stepData: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            console.log('Form submitted:', { ...formData, ...stepData });
            alert('Registration submitted successfully!');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const steps = [
        {
            title: 'Disclaimer',
            content: (
                <DisclaimerStep
                    data={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                    isFirstStep={currentStep === 0}
                />
            ),
        },
        {
            title: 'Name',
            content: (
                <NameStep
                    data={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            ),
        },
        {
            title: 'Address',
            content: (
                <AddressStep
                    data={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            ),
        },
        {
            title: 'Personal Info',
            content: (
                <PersonalInfoStep
                    data={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            ),
        },
        {
            title: 'Contact',
            content: (
                <ContactStep
                    data={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                    isLastStep={currentStep === 4}
                />
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#cfae00' }}>
            <Header />
            <Content style={{ padding: '50px', backgroundColor: '#f5f5dc' }}>
                <Card style={{ maxWidth: 1200, margin: '0 auto', backgroundColor: 'white' }}>
                    <Steps
                        current={currentStep}
                        items={steps.map(item => ({ title: item.title }))}
                        style={{ marginBottom: 40 }}
                    />
                    {steps[currentStep].content}
                </Card>
            </Content>
            <Footer />
        </Layout>
    );
};

export default DriverForm;
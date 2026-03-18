export interface FormData {
  // Step 1: Disclaimer
  email: string;
  disclaimerAccepted: boolean;
  
  // Step 2: Name
  firstName: string;
  middleName?: string;
  lastName: string;
  
  // Step 3: Address
  streetAddress: string;
  unitApt?: string;
  location: string;
  
  // Step 4: Personal Info
  socialNumber: string;
  dateOfBirth: string;
  gender: string;
  
  // Step 5: Contact
  cellPhone: string;
  homePhone?: string;
}

export interface StepProps {
  data: FormData;
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}
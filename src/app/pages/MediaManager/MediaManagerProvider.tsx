import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal } from 'antd';
import MediaModalContent from './MediaModalContent';

interface MediaModalContextProps {
    openModal: (config: any) => void;
    closeModal: () => void;
}

const MediaModalContext = createContext<MediaModalContextProps | undefined>(undefined);

export const MediaModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalConfig, setModalConfig] = useState<any | null>(null);

    const openModal = (config: any) => {
        setModalConfig(config);
    };

    const closeModal = () => {
        setModalConfig(null);
    };

    return (
        <MediaModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modalConfig && (
                <Modal
                    title={modalConfig.title || 'Media'}
                    open={true}
                    onCancel={closeModal}
                    footer={null}
                    width="90%"
                    centered
                    maskClosable={false}
                    styles={{
                        content: {
                            height: '90vh'
                        }
                    }}
                >
                    <MediaModalContent
                        {...modalConfig}
                        closeModal={closeModal}
                    />
                </Modal>
            )}
        </MediaModalContext.Provider>
    );
};

export const useMediaModal = () => {
    const context = useContext(MediaModalContext);
    if (!context) {
        throw new Error('useMediaModal must be used within a MediaModalProvider');
    }
    return context;
};
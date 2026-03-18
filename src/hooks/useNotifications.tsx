import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { notification as antdNotification } from 'antd';
import axios from '../utils/axiosInceptor';
import { getNotificationWsUrl } from '../configs/env.config';

interface NotificationData {
    id?: string;
    message?: string;
    [key: string]: any;
}

export const useNotifications = (userId?: string) => {
    const [socket, setSocket] = useState<typeof Socket | null>(null);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!userId) return;

        // Using environment variable for WebSocket URL
        const WS_URL = getNotificationWsUrl();

        const newSocket: any = io(WS_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to notification service');
            setIsConnected(true);
            newSocket.emit('register', { userId: String(userId) });
            setIsLoading(false);
            axios
                .get(`notifications`)
                .then((res: any) => {
                    setNotifications(Object.values(res?.data?.data));
                })
                .catch(() => {
                    // Handle error notification
                });
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from notification service');
            setIsConnected(false);
        });

        newSocket.on('newNotification', (data: any) => {
            console.log('📩 Received notification:', data);
            const notif = data.notification;

            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((prev) => prev + 1);

            antdNotification.open({
                message: notif.title || 'New Notification',
                description: notif.message || 'You have a new update!',
                placement: 'topRight',
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    return {
        socket,
        notifications,
        unreadCount,
        isConnected,
        isLoading,
        setNotifications,
        setUnreadCount,
    };
};

// app/services/notification.service.ts
export interface Notification {
    notificationId: string;
    userId: string;
    type: string;
    entityId?: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }
  
  let notifications: Notification[] = [];
  
  export const notificationService = {
    async createNotification(notificationData: {
      userId: string;
      type: string;
      message: string;
      entityId?: string;
    }) {
      const newNotification: Notification = {
        notificationId: crypto.randomUUID(),
        ...notificationData,
        isRead: false,
        createdAt: new Date(),
      };
  
      notifications.push(newNotification);
      return newNotification;
    },
  
    async markAsRead(notificationId: string) {
      const notification = notifications.find(n => n.notificationId === notificationId);
      if (!notification) return null;
      
      notification.isRead = true;
      return notification;
    },
  
    async getUserNotifications(userId: string) {
      return notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
  };
  
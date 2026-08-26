import { storageService } from './storageService';
import { lunarService } from './lunarService';

const getTodayNotifiedKey = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  return `anlich_notified_${todayStr}`;
};

const getNotifiedMap = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(getTodayNotifiedKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const markAsNotified = (eventId: string) => {
  try {
    const map = getNotifiedMap();
    map[eventId] = true;
    localStorage.setItem(getTodayNotifiedKey(), JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save notification state', e);
  }
};

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    // 1. Electron Desktop Environment
    if (typeof window !== 'undefined' && (window as any).electronAPI?.showNotification) {
      return true;
    }
    // 2. Web Browser Environment
    if (!('Notification' in window)) {
      console.log('Browser does not support desktop notification');
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  sendNotification(title: string, body: string, icon?: string): void {
    const settings = storageService.getSettings();
    if (!settings.notificationsEnabled) return;

    // 1. Desktop Electron App Native System Notification
    if (typeof window !== 'undefined' && (window as any).electronAPI?.showNotification) {
      (window as any).electronAPI.showNotification({ title, body, icon: icon || '/favicon.ico' });
      return;
    }

    // 2. Web Browser Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: icon || '/favicon.ico',
            badge: '/favicon.ico',
          });
        }).catch(() => {
          new Notification(title, { body, icon: icon || '/favicon.ico' });
        });
      } else {
        new Notification(title, { body, icon: icon || '/favicon.ico' });
      }
    }
  },

  sendTestNotification(): void {
    this.sendNotification(
      '🔔 Thông Báo Mẫu - An Lịch AI',
      'Chức năng Nhắc Nhở Lễ Hội & Lịch Cá Nhân đang hoạt động bình thường trên thiết bị của bạn!'
    );
  },

  checkAndNotifyTodayEvents(): void {
    const today = new Date();
    const detail = lunarService.getDayDetail(today);
    const notifiedMap = getNotifiedMap();

    // Festival & Holiday Events Check (Today & Countdown Reminders)
    const allEvents = storageService.getEvents();
    allEvents.forEach((ev) => {
      if (!ev.notify) return;
      const eventKey = `festival_${ev.id}`;
      if (notifiedMap[eventKey]) return; // Skip if already notified today

      const { daysRemaining } = lunarService.getNextEventOccurrence(ev);
      
      if (daysRemaining === 0) {
        this.sendNotification(
          `🎉 Hôm Nay: ${ev.name}`,
          ev.description || `Hôm nay là ngày diễn ra ${ev.name}. An Lịch AI chúc bạn một ngày an lành!`
        );
        markAsNotified(eventKey);
      } else if (daysRemaining > 0 && daysRemaining <= 3) {
        this.sendNotification(
          `⏳ Sắp Đến Lễ Hội (Còn ${daysRemaining} ngày nữa)`,
          `📅 Ngày ${ev.name} sẽ diễn ra trong ${daysRemaining} ngày tới (${ev.description || 'Xem chi tiết trong app An Lịch AI'})`
        );
        markAsNotified(eventKey);
      }
    });

    // Check Personal Events Reminders (Dương & Âm Lịch)
    const personalEvents = storageService.getPersonalEvents();
    personalEvents.forEach((pe) => {
      if (!pe.notify) return;
      const personalKey = `personal_${pe.id}`;
      if (notifiedMap[personalKey]) return; // Skip if already notified today

      const remindDays = pe.remindBeforeDays || 0;

      if (pe.isLunar) {
        let dayDiff = pe.day - detail.lunarDay;
        if (pe.month === detail.lunarMonth) {
          if (dayDiff === 0) {
            this.sendNotification(
              `📌 Lịch Cá Nhân Hôm Nay: ${pe.title}`,
              `📅 Hôm nay (${pe.day}/${pe.month} Âm Lịch): ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
            markAsNotified(personalKey);
          } else if (dayDiff > 0 && dayDiff <= remindDays) {
            this.sendNotification(
              `🔔 Nhắc Nhở Lịch Cá Nhân (${dayDiff} ngày nữa)`,
              `📅 Ngày ${pe.day}/${pe.month} Âm Lịch: ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
            markAsNotified(personalKey);
          }
        }
      } else {
        let dayDiff = pe.day - detail.solarDay;
        if (pe.month === detail.solarMonth) {
          if (dayDiff === 0) {
            this.sendNotification(
              `📌 Lịch Cá Nhân Hôm Nay: ${pe.title}`,
              `📅 Hôm nay (${pe.day}/${pe.month} Dương Lịch): ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
            markAsNotified(personalKey);
          } else if (dayDiff > 0 && dayDiff <= remindDays) {
            this.sendNotification(
              `🔔 Nhắc Nhở Lịch Cá Nhân (${dayDiff} ngày nữa)`,
              `📅 Ngày ${pe.day}/${pe.month} Dương Lịch: ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
            markAsNotified(personalKey);
          }
        }
      }
    });
  }
};

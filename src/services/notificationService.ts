import { storageService } from './storageService';
import { lunarService } from './lunarService';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
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

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
      });
    }
  },

  checkAndNotifyTodayEvents(): void {
    const today = new Date();
    const detail = lunarService.getDayDetail(today);

    // Festival & Holiday Events Check
    if (detail.events && detail.events.length > 0) {
      detail.events.forEach((ev) => {
        this.sendNotification(
          `🔔 Lễ Hội Hôm Nay: ${ev.name}`,
          ev.description || `Hôm nay là ${ev.name}. Chúc bạn một ngày may mắn!`
        );
      });
    }

    // Check Personal Events Reminders (Dương & Âm Lịch)
    const personalEvents = storageService.getPersonalEvents();
    personalEvents.forEach((pe) => {
      if (!pe.notify) return;

      // Target event date for current year
      const remindDays = pe.remindBeforeDays || 0;

      if (pe.isLunar) {
        // Calculate difference in lunar days
        let dayDiff = pe.day - detail.lunarDay;
        if (pe.month === detail.lunarMonth) {
          if (dayDiff === 0) {
            this.sendNotification(
              `📌 Lịch Cá Nhân Hôm Nay: ${pe.title}`,
              `📅 Hôm nay (${pe.day}/${pe.month} Âm Lịch): ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
          } else if (dayDiff > 0 && dayDiff <= remindDays) {
            this.sendNotification(
              `🔔 Nhắc Nhở Lịch Cá Nhân (${dayDiff} ngày nữa)`,
              `📅 Ngày ${pe.day}/${pe.month} Âm Lịch: ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
          }
        }
      } else {
        // Solar date calculation
        let dayDiff = pe.day - detail.solarDay;
        if (pe.month === detail.solarMonth) {
          if (dayDiff === 0) {
            this.sendNotification(
              `📌 Lịch Cá Nhân Hôm Nay: ${pe.title}`,
              `📅 Hôm nay (${pe.day}/${pe.month} Dương Lịch): ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
          } else if (dayDiff > 0 && dayDiff <= remindDays) {
            this.sendNotification(
              `🔔 Nhắc Nhở Lịch Cá Nhân (${dayDiff} ngày nữa)`,
              `📅 Ngày ${pe.day}/${pe.month} Dương Lịch: ${pe.title}${pe.note ? ' - ' + pe.note : ''}`
            );
          }
        }
      }
    });
  }
};

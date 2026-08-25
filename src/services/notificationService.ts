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

    // Festival & Holiday Events Check (Today & Countdown Reminders)
    const allEvents = storageService.getEvents();
    allEvents.forEach((ev) => {
      if (!ev.notify) return;
      const { daysRemaining } = lunarService.getNextEventOccurrence(ev);
      
      if (daysRemaining === 0) {
        this.sendNotification(
          `🎉 Hôm Nay: ${ev.name}`,
          ev.description || `Hôm nay là ngày diễn ra ${ev.name}. An Lịch AI chúc bạn một ngày an lành!`
        );
      } else if (daysRemaining > 0 && daysRemaining <= 3) {
        this.sendNotification(
          `⏳ Sắp Đến Lễ Hội (Còn ${daysRemaining} ngày nữa)`,
          `📅 Ngày ${ev.name} sẽ diễn ra trong ${daysRemaining} ngày tới (${ev.description || 'Xem chi tiết trong app An Lịch AI'})`
        );
      }
    });

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

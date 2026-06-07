import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#22C55E',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted!');
      return false;
    }
    return true;
  }

  static async scheduleMealReminders(enabled: boolean, mealTimes: { breakfast: string, lunch: string, dinner: string }) {
    if (Platform.OS === 'web') return;

    // First cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!enabled) return;

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      alert('Увімкніть дозволи на сповіщення в налаштуваннях телефону, щоб отримувати нагадування.');
      return;
    }

    // Schedule new ones
    await this.scheduleDailyReminder('breakfast', mealTimes.breakfast, 'Сніданок 🍳', 'Час для смачного і корисного сніданку!');
    await this.scheduleDailyReminder('lunch', mealTimes.lunch, 'Обід 🥗', 'Не забудьте відсканувати свій обід!');
    await this.scheduleDailyReminder('dinner', mealTimes.dinner, 'Вечеря 🍲', 'Час вечеряти! Запишіть калорії у щоденник.');
  }

  private static async scheduleDailyReminder(id: string, timeStr: string, title: string, body: string) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
      identifier: `meal-reminder-${id}`,
    });
  }
}

export class NotificationService {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications");
      return false;
    }
    
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  static showNotification(title, options = {}) {
    if (!("Notification" in window)) {
      this.showAlert(title, 'info');
      return;
    }

    if (Notification.permission === "granted") {
      try {
        return new Notification(title, {
          icon: '/logo192.png',
          badge: '/logo192.png',
          ...options,
        });
      } catch (error) {
        console.error("Error showing notification:", error);
        this.showAlert(title, 'info');
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          this.showNotification(title, options);
        } else {
          this.showAlert(title, 'info');
        }
      });
    }
  }

  static showAlert(message, type = 'info', duration = 3000) {
    const existingAlert = document.querySelector('.floating-alert');
    if (existingAlert) {
      document.body.removeChild(existingAlert);
    }

    const alertElement = document.createElement('div');
    alertElement.className = 'floating-alert';
    alertElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background-color: var(--bg-${type});
      color: white;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;
    alertElement.textContent = message;

    document.body.appendChild(alertElement);
    
    requestAnimationFrame(() => {
      alertElement.style.opacity = '1';
    });

    setTimeout(() => {
      alertElement.style.opacity = '0';
      setTimeout(() => {
        if (alertElement.parentNode) {
          document.body.removeChild(alertElement);
        }
      }, 300);
    }, duration);
  }
} 
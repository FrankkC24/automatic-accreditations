/**
 * Notification system for the application
 */
class NotificationSystem {
    constructor() {
      this.container = null;
      this.notifications = [];
    }
    
    /**
     * Initialize the notification system
     */
    init() {
      this.container = document.getElementById('notification-container');
      if (!this.container) {
        console.error('No se ha encontrado el contenedor de notificaciones');
      }
    }
    
    /**
     * Create a notification
     * @param {Object} options - Notification options
     * @param {string} options.type - Notification type ('success', 'error', 'info', 'warning')
     * @param {string} options.title - Notification title
     * @param {string} options.message - Notification message
     * @param {number} [options.duration=5000] - Notification duration in ms
     * @returns {Object} - Notification object
     */
    create({ type = 'info', title, message, duration = 5000 }) {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      
      // Determine icon based on type
      let iconHtml = '';
      switch (type) {
        case 'success':
          iconHtml = '✓';
          break;
        case 'error':
          iconHtml = '✕';
          break;
        case 'warning':
          iconHtml = '⚠';
          break;
        default:
          iconHtml = 'ℹ';
      }
      
      // Create HTML content
      notification.innerHTML = `
        <div class="notification-icon">${iconHtml}</div>
        <div class="notification-content">
          <div class="notification-title">${title}</div>
          <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close">✕</button>
        <div class="notification-progress">
          <div class="notification-progress-bar"></div>
        </div>
      `;
      
      // Add notification to DOM
      this.container.appendChild(notification);
      
      // Add close button event
      const closeButton = notification.querySelector('.notification-close');
      closeButton.addEventListener('click', () => this.remove(notification));
      
      // Show notification after small delay (for animation)
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      // Configure progress bar
      const progressBar = notification.querySelector('.notification-progress-bar');
      progressBar.style.transition = `width ${duration}ms linear`;
      
      setTimeout(() => {
        progressBar.style.width = '0';
      }, 100);
      
      // Set auto-hide timeout
      const timeoutId = setTimeout(() => {
        this.remove(notification);
      }, duration);
      
      // Store notification reference
      const notificationObj = { element: notification, timeoutId };
      this.notifications.push(notificationObj);
      
      return notificationObj;
    }
    
    /**
     * Remove a notification
     * @param {HTMLElement} notificationElement - Notification element to remove
     */
    remove(notificationElement) {
      if (!notificationElement) return;
      
      // Find notification index
      const index = this.notifications.findIndex(n => n.element === notificationElement);
      if (index !== -1) {
        // Clear timeout
        clearTimeout(this.notifications[index].timeoutId);
        
        // Remove from array
        this.notifications.splice(index, 1);
      }
      
      // Animate out
      notificationElement.classList.remove('show');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (notificationElement.parentNode) {
          notificationElement.parentNode.removeChild(notificationElement);
        }
      }, 400);
    }
    
    /**
     * Create a success notification
     * @param {string} message - Notification message
     * @param {string} [title='Success'] - Notification title
     * @param {number} [duration=5000] - Notification duration in ms
     * @returns {Object} - Notification object
     */
    success(message, title = 'Realizado', duration = 5000) {
      return this.create({ type: 'success', title, message, duration });
    }
    
    /**
     * Create an error notification
     * @param {string|Array} message - Error message or array of error messages
     * @param {string} [title='Error'] - Notification title
     * @param {number} [duration=5000] - Notification duration in ms
     * @returns {Object} - Notification object
     */
    error(message, title = 'Error', duration = 5000) {
      // If message is an array, format it as a list
      if (Array.isArray(message)) {
        if (message.length > 1) {
          let formattedMessage = '<ul style="margin: 0; padding-left: 20px;">';
          message.forEach(error => {
            formattedMessage += `<li>${error}</li>`;
          });
          formattedMessage += '</ul>';
          
          return this.create({ 
            type: 'error', 
            title: `${message.length} errores encontrados`,
            message: formattedMessage, 
            duration 
          });
        } else if (message.length === 1) {
          return this.create({ type: 'error', title, message: message[0], duration });
        } else {
          return null;
        }
      }
      
      return this.create({ type: 'error', title, message, duration });
    }
    
    /**
     * Create an info notification
     * @param {string} message - Notification message
     * @param {string} [title='Information'] - Notification title
     * @param {number} [duration=5000] - Notification duration in ms
     * @returns {Object} - Notification object
     */
    info(message, title = 'Información', duration = 5000) {
      return this.create({ type: 'info', title, message, duration });
    }
    
    /**
     * Create a warning notification
     * @param {string} message - Notification message
     * @param {string} [title='Warning'] - Notification title
     * @param {number} [duration=5000] - Notification duration in ms
     * @returns {Object} - Notification object
     */
    warning(message, title = 'Advertencia', duration = 5000) {
      return this.create({ type: 'warning', title, message, duration });
    }
  }
  
  // Create and export singleton instance
  const notifications = new NotificationSystem();
  export default notifications;
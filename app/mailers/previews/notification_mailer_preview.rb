# frozen_string_literal: true

require "ostruct"

# Preview all emails at http://localhost:8888/rails/mailers/notification_mailer
class NotificationMailerPreview < ActionMailer::Preview
  def activity_alert
    NotificationMailer.activity_alert(preview_user, sample_activity)
  end

  def activity_alert_dark
    NotificationMailer.activity_alert(preview_user(dark_mode: true), sample_activity)
  end

  def status_update
    NotificationMailer.status_update(preview_user, sample_status)
  end

  def status_update_claude
    NotificationMailer.status_update(preview_user(theme: "claude"), sample_status)
  end

  def reminder
    NotificationMailer.reminder(preview_user, sample_reminder)
  end

  def reminder_myfoodlink
    NotificationMailer.reminder(preview_user(theme: "myfoodlink"), sample_reminder)
  end

  def security_alert
    NotificationMailer.security_alert(preview_user, sample_security_event)
  end

  def security_alert_blackpink_dark
    NotificationMailer.security_alert(preview_user(theme: "blackpink", dark_mode: true), sample_security_event)
  end

  def invoice
    NotificationMailer.invoice(preview_user, sample_invoice)
  end

  def invoice_dark
    NotificationMailer.invoice(preview_user(dark_mode: true), sample_invoice)
  end

  private

  def preview_user(theme: "default", dark_mode: false)
    OpenStruct.new(
      name: "Preview User",
      email: "preview@example.com",
      theme_preference: theme,
      dark_mode?: dark_mode,
      unsubscribe_token: "preview_unsubscribe_token"
    )
  end

  def sample_activity
    {
      type: "New login detected",
      description: "Your account was accessed from Chrome on macOS in San Francisco, CA.",
      timestamp: Time.current,
      url: "http://localhost:8888/security"
    }
  end

  def sample_status
    {
      item_type: "Order #12345",
      previous: "Processing",
      current: "Shipped",
      url: "http://localhost:8888/orders/12345"
    }
  end

  def sample_reminder
    {
      subject: "Complete your profile",
      message: "Add a profile photo and bio to help others find you. Your profile is 60% complete.",
      url: "http://localhost:8888/profile/edit"
    }
  end

  def sample_security_event
    {
      type: "Suspicious login attempt",
      ip_address: "192.168.1.100",
      location: "San Francisco, CA",
      device: "Chrome on Windows",
      timestamp: Time.current,
      secure_url: "http://localhost:8888/security/settings"
    }
  end

  def sample_invoice
    {
      number: "INV-2024-001",
      amount: "$99.00",
      date: Date.current,
      description: "Pro Plan - Monthly Subscription",
      url: "http://localhost:8888/invoices/INV-2024-001"
    }
  end
end

# frozen_string_literal: true

# Mailer for notification emails (system-triggered alerts and updates)
# Emails: activity_alert, status_update, reminder, security_alert, invoice
class NotificationMailer < ApplicationMailer
  # Notify user of new activity on their account
  # @param user [User] User to notify
  # @param activity [Hash] Activity details (type, description, occurred_at)
  def activity_alert(user, activity)
    set_theme_from_user(user)
    @user = user
    @activity = activity
    @header_title = "Activity Alert"
    mail(to: user.email, subject: "New activity on your account")
  end

  # Notify user of status change
  # @param user [User] User to notify
  # @param status [Hash] Status details (previous, current, changed_at)
  def status_update(user, status)
    set_theme_from_user(user)
    @user = user
    @status = status
    @header_title = "Status Update"
    mail(to: user.email, subject: "Your status has been updated")
  end

  # Send reminder to user
  # @param user [User] User to remind
  # @param reminder [Hash] Reminder details (subject, message, due_at)
  def reminder(user, reminder)
    set_theme_from_user(user)
    @user = user
    @reminder = reminder
    @header_title = "Reminder"
    subject = reminder.respond_to?(:subject) ? reminder.subject : reminder[:subject] || "Reminder"
    mail(to: user.email, subject: subject)
  end

  # Alert user of security-related events
  # @param user [User] User to alert
  # @param event [Hash] Security event (type, ip_address, location, occurred_at)
  def security_alert(user, event)
    set_theme_from_user(user)
    @user = user
    @event = event
    @header_title = "Security Alert"
    mail(to: user.email, subject: "Security alert for your account")
  end

  # Send invoice/receipt to user
  # @param user [User] User to invoice
  # @param invoice [Hash] Invoice details (number, amount, items, date)
  def invoice(user, invoice)
    set_theme_from_user(user)
    @user = user
    @invoice = invoice
    @header_title = "Invoice"
    invoice_number = invoice.respond_to?(:number) ? invoice.number : invoice[:number] || "N/A"
    mail(to: user.email, subject: "Invoice ##{invoice_number}")
  end
end

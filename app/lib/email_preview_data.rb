# frozen_string_literal: true

require "ostruct"

# Mock data for email template previews in the playground
module EmailPreviewData
  class << self
    def mock_user(theme: "default", dark_mode: false)
      OpenStruct.new(
        name: "Test User",
        email: "test@example.com",
        theme_preference: theme,
        dark_mode?: dark_mode,
        unsubscribe_token: "mock_token_123"
      )
    end

    def for_email(email_type)
      case email_type
      when "password_reset"
        {token: "reset_token_abc123"}
      when "email_verification"
        {token: "verify_token_xyz789"}
      when "magic_login"
        {token: "magic_token_def456"}
      when "welcome", "account_verified", "account_deleted"
        {}
      when "activity_alert"
        {
          activity: {
            type: "New login detected",
            description: "Your account was accessed from a new device in San Francisco, CA.",
            timestamp: Time.current,
            url: "http://localhost:8888/security"
          }
        }
      when "status_update"
        {
          status: {
            item_type: "order",
            previous: "Processing",
            current: "Shipped",
            url: "http://localhost:8888/orders/123"
          }
        }
      when "reminder"
        {
          reminder: {
            message: "Complete your profile to unlock all features. Add a profile photo and bio to help others find you.",
            subject: "Don't forget to complete your profile",
            url: "http://localhost:8888/profile/edit"
          }
        }
      when "security_alert"
        {
          event: {
            type: "Suspicious login attempt",
            ip_address: "192.168.1.100",
            location: "San Francisco, CA",
            device: "Chrome on Windows",
            timestamp: Time.current,
            secure_url: "http://localhost:8888/security/settings"
          }
        }
      when "invoice"
        {
          invoice: {
            number: "INV-2024-001",
            amount: "$99.00",
            date: Date.current,
            description: "Pro Plan - Monthly Subscription",
            url: "http://localhost:8888/invoices/INV-2024-001"
          }
        }
      when "newsletter"
        {
          newsletter: {
            title: "Monthly Update - December 2024",
            subject: "Your December Newsletter",
            body: "We've been busy shipping new features and improvements. Here's what's new this month.",
            cta_url: "http://localhost:8888/changelog",
            cta_text: "View Changelog"
          }
        }
      when "promotion"
        {
          promotion: {
            title: "Black Friday Sale!",
            subject: "50% Off - Limited Time!",
            description: "Our biggest sale of the year is here. Get 50% off all plans for a limited time.",
            discount: "50% OFF",
            code: "BLACKFRIDAY50",
            expires_at: 1.week.from_now,
            cta_url: "http://localhost:8888/pricing",
            terms: "Valid for new customers only. Cannot be combined with other offers."
          }
        }
      when "announcement"
        {
          announcement: {
            title: "Introducing Teams!",
            subject: "New Feature: Teams is here!",
            body: "We're excited to announce our new Teams feature. Collaborate with your colleagues, share resources, and work together seamlessly.",
            features: [
              "Shared workspaces for your team",
              "Real-time collaboration on documents",
              "Team-wide notifications and activity feed",
              "Admin controls and permissions"
            ],
            cta_url: "http://localhost:8888/teams"
          }
        }
      when "product_update"
        {
          update: {
            version: "2.5.0",
            intro: "We've been busy improving the product. Here's what's new in this release:",
            features: [
              "New dashboard with real-time analytics",
              "Dark mode support across all pages",
              "Improved search with filters"
            ],
            improvements: [
              "Faster page load times",
              "Better mobile experience",
              "Reduced memory usage"
            ],
            bug_fixes: [
              "Fixed notification badge not updating",
              "Resolved issue with file uploads",
              "Fixed timezone display in reports"
            ],
            changelog_url: "http://localhost:8888/changelog/2.5.0"
          }
        }
      else
        {}
      end
    end
  end
end

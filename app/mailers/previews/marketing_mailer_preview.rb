# frozen_string_literal: true

require "ostruct"

# Preview all emails at http://localhost:8888/rails/mailers/marketing_mailer
class MarketingMailerPreview < ActionMailer::Preview
  def newsletter
    MarketingMailer.newsletter(preview_user, sample_newsletter)
  end

  def newsletter_dark
    MarketingMailer.newsletter(preview_user(dark_mode: true), sample_newsletter)
  end

  def newsletter_claude
    MarketingMailer.newsletter(preview_user(theme: "claude"), sample_newsletter)
  end

  def promotion
    MarketingMailer.promotion(preview_user, sample_promotion)
  end

  def promotion_blackpink
    MarketingMailer.promotion(preview_user(theme: "blackpink"), sample_promotion)
  end

  def promotion_dark
    MarketingMailer.promotion(preview_user(dark_mode: true), sample_promotion)
  end

  def announcement
    MarketingMailer.announcement(preview_user, sample_announcement)
  end

  def announcement_myfoodlink
    MarketingMailer.announcement(preview_user(theme: "myfoodlink"), sample_announcement)
  end

  def product_update
    MarketingMailer.product_update(preview_user, sample_product_update)
  end

  def product_update_claude_dark
    MarketingMailer.product_update(preview_user(theme: "claude", dark_mode: true), sample_product_update)
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

  def sample_newsletter
    {
      title: "December Newsletter",
      subject: "What's New This Month",
      body: "We've been busy shipping new features and improvements. Here's what's new this month."
    }
  end

  def sample_promotion
    {
      title: "Holiday Sale - 40% Off!",
      subject: "Limited Time: 40% Off Everything!",
      description: "Celebrate the season with our biggest discount yet. Use code HOLIDAY40 at checkout.",
      discount: "40% OFF",
      code: "HOLIDAY40",
      expires_at: 2.weeks.from_now,
      terms: "Valid for new annual subscriptions only. Cannot be combined with other offers."
    }
  end

  def sample_announcement
    {
      title: "Introducing Dark Mode",
      subject: "New Feature: Dark Mode is Here!",
      body: "You asked, we delivered! Dark mode is now available across all platforms.",
      features: [
        "Automatic detection based on system preferences",
        "Manual toggle in settings",
        "Consistent across web and mobile",
        "Easy on the eyes, day or night"
      ],
      url: "http://localhost:8888/settings/appearance"
    }
  end

  def sample_product_update
    {
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
  end
end

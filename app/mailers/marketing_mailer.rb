# frozen_string_literal: true

# Mailer for marketing emails (promotional content, newsletters)
# Emails: newsletter, promotion, announcement, product_update
class MarketingMailer < ApplicationMailer
  # Send newsletter to user
  # @param user [User] Recipient
  # @param newsletter [Hash] Newsletter content (title, subject, body, cta_url)
  def newsletter(user, newsletter)
    set_theme_from_user(user)
    @user = user
    @newsletter = newsletter
    @header_title = extract_attr(newsletter, :title) || "Newsletter"
    set_unsubscribe_url(user)
    mail(to: user.email, subject: extract_attr(newsletter, :subject) || "Our Latest Newsletter")
  end

  # Send promotional email
  # @param user [User] Recipient
  # @param promotion [Hash] Promotion details (title, subject, discount, expires_at, cta_url)
  def promotion(user, promotion)
    set_theme_from_user(user)
    @user = user
    @promotion = promotion
    @header_title = "Special Offer"
    set_unsubscribe_url(user)
    mail(to: user.email, subject: extract_attr(promotion, :subject) || "Special Offer Just for You")
  end

  # Send announcement to user
  # @param user [User] Recipient
  # @param announcement [Hash] Announcement details (title, subject, body, cta_url)
  def announcement(user, announcement)
    set_theme_from_user(user)
    @user = user
    @announcement = announcement
    @header_title = "Announcement"
    set_unsubscribe_url(user)
    mail(to: user.email, subject: extract_attr(announcement, :subject) || "Important Announcement")
  end

  # Send product update / release notes
  # @param user [User] Recipient
  # @param update [Hash] Update details (version, features, improvements, fixes, cta_url)
  def product_update(user, update)
    set_theme_from_user(user)
    @user = user
    @update = update
    @header_title = "Product Update"
    set_unsubscribe_url(user)
    version = extract_attr(update, :version)
    subject = version ? "What's New in Version #{version}" : "Product Update"
    mail(to: user.email, subject: subject)
  end

  private

  def set_unsubscribe_url(user)
    token = user.respond_to?(:unsubscribe_token) ? user.unsubscribe_token : nil
    @unsubscribe_url = token ? "#{root_url}unsubscribe?token=#{url_encode(token)}" : "#"
  end

  def extract_attr(obj, attr)
    obj.respond_to?(attr) ? obj.send(attr) : obj[attr]
  end
end

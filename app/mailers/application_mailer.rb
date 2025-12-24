# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "noreply@example.com"
  layout "mailer"
  helper EmailIconHelper

  helper_method :email_colors, :email_theme, :email_mode

  private

  # Theme colors for current email (HEX values)
  def email_colors
    @email_colors ||= EmailTheme.colors(theme: email_theme, mode: email_mode)
  end

  # Current theme name (override in mailer or pass as param)
  def email_theme
    @email_theme || "default"
  end

  # Current color mode (override in mailer or pass as param)
  def email_mode
    @email_mode || "light"
  end

  # Set theme/mode for this email
  # @param theme [String] Theme name (default, claude, blackpink, myfoodlink)
  # @param mode [String] Color mode (light, dark)
  def with_theme(theme: "default", mode: "light")
    @email_theme = EmailTheme.valid_theme?(theme) ? theme : "default"
    @email_mode = EmailTheme.valid_mode?(mode) ? mode : "light"
  end

  # Set theme from user's preferences
  # @param user [User] User object with theme_preference and dark_mode? methods
  def set_theme_from_user(user)
    theme = user.respond_to?(:theme_preference) ? user.theme_preference : "default"
    mode = user.respond_to?(:dark_mode?) && user.dark_mode? ? "dark" : "light"
    with_theme(theme: theme || "default", mode: mode)
  end

  # Base URL for email links
  def root_url
    host = Rails.application.routes.default_url_options[:host] || "http://localhost:3000"
    host.end_with?("/") ? host : "#{host}/"
  end

  # URL-safe encode for query parameters
  def url_encode(value)
    CGI.escape(value.to_s)
  end

  # Validate and sanitize URL for email href attributes
  # Aligns with frontend link-utils.ts SAFE_HREF_PATTERN
  # Allowed: https, http, mailto, tel, # anchors
  # Note: Unlike frontend, we don't allow / paths since emails render outside app
  def safe_email_url(url)
    return "#" if url.blank?
    url.to_s.match?(/\A(https?:\/\/|mailto:|tel:|#)/i) ? url.to_s : "#"
  end
end

# frozen_string_literal: true

# Mailer for transactional emails (account-related, triggered by user actions)
# Emails: password_reset, email_verification, welcome, magic_login, account_verified, account_deleted
class TransactionalMailer < ApplicationMailer
  # Password reset email with secure token link
  # @param user [User] User requesting password reset
  # @param token [String] Password reset token
  def password_reset(user, token)
    set_theme_from_user(user)
    @user = user
    @reset_url = password_reset_url_for(token)
    @header_title = "Reset Your Password"
    mail(to: user.email, subject: "Reset your password")
  end

  # Email verification for new accounts
  # @param user [User] User to verify
  # @param token [String] Verification token
  def email_verification(user, token)
    set_theme_from_user(user)
    @user = user
    @verification_url = verification_url_for(token)
    @header_title = "Verify Your Email"
    mail(to: user.email, subject: "Verify your email address")
  end

  # Welcome email for new users
  # @param user [User] New user
  def welcome(user)
    set_theme_from_user(user)
    @user = user
    @header_title = "Welcome!"
    mail(to: user.email, subject: "Welcome to the app!")
  end

  # Passwordless magic link login
  # @param user [User] User requesting login link
  # @param token [String] Magic link token
  def magic_login(user, token)
    set_theme_from_user(user)
    @user = user
    @login_url = magic_login_url_for(token)
    @header_title = "Sign In"
    mail(to: user.email, subject: "Your sign-in link")
  end

  # Account verification success confirmation
  # @param user [User] Verified user
  def account_verified(user)
    set_theme_from_user(user)
    @user = user
    @header_title = "Account Verified"
    mail(to: user.email, subject: "Your account has been verified")
  end

  # Account deletion confirmation
  # @param user [User] Deleted user
  def account_deleted(user)
    set_theme_from_user(user)
    @user = user
    @header_title = "Account Deleted"
    mail(to: user.email, subject: "Your account has been deleted")
  end

  private

  # URL helpers - override these in a concern or config for real URLs
  def password_reset_url_for(token)
    "#{root_url}password_reset?token=#{url_encode(token)}"
  end

  def verification_url_for(token)
    "#{root_url}verify_email?token=#{url_encode(token)}"
  end

  def magic_login_url_for(token)
    "#{root_url}auth/magic?token=#{url_encode(token)}"
  end
end

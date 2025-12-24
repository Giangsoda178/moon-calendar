# frozen_string_literal: true

require "ostruct"

# Preview all emails at http://localhost:8888/rails/mailers/transactional_mailer
class TransactionalMailerPreview < ActionMailer::Preview
  def password_reset
    TransactionalMailer.password_reset(preview_user, "preview_reset_token_123")
  end

  def password_reset_dark
    TransactionalMailer.password_reset(preview_user(dark_mode: true), "preview_reset_token_123")
  end

  def password_reset_claude
    TransactionalMailer.password_reset(preview_user(theme: "claude"), "preview_reset_token_123")
  end

  def email_verification
    TransactionalMailer.email_verification(preview_user, "verify_token_xyz789")
  end

  def email_verification_myfoodlink
    TransactionalMailer.email_verification(preview_user(theme: "myfoodlink"), "verify_token_xyz789")
  end

  def magic_login
    TransactionalMailer.magic_login(preview_user, "magic_token_def456")
  end

  def magic_login_blackpink_dark
    TransactionalMailer.magic_login(preview_user(theme: "blackpink", dark_mode: true), "magic_token_def456")
  end

  def welcome
    TransactionalMailer.welcome(preview_user)
  end

  def welcome_claude_dark
    TransactionalMailer.welcome(preview_user(theme: "claude", dark_mode: true))
  end

  def account_verified
    TransactionalMailer.account_verified(preview_user)
  end

  def account_deleted
    TransactionalMailer.account_deleted(preview_user)
  end

  def account_deleted_dark
    TransactionalMailer.account_deleted(preview_user(dark_mode: true))
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
end

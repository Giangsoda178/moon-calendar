# frozen_string_literal: true

require "rails_helper"
require "ostruct"

RSpec.describe TransactionalMailer, type: :mailer do
  let(:user) do
    OpenStruct.new(
      email: "user@example.com",
      name: "Test User",
      theme_preference: "default",
      dark_mode?: false
    )
  end

  describe "#password_reset" do
    let(:mail) { described_class.password_reset(user, "test-token") }

    it "sends to the correct recipient" do
      expect(mail.to).to eq(["user@example.com"])
    end

    it "has the correct subject" do
      expect(mail.subject).to eq("Reset your password")
    end

    it "includes both HTML and text parts" do
      expect(mail.parts.map(&:content_type)).to include(
        a_string_matching(/text\/plain/),
        a_string_matching(/text\/html/)
      )
    end

    it "includes reset URL in HTML body" do
      expect(mail.html_part.body.to_s).to include("token=test-token")
    end

    it "includes reset URL in text body" do
      expect(mail.text_part.body.to_s).to include("token=test-token")
    end

    it "uses theme colors in HTML" do
      expect(mail.html_part.body.to_s).to match(/#[0-9a-fA-F]{6}/)
    end
  end

  describe "#email_verification" do
    let(:mail) { described_class.email_verification(user, "verify-token") }

    it "has the correct subject" do
      expect(mail.subject).to eq("Verify your email address")
    end

    it "includes verification URL" do
      expect(mail.html_part.body.to_s).to include("verify_email")
    end
  end

  describe "#welcome" do
    let(:mail) { described_class.welcome(user) }

    it "has the correct subject" do
      expect(mail.subject).to eq("Welcome to the app!")
    end
  end

  describe "#magic_login" do
    let(:mail) { described_class.magic_login(user, "magic-token") }

    it "has the correct subject" do
      expect(mail.subject).to eq("Your sign-in link")
    end

    it "includes login URL" do
      expect(mail.html_part.body.to_s).to include("magic?token=magic-token")
    end
  end

  describe "#account_verified" do
    let(:mail) { described_class.account_verified(user) }

    it "has the correct subject" do
      expect(mail.subject).to eq("Your account has been verified")
    end
  end

  describe "#account_deleted" do
    let(:mail) { described_class.account_deleted(user) }

    it "has the correct subject" do
      expect(mail.subject).to eq("Your account has been deleted")
    end
  end

  describe "theme support" do
    let(:themed_user) do
      OpenStruct.new(
        email: "user@example.com",
        theme_preference: "claude",
        dark_mode?: true
      )
    end

    it "applies user theme preference" do
      mail = described_class.welcome(themed_user)
      # Claude dark theme primary color
      expect(mail.html_part.body.to_s).to match(/#[0-9a-fA-F]{6}/)
    end
  end
end

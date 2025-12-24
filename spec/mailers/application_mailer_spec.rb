# frozen_string_literal: true

require "rails_helper"
require "ostruct"

RSpec.describe ApplicationMailer, type: :mailer do
  # Test ApplicationMailer through TransactionalMailer which has templates
  describe "email theme integration" do
    let(:user) do
      OpenStruct.new(
        email: "test@example.com",
        theme_preference: "default",
        dark_mode?: false
      )
    end

    describe "#email_colors" do
      it "returns HEX colors" do
        mail = TransactionalMailer.welcome(user)
        # Theme colors should be present in HTML
        expect(mail.html_part.body.to_s).to match(/#[0-9a-fA-F]{6}/)
      end
    end

    describe "#with_theme" do
      it "accepts valid theme and mode" do
        themed_user = OpenStruct.new(
          email: "test@example.com",
          theme_preference: "claude",
          dark_mode?: true
        )
        mail = TransactionalMailer.welcome(themed_user)
        # Claude dark theme should render without error
        expect(mail.html_part.body.to_s).to be_present
      end

      it "falls back to default for invalid theme" do
        invalid_user = OpenStruct.new(
          email: "test@example.com",
          theme_preference: "invalid_theme",
          dark_mode?: false
        )
        # Should not raise error
        mail = TransactionalMailer.welcome(invalid_user)
        expect(mail.html_part.body.to_s).to be_present
      end

      it "falls back to light mode for invalid mode" do
        # OpenStruct won't have dark_mode? respond true for invalid values
        # This tests that nil/false dark_mode? results in light mode
        light_user = OpenStruct.new(
          email: "test@example.com",
          theme_preference: "default"
          # dark_mode? not defined = nil
        )
        mail = TransactionalMailer.welcome(light_user)
        expect(mail.html_part.body.to_s).to be_present
      end
    end
  end

  describe "#safe_email_url" do
    # Create a test mailer to access private method
    let(:mailer) { described_class.new }

    # Allowed protocols
    it "allows HTTPS URLs" do
      expect(mailer.send(:safe_email_url, "https://example.com")).to eq("https://example.com")
    end

    it "allows HTTP URLs (for development)" do
      expect(mailer.send(:safe_email_url, "http://localhost:3000")).to eq("http://localhost:3000")
      expect(mailer.send(:safe_email_url, "http://example.com")).to eq("http://example.com")
    end

    it "allows mailto links" do
      expect(mailer.send(:safe_email_url, "mailto:test@example.com")).to eq("mailto:test@example.com")
    end

    it "allows tel links" do
      expect(mailer.send(:safe_email_url, "tel:+1234567890")).to eq("tel:+1234567890")
    end

    it "allows anchor links" do
      expect(mailer.send(:safe_email_url, "#section")).to eq("#section")
    end

    # Blocked protocols (XSS vectors)
    it "blocks javascript: URLs" do
      expect(mailer.send(:safe_email_url, "javascript:alert('xss')")).to eq("#")
    end

    it "blocks data: URLs" do
      expect(mailer.send(:safe_email_url, "data:text/html,<script>alert('xss')</script>")).to eq("#")
    end

    it "blocks vbscript: URLs" do
      expect(mailer.send(:safe_email_url, "vbscript:msgbox('xss')")).to eq("#")
    end

    # Edge cases
    it "returns # for blank URLs" do
      expect(mailer.send(:safe_email_url, nil)).to eq("#")
      expect(mailer.send(:safe_email_url, "")).to eq("#")
    end

    it "blocks relative paths (emails render outside app)" do
      expect(mailer.send(:safe_email_url, "/users/1")).to eq("#")
      expect(mailer.send(:safe_email_url, "../admin")).to eq("#")
    end

    it "is case insensitive for protocol matching" do
      expect(mailer.send(:safe_email_url, "HTTPS://example.com")).to eq("HTTPS://example.com")
      expect(mailer.send(:safe_email_url, "JAVASCRIPT:alert('xss')")).to eq("#")
    end
  end
end

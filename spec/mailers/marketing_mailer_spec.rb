# frozen_string_literal: true

require "rails_helper"
require "ostruct"

RSpec.describe MarketingMailer, type: :mailer do
  let(:user) do
    OpenStruct.new(
      email: "user@example.com",
      name: "Test User",
      theme_preference: "default",
      dark_mode?: false,
      unsubscribe_token: "unsub-token"
    )
  end

  describe "#newsletter" do
    let(:newsletter) { {title: "Weekly Update", subject: "This Week's News", body: "Great content"} }
    let(:mail) { described_class.newsletter(user, newsletter) }

    it "sends to the correct recipient" do
      expect(mail.to).to eq(["user@example.com"])
    end

    it "has the correct subject" do
      expect(mail.subject).to eq("This Week's News")
    end

    it "includes newsletter content" do
      expect(mail.html_part.body.to_s).to include("Great content")
    end

    it "includes unsubscribe link" do
      expect(mail.html_part.body.to_s).to include("Unsubscribe")
    end
  end

  describe "#promotion" do
    let(:promotion) { {title: "50% Off", subject: "Special Sale", discount: "50% OFF"} }
    let(:mail) { described_class.promotion(user, promotion) }

    it "has the correct subject" do
      expect(mail.subject).to eq("Special Sale")
    end

    it "includes discount info" do
      expect(mail.html_part.body.to_s).to include("50% OFF")
    end
  end

  describe "#announcement" do
    let(:announcement) { {title: "Big News", subject: "Important Update", body: "We have exciting news!"} }
    let(:mail) { described_class.announcement(user, announcement) }

    it "has the correct subject" do
      expect(mail.subject).to eq("Important Update")
    end
  end

  describe "#product_update" do
    let(:update) { {version: "2.0", features: ["New dashboard", "Dark mode"]} }
    let(:mail) { described_class.product_update(user, update) }

    it "has version in subject" do
      expect(mail.subject).to eq("What's New in Version 2.0")
    end

    it "lists features" do
      expect(mail.html_part.body.to_s).to include("New dashboard")
      expect(mail.html_part.body.to_s).to include("Dark mode")
    end
  end

  describe "unsubscribe URL" do
    let(:newsletter) { {title: "Test", subject: "Test"} }

    context "when user has unsubscribe token" do
      let(:mail) { described_class.newsletter(user, newsletter) }

      it "includes token in unsubscribe URL" do
        expect(mail.html_part.body.to_s).to include("unsub-token")
      end
    end

    context "when user has no unsubscribe token" do
      let(:user_without_token) do
        OpenStruct.new(email: "user@example.com", theme_preference: "default", dark_mode?: false)
      end
      let(:mail) { described_class.newsletter(user_without_token, newsletter) }

      it "falls back to # for unsubscribe link" do
        expect(mail.html_part.body.to_s).to match(/href="#"/)
      end
    end
  end
end

# frozen_string_literal: true

require "rails_helper"
require "ostruct"

RSpec.describe NotificationMailer, type: :mailer do
  let(:user) do
    OpenStruct.new(
      email: "user@example.com",
      name: "Test User",
      theme_preference: "default",
      dark_mode?: false
    )
  end

  describe "#activity_alert" do
    let(:activity) { {type: "login", description: "New login detected"} }
    let(:mail) { described_class.activity_alert(user, activity) }

    it "sends to the correct recipient" do
      expect(mail.to).to eq(["user@example.com"])
    end

    it "has the correct subject" do
      expect(mail.subject).to eq("New activity on your account")
    end

    it "includes activity details in HTML" do
      expect(mail.html_part.body.to_s).to include("login")
    end
  end

  describe "#status_update" do
    let(:status) { {previous: "pending", current: "active"} }
    let(:mail) { described_class.status_update(user, status) }

    it "has the correct subject" do
      expect(mail.subject).to eq("Your status has been updated")
    end
  end

  describe "#reminder" do
    let(:reminder) { {subject: "Don't forget!", message: "Meeting at 3pm"} }
    let(:mail) { described_class.reminder(user, reminder) }

    it "uses reminder subject for email subject" do
      expect(mail.subject).to eq("Don't forget!")
    end

    it "includes reminder message" do
      expect(mail.html_part.body.to_s).to include("Meeting at 3pm")
    end
  end

  describe "#security_alert" do
    let(:event) { {type: "suspicious_login", ip_address: "192.168.1.1"} }
    let(:mail) { described_class.security_alert(user, event) }

    it "has the correct subject" do
      expect(mail.subject).to eq("Security alert for your account")
    end

    it "includes event details" do
      expect(mail.html_part.body.to_s).to include("192.168.1.1")
    end
  end

  describe "#invoice" do
    let(:invoice) { {number: "INV-001", amount: "$99.00"} }
    let(:mail) { described_class.invoice(user, invoice) }

    it "has the correct subject with invoice number" do
      expect(mail.subject).to eq("Invoice #INV-001")
    end

    it "includes invoice details" do
      expect(mail.html_part.body.to_s).to include("$99.00")
    end
  end
end

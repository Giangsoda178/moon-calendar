# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Playground Email API", type: :request do
  # Note: The Inertia page tests are skipped as they require Vite build
  # These tests focus on the JSON API endpoints for email preview and sending

  describe "GET /playground/emails/preview" do
    it "returns email HTML preview for welcome email" do
      get playground_email_preview_path, params: {email_type: "welcome", theme: "default", mode: "light"}

      expect(response).to have_http_status(:success)
      json = response.parsed_body
      expect(json["html"]).to include("Welcome")
      expect(json["email_type"]).to eq("welcome")
      expect(json["theme"]).to eq("default")
      expect(json["mode"]).to eq("light")
    end

    it "respects theme parameter" do
      get playground_email_preview_path, params: {email_type: "welcome", theme: "claude", mode: "light"}

      json = response.parsed_body
      expect(json["theme"]).to eq("claude")
      # HTML should include HEX color codes from the theme
      expect(json["html"]).to include("#")
    end

    it "respects dark mode parameter" do
      get playground_email_preview_path, params: {email_type: "welcome", theme: "default", mode: "dark"}

      json = response.parsed_body
      expect(json["mode"]).to eq("dark")
    end

    it "defaults to welcome email when type not specified" do
      get playground_email_preview_path

      json = response.parsed_body
      expect(json["email_type"]).to eq("welcome")
    end

    context "transactional emails" do
      %w[password_reset email_verification magic_login welcome account_verified account_deleted].each do |email_type|
        it "renders #{email_type} email successfully" do
          get playground_email_preview_path, params: {email_type: email_type}

          expect(response).to have_http_status(:success), "Failed for #{email_type}"
          json = response.parsed_body
          expect(json["email_type"]).to eq(email_type)
          expect(json["html"]).to be_present
        end
      end
    end

    context "notification emails" do
      %w[activity_alert status_update reminder security_alert invoice].each do |email_type|
        it "renders #{email_type} email successfully" do
          get playground_email_preview_path, params: {email_type: email_type}

          expect(response).to have_http_status(:success), "Failed for #{email_type}"
          json = response.parsed_body
          expect(json["email_type"]).to eq(email_type)
          expect(json["html"]).to be_present
        end
      end
    end

    context "marketing emails" do
      %w[newsletter promotion announcement product_update].each do |email_type|
        it "renders #{email_type} email successfully" do
          get playground_email_preview_path, params: {email_type: email_type}

          expect(response).to have_http_status(:success), "Failed for #{email_type}"
          json = response.parsed_body
          expect(json["email_type"]).to eq(email_type)
          expect(json["html"]).to be_present
        end
      end
    end

    context "with different themes" do
      EmailTheme::THEMES.each do |theme|
        it "renders with #{theme} theme" do
          get playground_email_preview_path, params: {email_type: "welcome", theme: theme}

          expect(response).to have_http_status(:success)
          json = response.parsed_body
          expect(json["theme"]).to eq(theme)
        end
      end
    end
  end

  describe "POST /playground/emails/send" do
    it "sends test email successfully" do
      post playground_send_test_email_path, params: {
        email_type: "welcome",
        theme: "default",
        mode: "light",
        recipient: "test@example.com"
      }

      expect(response).to have_http_status(:success)
    end

    it "sends email with specified theme and mode" do
      post playground_send_test_email_path, params: {
        email_type: "password_reset",
        theme: "claude",
        mode: "dark",
        recipient: "test@example.com"
      }

      expect(response).to have_http_status(:success)
    end

    it "returns error for invalid email type" do
      post playground_send_test_email_path, params: {email_type: "invalid_type"}

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["error"]).to be_present
    end

    context "transactional emails" do
      %w[password_reset email_verification magic_login welcome account_verified account_deleted].each do |email_type|
        it "sends #{email_type} email successfully" do
          post playground_send_test_email_path, params: {
            email_type: email_type,
            recipient: "test@example.com"
          }

          expect(response).to have_http_status(:success), "Failed to send #{email_type}"
        end
      end
    end

    context "notification emails" do
      %w[activity_alert status_update reminder security_alert invoice].each do |email_type|
        it "sends #{email_type} email successfully" do
          post playground_send_test_email_path, params: {
            email_type: email_type,
            recipient: "test@example.com"
          }

          expect(response).to have_http_status(:success), "Failed to send #{email_type}"
        end
      end
    end

    context "marketing emails" do
      %w[newsletter promotion announcement product_update].each do |email_type|
        it "sends #{email_type} email successfully" do
          post playground_send_test_email_path, params: {
            email_type: email_type,
            recipient: "test@example.com"
          }

          expect(response).to have_http_status(:success), "Failed to send #{email_type}"
        end
      end
    end
  end
end

# frozen_string_literal: true

require "rails_helper"

RSpec.describe EmailIconHelper do
  let(:helper_class) do
    Class.new do
      include EmailIconHelper

      def email_colors
        {foreground: "#000000"}
      end
    end
  end

  let(:helper) { helper_class.new }

  describe "#email_icon" do
    it "returns Base64-encoded img tag for valid icon" do
      result = helper.email_icon(:check)
      expect(result).to include("data:image/svg+xml;base64,")
      expect(result).to include('width="24"')
      expect(result).to include('alt="Check"')
    end

    it "applies custom size" do
      result = helper.email_icon(:check, size: 16)
      expect(result).to include('width="16"')
      expect(result).to include('height="16"')
    end

    it "applies custom color" do
      result = helper.email_icon(:check, color: "#FF0000")
      decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
      expect(decoded).to include('stroke="#FF0000"')
    end

    it "returns empty string for invalid icon" do
      expect(helper.email_icon(:nonexistent)).to eq("")
    end

    it "returns empty string for nil name" do
      expect(helper.email_icon(nil)).to eq("")
    end

    it "returns empty string for blank name" do
      expect(helper.email_icon("")).to eq("")
    end

    it "uses email_colors[:foreground] by default" do
      result = helper.email_icon(:check)
      decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
      expect(decoded).to include('stroke="#000000"')
    end

    it "renders social icons with fill attribute" do
      result = helper.email_icon(:linkedin, color: "#0A66C2")
      decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
      expect(decoded).to include('fill="#0A66C2"')
    end

    it "returns html_safe string" do
      result = helper.email_icon(:check)
      expect(result).to be_html_safe
    end

    it "includes proper inline styles" do
      result = helper.email_icon(:check)
      expect(result).to include('style="display: inline-block; vertical-align: middle;"')
    end

    context "security" do
      it "sanitizes invalid color to prevent XSS" do
        result = helper.email_icon(:check, color: '"><script>alert(1)</script><"')
        decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
        expect(decoded).not_to include("script")
        expect(decoded).to include('stroke="#000000"') # Falls back to default
      end

      it "accepts valid 3-char hex color" do
        result = helper.email_icon(:check, color: "#FFF")
        decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
        expect(decoded).to include('stroke="#FFF"')
      end

      it "accepts valid 6-char hex color" do
        result = helper.email_icon(:check, color: "#FF00AA")
        decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
        expect(decoded).to include('stroke="#FF00AA"')
      end

      it "rejects non-hex color values" do
        result = helper.email_icon(:check, color: "red")
        decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
        expect(decoded).to include('stroke="#000000"') # Falls back to default
      end
    end

    context "size validation" do
      it "clamps size below minimum to 8" do
        result = helper.email_icon(:check, size: 2)
        expect(result).to include('width="8"')
      end

      it "clamps size above maximum to 128" do
        result = helper.email_icon(:check, size: 500)
        expect(result).to include('width="128"')
      end

      it "handles non-integer size" do
        result = helper.email_icon(:check, size: "abc")
        expect(result).to include('width="8"') # to_i returns 0, clamped to 8
      end
    end
  end

  describe "#email_icon_names" do
    it "returns array of available icons" do
      names = helper.email_icon_names
      expect(names).to include(:check, :mail, :linkedin)
    end

    it "includes all 21 icons" do
      expect(helper.email_icon_names.size).to eq(21)
    end
  end

  describe "#email_icon_exists?" do
    it "returns true for existing icons" do
      expect(helper.email_icon_exists?(:check)).to be true
    end

    it "returns false for missing icons" do
      expect(helper.email_icon_exists?(:nonexistent)).to be false
    end

    it "accepts string names" do
      expect(helper.email_icon_exists?("check")).to be true
    end
  end

  describe "icon completeness" do
    it "has all standard icons" do
      standard_icons = %i[check x alert_circle alert_triangle info mail lock user arrow_right external_link star heart bell calendar clock]
      standard_icons.each do |icon|
        expect(helper.email_icon_exists?(icon)).to be(true), "Missing icon: #{icon}"
      end
    end

    it "has all social icons" do
      social_icons = %i[linkedin twitter github facebook instagram youtube]
      social_icons.each do |icon|
        expect(helper.email_icon_exists?(icon)).to be(true), "Missing social icon: #{icon}"
      end
    end
  end

  describe "#email_logo" do
    let(:helper_with_colors) do
      Class.new do
        include EmailIconHelper

        def email_colors
          {
            foreground: "#000000",
            primary: "#FF5600",
            primary_foreground: "#1A1A2E",
            logo_highlight: "#00FF00"
          }
        end
      end.new
    end

    it "returns Base64-encoded img tag" do
      result = helper_with_colors.email_logo
      expect(result).to include("data:image/svg+xml;base64,")
      expect(result).to include('width="40"')
      expect(result).to include('height="40"')
      expect(result).to include('alt="Logo"')
    end

    it "applies custom size" do
      result = helper_with_colors.email_logo(size: 64)
      expect(result).to include('width="64"')
      expect(result).to include('height="64"')
    end

    it "uses theme colors" do
      result = helper_with_colors.email_logo
      decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
      expect(decoded).to include('fill="#1A1A2E"') # primary_foreground as background
      expect(decoded).to include('fill="#FF5600"') # primary as foreground
      expect(decoded).to include('fill="#00FF00"') # logo_highlight
    end

    it "falls back to primary when logo_highlight is missing" do
      helper_without_highlight = Class.new do
        include EmailIconHelper

        def email_colors
          {
            foreground: "#000000",
            primary: "#FF5600",
            primary_foreground: "#1A1A2E"
          }
        end
      end.new

      result = helper_without_highlight.email_logo
      decoded = Base64.decode64(result.match(/base64,([^"]+)/)[1])
      # All fill colors should be either primary_foreground or primary
      expect(decoded.scan(/fill="([^"]+)"/).flatten.uniq.sort).to eq(%w[#1A1A2E #FF5600])
    end

    it "returns html_safe string" do
      result = helper_with_colors.email_logo
      expect(result).to be_html_safe
    end

    it "clamps size to valid range" do
      expect(helper_with_colors.email_logo(size: 2)).to include('width="8"')
      expect(helper_with_colors.email_logo(size: 500)).to include('width="128"')
    end
  end
end

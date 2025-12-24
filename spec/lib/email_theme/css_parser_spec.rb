# frozen_string_literal: true

require "rails_helper"

RSpec.describe EmailTheme::CssParser do
  describe ".parse_theme" do
    context "with default theme" do
      it "parses light mode colors from application.css" do
        colors = described_class.parse_theme("default", dark_mode: false)

        expect(colors).to include("background")
        expect(colors).to include("foreground")
        expect(colors).to include("primary")
        expect(colors["background"]).to eq("oklch(1 0 0)")
      end

      it "parses dark mode colors from application.css" do
        colors = described_class.parse_theme("default", dark_mode: true)

        expect(colors).to include("background")
        expect(colors["background"]).to eq("oklch(0.145 0 0)")
      end
    end

    context "with claude theme" do
      it "parses light mode colors" do
        colors = described_class.parse_theme("claude", dark_mode: false)

        expect(colors).to include("background")
        expect(colors).to include("primary")
        expect(colors["background"]).to match(/oklch\(0\.98/)
      end

      it "parses dark mode colors" do
        colors = described_class.parse_theme("claude", dark_mode: true)

        expect(colors["background"]).to match(/oklch\(0\.27/)
      end
    end

    context "with myfoodlink theme (OKLCH colors)" do
      it "parses OKLCH values for primary" do
        colors = described_class.parse_theme("myfoodlink", dark_mode: false)

        # myfoodlink uses OKLCH for all colors including primary
        expect(colors["primary"]).to match(/oklch/)
        expect(colors["primary-foreground"]).to match(/oklch/)
      end

      it "parses OKLCH values for background" do
        colors = described_class.parse_theme("myfoodlink", dark_mode: false)

        expect(colors["background"]).to match(/oklch/)
      end
    end

    context "with blackpink theme" do
      it "parses light mode colors" do
        colors = described_class.parse_theme("blackpink", dark_mode: false)

        expect(colors).to include("background")
        expect(colors).to include("primary")
      end

      it "parses dark mode colors" do
        colors = described_class.parse_theme("blackpink", dark_mode: true)

        expect(colors).to include("background")
        # Dark mode has purple-tinted background
        expect(colors["background"]).to match(/oklch.*280/)
      end
    end

    context "with invalid theme" do
      it "returns empty hash for non-existent theme" do
        colors = described_class.parse_theme("nonexistent", dark_mode: false)

        expect(colors).to eq({})
      end
    end

    context "color key filtering" do
      it "only includes specified color keys" do
        colors = described_class.parse_theme("default", dark_mode: false)

        # Should include these
        expect(colors.keys).to include("background", "foreground", "primary", "border")

        # Should NOT include these (not in COLOR_KEYS)
        expect(colors.keys).not_to include("chart-1", "sidebar", "ring")
      end
    end
  end
end

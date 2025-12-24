# frozen_string_literal: true

require "rails_helper"

RSpec.describe EmailTheme do
  before do
    # Reset cached palettes before each test
    described_class.reload!
  end

  describe ".colors" do
    it "returns a hash with symbol keys" do
      colors = described_class.colors(theme: "default", mode: "light")

      expect(colors).to be_a(Hash)
      expect(colors.keys).to all(be_a(Symbol))
    end

    it "returns HEX color values" do
      colors = described_class.colors(theme: "default", mode: "light")

      colors.each_value do |value|
        expect(value).to match(/^#[0-9a-fA-F]{6}$/), "Expected #{value} to be a HEX color"
      end
    end

    it "returns all expected color keys" do
      colors = described_class.colors(theme: "default", mode: "light")

      expected_keys = %i[
        background foreground primary primary_foreground
        card card_foreground muted muted_foreground
        border destructive destructive_foreground
      ]

      expected_keys.each do |key|
        expect(colors).to have_key(key), "Expected colors to have key #{key}"
      end
    end

    it "defaults to light mode for default theme" do
      colors = described_class.colors
      default_light = described_class.colors(theme: "default", mode: "light")

      expect(colors).to eq(default_light)
    end

    it "falls back to default-light for invalid theme" do
      colors = described_class.colors(theme: "nonexistent", mode: "light")
      default_light = described_class.colors(theme: "default", mode: "light")

      expect(colors).to eq(default_light)
    end
  end

  describe "theme palettes" do
    described_class::THEMES.each do |theme|
      described_class::MODES.each do |mode|
        context "#{theme} theme in #{mode} mode" do
          it "returns valid HEX colors" do
            colors = described_class.colors(theme: theme, mode: mode)

            expect(colors).to be_a(Hash)
            expect(colors.keys).not_to be_empty

            colors.each do |key, value|
              expect(value).to match(/^#[0-9a-fA-F]{6}$/),
                              "#{theme}-#{mode} #{key}: Expected '#{value}' to be a HEX color"
            end
          end

          it "has distinct background and foreground" do
            colors = described_class.colors(theme: theme, mode: mode)

            expect(colors[:background]).not_to eq(colors[:foreground])
          end
        end
      end
    end
  end

  describe ".palettes" do
    it "returns all 8 theme/mode combinations" do
      palettes = described_class.palettes

      expect(palettes.keys.count).to eq(8)
      expect(palettes.keys).to include(
        "default-light", "default-dark",
        "claude-light", "claude-dark",
        "blackpink-light", "blackpink-dark",
        "myfoodlink-light", "myfoodlink-dark"
      )
    end

    it "caches results" do
      first_call = described_class.palettes
      second_call = described_class.palettes

      expect(first_call).to equal(second_call) # Same object reference
    end
  end

  describe ".reload!" do
    it "clears the cached palettes" do
      first_palettes = described_class.palettes
      described_class.reload!
      new_palettes = described_class.palettes

      # Should be equal values but different object references
      expect(new_palettes).to eq(first_palettes)
      expect(new_palettes).not_to equal(first_palettes)
    end
  end

  describe ".valid_theme?" do
    it "returns true for valid themes" do
      described_class::THEMES.each do |theme|
        expect(described_class.valid_theme?(theme)).to be(true)
      end
    end

    it "returns false for invalid themes" do
      expect(described_class.valid_theme?("nonexistent")).to be(false)
      expect(described_class.valid_theme?("")).to be(false)
      expect(described_class.valid_theme?(nil)).to be(false)
    end

    it "handles symbol input" do
      expect(described_class.valid_theme?(:claude)).to be(true)
    end
  end

  describe ".valid_mode?" do
    it "returns true for valid modes" do
      described_class::MODES.each do |mode|
        expect(described_class.valid_mode?(mode)).to be(true)
      end
    end

    it "returns false for invalid modes" do
      expect(described_class.valid_mode?("auto")).to be(false)
      expect(described_class.valid_mode?("")).to be(false)
    end
  end

  describe ".available_themes" do
    it "returns list of theme names" do
      themes = described_class.available_themes

      expect(themes).to eq(%w[default claude blackpink myfoodlink])
    end

    it "returns a copy (not the original constant)" do
      themes = described_class.available_themes
      themes << "modified"

      expect(described_class.available_themes).not_to include("modified")
    end
  end

  describe "myfoodlink OKLCH conversion" do
    it "converts OKLCH values to HEX for email compatibility" do
      colors = described_class.colors(theme: "myfoodlink", mode: "light")

      # myfoodlink uses OKLCH which gets converted to HEX for email clients
      # oklch(0.91 0.18 115) converts to approximately #deef4c
      expect(colors[:primary]).to match(/^#[0-9a-fA-F]{6}$/)
      expect(colors[:primary_foreground]).to match(/^#[0-9a-fA-F]{6}$/)
    end
  end
end

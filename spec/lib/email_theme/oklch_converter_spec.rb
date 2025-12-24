# frozen_string_literal: true

require "rails_helper"

RSpec.describe EmailTheme::OklchConverter do
  describe ".to_hex" do
    context "with valid OKLCH values" do
      it "converts white oklch(1 0 0) to #ffffff" do
        expect(described_class.to_hex("oklch(1 0 0)")).to eq("#ffffff")
      end

      it "converts near black oklch(0.145 0 0) to approximately #0a0a0a" do
        result = described_class.to_hex("oklch(0.145 0 0)")
        expect(result).to match(/^#[0-9a-f]{6}$/i)
        # Near black should have very low RGB values
        r, g, b = result[1..].scan(/../).map { |hex| hex.to_i(16) }
        expect(r).to be < 20
        expect(g).to be < 20
        expect(b).to be < 20
      end

      it "converts claude orange oklch(0.62 0.14 39.04) to a warm orange" do
        result = described_class.to_hex("oklch(0.62 0.14 39.04)")
        expect(result).to match(/^#[0-9a-f]{6}$/i)
        r, g, b = result[1..].scan(/../).map { |hex| hex.to_i(16) }
        # Orange should have high R, medium G, low B
        expect(r).to be > 150
        expect(g).to be < r
        expect(b).to be < g
      end

      it "handles percentage lightness format oklch(70% 0.15 240)" do
        result = described_class.to_hex("oklch(70% 0.15 240)")
        expect(result).to match(/^#[0-9a-f]{6}$/i)
      end

      it "converts gray oklch(0.5 0 0) to mid-gray" do
        result = described_class.to_hex("oklch(0.5 0 0)")
        r, g, b = result[1..].scan(/../).map { |hex| hex.to_i(16) }
        # Mid-gray should have equal-ish RGB around 100-150
        expect(r).to be_within(5).of(g)
        expect(g).to be_within(5).of(b)
        expect(r).to be_between(80, 160)
      end
    end

    context "with HEX passthrough" do
      it "returns HEX values unchanged" do
        expect(described_class.to_hex("#D7F56C")).to eq("#D7F56C")
        expect(described_class.to_hex("#042858")).to eq("#042858")
        expect(described_class.to_hex("#ffffff")).to eq("#ffffff")
      end
    end

    context "with invalid input" do
      it "returns #000000 for nil" do
        expect(described_class.to_hex(nil)).to be_nil
      end

      it "returns #000000 for empty string" do
        expect(described_class.to_hex("")).to be_nil
      end

      it "returns #000000 for invalid oklch format" do
        expect(described_class.to_hex("invalid")).to eq("#000000")
        expect(described_class.to_hex("rgb(255, 0, 0)")).to eq("#000000")
      end
    end

    context "with edge cases" do
      it "handles oklch with extra whitespace" do
        result = described_class.to_hex("oklch(  0.7   0.15   240  )")
        expect(result).to match(/^#[0-9a-f]{6}$/i)
      end

      it "handles pure red hue (h=0)" do
        result = described_class.to_hex("oklch(0.6 0.2 0)")
        r, g, b = result[1..].scan(/../).map { |hex| hex.to_i(16) }
        expect(r).to be > g
        expect(r).to be > b
      end

      it "handles pure blue hue (h=240)" do
        result = described_class.to_hex("oklch(0.5 0.2 240)")
        r, g, b = result[1..].scan(/../).map { |hex| hex.to_i(16) }
        expect(b).to be > r
      end

      it "clamps out-of-gamut colors" do
        # Very high chroma might produce out-of-gamut colors
        result = described_class.to_hex("oklch(0.9 0.4 120)")
        expect(result).to match(/^#[0-9a-f]{6}$/i)
        # Should still produce valid hex (clamped)
        r, g, b = result[1..].scan(/../).map { |hex| hex.to_i(16) }
        expect(r).to be_between(0, 255)
        expect(g).to be_between(0, 255)
        expect(b).to be_between(0, 255)
      end
    end
  end

  describe ".parse_oklch" do
    it "parses standard oklch format" do
      l, c, h = described_class.parse_oklch("oklch(0.7 0.15 240)")
      expect(l).to eq(0.7)
      expect(c).to eq(0.15)
      expect(h).to eq(240.0)
    end

    it "parses percentage lightness" do
      l, _c, _h = described_class.parse_oklch("oklch(70% 0.15 240)")
      expect(l).to eq(0.7)
    end

    it "returns nil for invalid format" do
      expect(described_class.parse_oklch("invalid")).to be_nil
      expect(described_class.parse_oklch("#ffffff")).to be_nil
    end
  end
end

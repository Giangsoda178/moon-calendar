# frozen_string_literal: true

module EmailTheme
  # Converts OKLCH color values to HEX format for email client compatibility
  # OKLCH (OK Lightness Chroma Hue) is a perceptually uniform color space
  # that no email client supports, so we must convert to HEX.
  #
  # Conversion pipeline: OKLCH -> OKLab -> Linear RGB -> sRGB -> HEX
  class OklchConverter
    # Parse OKLCH string and convert to HEX
    # @param oklch_string [String] e.g., "oklch(0.7 0.15 240)" or "oklch(70% 0.15 240)"
    # @return [String] HEX color e.g., "#5555ff"
    def self.to_hex(oklch_string)
      return nil if oklch_string.nil? || oklch_string.empty?
      return oklch_string if oklch_string.start_with?("#")

      l, c, h = parse_oklch(oklch_string)
      return "#000000" unless l && c && h

      rgb = oklch_to_srgb(l, c, h)
      rgb_to_hex(rgb)
    rescue StandardError => e
      Rails.logger.warn("[EmailTheme] OKLCH conversion failed for '#{oklch_string}': #{e.message}")
      "#000000"
    end

    # Parse OKLCH string into components
    # Handles: oklch(0.7 0.15 240), oklch(70% 0.15 240), oklch(0.7 0.15 240 / 50%)
    def self.parse_oklch(str)
      # Match: oklch( L C H ) or oklch( L C H / alpha )
      match = str.match(/oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)/)
      return nil unless match

      l = parse_lightness(match[1])
      c = match[2].to_f
      h = match[3].to_f

      [l, c, h]
    end

    # Parse lightness value (handles both 0.7 and 70% formats)
    def self.parse_lightness(value)
      if value.end_with?("%")
        value.to_f / 100.0
      else
        value.to_f
      end
    end

    # Convert OKLCH to sRGB
    # @param l [Float] Lightness (0-1)
    # @param c [Float] Chroma (typically 0-0.4)
    # @param h [Float] Hue in degrees (0-360)
    # @return [Array<Float>] RGB values (0-1)
    def self.oklch_to_srgb(l, c, h)
      # Step 1: OKLCH to OKLab
      h_rad = h * Math::PI / 180.0
      a = c * Math.cos(h_rad)
      b = c * Math.sin(h_rad)

      # Step 2: OKLab to Linear RGB
      linear_rgb = oklab_to_linear_rgb(l, a, b)

      # Step 3: Linear RGB to sRGB (gamma correction)
      linear_rgb.map { |v| linear_to_srgb(v) }
    end

    # Convert OKLab to Linear RGB using the inverse matrix transformation
    # Based on the OKLab specification by Bjorn Ottosson
    def self.oklab_to_linear_rgb(l, a, b)
      # OKLab to LMS (cone response)
      l_ = l + 0.3963377774 * a + 0.2158037573 * b
      m_ = l - 0.1055613458 * a - 0.0638541728 * b
      s_ = l - 0.0894841775 * a - 1.2914855480 * b

      # Cube to get LMS
      l_cubed = l_**3
      m_cubed = m_**3
      s_cubed = s_**3

      # LMS to Linear RGB
      r = +4.0767416621 * l_cubed - 3.3077115913 * m_cubed + 0.2309699292 * s_cubed
      g = -1.2684380046 * l_cubed + 2.6097574011 * m_cubed - 0.3413193965 * s_cubed
      bl = -0.0041960863 * l_cubed - 0.7034186147 * m_cubed + 1.7076147010 * s_cubed

      [r, g, bl]
    end

    # Apply sRGB gamma correction (linear to sRGB)
    def self.linear_to_srgb(value)
      if value <= 0.0031308
        12.92 * value
      else
        1.055 * (value**(1.0 / 2.4)) - 0.055
      end
    end

    # Convert RGB (0-1) to HEX string
    def self.rgb_to_hex(rgb)
      hex = rgb.map do |v|
        # Clamp to 0-1 range and convert to 0-255
        clamped = [[v, 0].max, 1].min
        (clamped * 255).round.clamp(0, 255)
      end

      format("#%02x%02x%02x", *hex)
    end

    private_class_method :parse_lightness, :oklch_to_srgb, :oklab_to_linear_rgb,
                         :linear_to_srgb, :rgb_to_hex
  end
end

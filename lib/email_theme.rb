# frozen_string_literal: true

# EmailTheme provides theme-aware color palettes for email templates
# Parses CSS theme files, converts OKLCH colors to HEX, and caches results
#
# Usage:
#   # Get colors for a specific theme/mode
#   colors = EmailTheme.colors(theme: "claude", mode: "dark")
#   colors[:background]  # => "#2b2b2b"
#   colors[:primary]     # => "#d4956a"
#
#   # Available themes: default, claude, blackpink, myfoodlink
#   # Available modes: light, dark
#
module EmailTheme
  THEMES = %w[default claude blackpink myfoodlink].freeze
  MODES = %w[light dark].freeze

  # Color keys extracted from theme CSS (matching CSS variable names)
  COLOR_KEYS = CssParser::COLOR_KEYS

  class << self
    # Get color palette for a theme/mode combination
    # @param theme [String] Theme name (default, claude, blackpink, myfoodlink)
    # @param mode [String] Color mode (light, dark)
    # @return [Hash<Symbol, String>] Color palette with HEX values
    def colors(theme: "default", mode: "light")
      key = palette_key(theme, mode)
      palettes[key] || palettes["default-light"]
    end

    # Get all cached palettes
    # @return [Hash<String, Hash>] All theme/mode palettes
    def palettes
      @palettes ||= build_all_palettes
    end

    # Force reload of all palettes (useful in development)
    def reload!
      @palettes = nil
      palettes
    end

    # Check if a theme is valid
    def valid_theme?(theme)
      THEMES.include?(theme.to_s)
    end

    # Check if a mode is valid
    def valid_mode?(mode)
      MODES.include?(mode.to_s)
    end

    # List all available theme names
    def available_themes
      THEMES.dup
    end

    private

    def palette_key(theme, mode)
      "#{theme}-#{mode}"
    end

    def build_all_palettes
      result = {}

      THEMES.each do |theme|
        MODES.each do |mode|
          key = palette_key(theme, mode)
          result[key] = build_palette(theme, mode)
        end
      end

      result
    end

    def build_palette(theme, mode)
      raw_colors = CssParser.parse_theme(theme, dark_mode: mode == "dark")

      COLOR_KEYS.each_with_object({}) do |key, hash|
        value = raw_colors[key]
        # Convert key from kebab-case to snake_case symbol
        sym_key = key.tr("-", "_").to_sym

        hash[sym_key] = convert_to_hex(value)
      end
    end

    def convert_to_hex(value)
      return fallback_color if value.nil? || value.empty?
      return value if value.start_with?("#")

      OklchConverter.to_hex(value) || fallback_color
    end

    def fallback_color
      "#000000"
    end
  end
end

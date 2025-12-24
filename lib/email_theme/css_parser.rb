# frozen_string_literal: true

module EmailTheme
  # Parses CSS theme files to extract CSS custom property definitions
  # Handles both OKLCH and HEX color values from theme files
  class CssParser
    THEMES_DIR = "app/frontend/themes"
    APPLICATION_CSS = "app/frontend/entrypoints/application.css"

    # CSS variable names we care about for emails
    COLOR_KEYS = %w[
      background foreground primary primary-foreground
      card card-foreground muted muted-foreground
      border destructive destructive-foreground
      logo-highlight logo-highlight-foreground
    ].freeze

    # Parse theme colors from CSS files
    # @param theme_name [String] Theme name: "default", "claude", "blackpink", "myfoodlink"
    # @param dark_mode [Boolean] Whether to extract dark mode colors
    # @return [Hash<String, String>] Variable name => color value (oklch or hex)
    def self.parse_theme(theme_name, dark_mode: false)
      css_content = read_css_for_theme(theme_name)
      return {} if css_content.nil?

      extract_colors(css_content, theme_name, dark_mode)
    end

    # Read the appropriate CSS file content for a theme
    def self.read_css_for_theme(theme_name)
      path = theme_name == "default" ? application_css_path : theme_css_path(theme_name)

      return nil unless File.exist?(path)

      File.read(path)
    rescue StandardError => e
      Rails.logger.warn("[EmailTheme] Failed to read CSS for theme '#{theme_name}': #{e.message}")
      nil
    end

    # Extract color variables from CSS content
    def self.extract_colors(css_content, theme_name, dark_mode)
      # Find the right CSS block based on theme and mode
      block = find_css_block(css_content, theme_name, dark_mode)
      return {} if block.nil?

      # Extract variables from the block
      parse_variables(block)
    end

    # Find the CSS rule block for the theme/mode combination
    def self.find_css_block(css, theme_name, dark_mode)
      if theme_name == "default"
        # Default theme: :root for light, .dark for dark
        if dark_mode
          match_dark_block(css)
        else
          match_root_block(css)
        end
      else
        # Named themes: :root[data-theme="name"] for light, :root[data-theme="name"].dark for dark
        if dark_mode
          match_theme_dark_block(css, theme_name)
        else
          match_theme_light_block(css, theme_name)
        end
      end
    end

    # Match :root { ... } block (default light theme)
    def self.match_root_block(css)
      # Match :root { ... } but not :root[data-theme=...]
      # Use non-greedy match for the content
      match = css.match(/:root\s*\{([^}]+)\}/m)
      return nil unless match

      # Verify this isn't a data-theme variant
      selector_start = match.begin(0)
      before_match = css[0...selector_start]
      return nil if before_match.match?(/\[data-theme\s*=/)

      match[1]
    end

    # Match .dark { ... } block (default dark theme)
    def self.match_dark_block(css)
      match = css.match(/\.dark\s*\{([^}]+)\}/m)
      match&.[](1)
    end

    # Match :root[data-theme="themename"] { ... } block
    def self.match_theme_light_block(css, theme_name)
      pattern = /:root\[data-theme\s*=\s*["']#{Regexp.escape(theme_name)}["']\]\s*\{([^}]+)\}/m
      match = css.match(pattern)
      match&.[](1)
    end

    # Match :root[data-theme="themename"].dark { ... } block
    def self.match_theme_dark_block(css, theme_name)
      pattern = /:root\[data-theme\s*=\s*["']#{Regexp.escape(theme_name)}["']\]\.dark\s*\{([^}]+)\}/m
      match = css.match(pattern)
      match&.[](1)
    end

    # Parse CSS variables from a block of CSS declarations
    # @param block [String] CSS declarations inside { }
    # @return [Hash<String, String>] Variable name (without --) => value
    def self.parse_variables(block)
      result = {}

      # Match --variable-name: value; patterns
      # Value can be: oklch(...), #hex, or other
      block.scan(/--([a-z-]+):\s*([^;]+);/i) do |name, value|
        next unless COLOR_KEYS.include?(name)

        # Clean up the value (remove comments, trim whitespace)
        clean_value = value.gsub(%r{/\*.*?\*/}, "").strip
        result[name] = clean_value
      end

      result
    end

    def self.application_css_path
      Rails.root.join(APPLICATION_CSS)
    end

    def self.theme_css_path(theme_name)
      Rails.root.join(THEMES_DIR, "#{theme_name}.css")
    end

    private_class_method :read_css_for_theme, :extract_colors, :find_css_block,
                         :match_root_block, :match_dark_block,
                         :match_theme_light_block, :match_theme_dark_block,
                         :parse_variables, :application_css_path, :theme_css_path
  end
end

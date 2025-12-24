# frozen_string_literal: true

# Preload and cache email theme color palettes on application boot
# This avoids repeated file reads and OKLCH conversions at runtime
#
# Skip preloading in test environment for faster boot times
# In development, palettes are loaded lazily on first access

unless Rails.env.test?
  Rails.application.config.after_initialize do
    # Eager load all theme palettes
    EmailTheme.palettes
    Rails.logger.info("[EmailTheme] Preloaded #{EmailTheme.palettes.keys.count} theme palettes")
  end
end

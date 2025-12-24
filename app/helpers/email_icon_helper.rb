# frozen_string_literal: true

# Helper for rendering icons in email templates
# Uses Base64-encoded SVG in <img> tags for Gmail/Outlook compatibility
module EmailIconHelper
  # Valid hex color pattern (3, 4, 6, or 8 hex chars)
  HEX_COLOR_PATTERN = /\A#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?([0-9A-Fa-f]{2})?\z/
  MIN_SIZE = 8
  MAX_SIZE = 128
  DEFAULT_SIZE = 24

  # Lucide icon SVG paths (stroke-based, 24x24 viewBox)
  # Social icons use fill="currentColor" for brand recognition
  ICONS = {
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    alert_circle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
    alert_triangle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    lock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    arrow_right: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    external_link: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    # Social media icons (filled style for brand recognition)
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    github: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
  }.freeze

  # Render an icon as Base64-encoded SVG in an <img> tag
  # @param name [Symbol, String] Icon name from ICONS hash
  # @param size [Integer] Icon size in pixels (default: 24, clamped 8-128)
  # @param color [String, nil] Hex color (default: email_colors[:foreground])
  # @return [String] HTML img tag with Base64 SVG, or empty string if invalid
  def email_icon(name, size: DEFAULT_SIZE, color: nil)
    return "" if name.blank?

    svg = ICONS[name.to_sym]
    return "" unless svg

    # Sanitize inputs to prevent XSS
    safe_color = sanitize_color(color || email_colors[:foreground])
    safe_size = sanitize_size(size)

    # Apply color and size to SVG (replace currentColor with actual hex)
    # Only replace first width/height (SVG element), not stroke-width or child element dimensions
    colored_svg = svg
      .gsub(/stroke="currentColor"/, %(stroke="#{safe_color}"))
      .gsub(/fill="currentColor"/, %(fill="#{safe_color}"))
      .sub(/ width="\d+"/, %( width="#{safe_size}"))
      .sub(/ height="\d+"/, %( height="#{safe_size}"))

    base64 = Base64.strict_encode64(colored_svg)

    %(<img src="data:image/svg+xml;base64,#{base64}" width="#{safe_size}" height="#{safe_size}" alt="#{name.to_s.humanize}" style="display: inline-block; vertical-align: middle;" />).html_safe
  end

  private

  # Validate hex color format to prevent XSS injection
  # @param color [String] Color value to sanitize
  # @return [String] Valid hex color or default foreground
  def sanitize_color(color)
    return email_colors[:foreground] if color.blank?
    return color if color.to_s.match?(HEX_COLOR_PATTERN)

    email_colors[:foreground]
  end

  # Clamp size to safe range
  # @param size [Integer] Size value to sanitize
  # @return [Integer] Size clamped between MIN_SIZE and MAX_SIZE
  def sanitize_size(size)
    size.to_i.clamp(MIN_SIZE, MAX_SIZE)
  end

  public

  # List all available icon names
  # @return [Array<Symbol>] Icon names
  def email_icon_names
    ICONS.keys
  end

  # Check if icon exists
  # @param name [Symbol, String] Icon name
  # @return [Boolean]
  def email_icon_exists?(name)
    ICONS.key?(name.to_sym)
  end

  # Render the app logo as Base64-encoded SVG for email compatibility
  # Uses theme colors for dynamic branding
  # @param size [Integer] Logo size in pixels (default: 40)
  # @param colors [Hash, nil] Optional colors hash (uses email_colors method if not provided)
  # @param invert [Boolean] Swap background/foreground colors (default: false)
  # @return [String] HTML img tag with Base64 SVG
  def email_logo(size: 40, colors: nil, invert: false)
    safe_size = size.to_i.clamp(MIN_SIZE, MAX_SIZE)
    colors ||= email_colors

    # Get colors with fallbacks - swap when inverted
    # Match Logo.svelte logic for consistency
    if invert
      bg_color = colors[:primary] || "#fafafa"
      fg_color = colors[:primary_foreground] || "#0a0a0a"
      highlight_color = colors[:logo_highlight_foreground].presence || fg_color
    else
      bg_color = colors[:primary_foreground] || "#0a0a0a"
      fg_color = colors[:primary] || "#fafafa"
      highlight_color = colors[:logo_highlight].presence || fg_color
    end

    svg = <<~SVG
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375" width="#{safe_size}" height="#{safe_size}">
        <defs>
          <clipPath id="logo-clip">
            <path d="M 75 0 L 300 0 C 341.421875 0 375 33.578125 375 75 L 375 300 C 375 341.421875 341.421875 375 300 375 L 75 375 C 33.578125 375 0 341.421875 0 300 L 0 75 C 0 33.578125 33.578125 0 75 0 Z"/>
          </clipPath>
        </defs>
        <g clip-path="url(#logo-clip)">
          <rect x="-82.5" width="540" fill="#{bg_color}" height="540" y="-82.5"/>
        </g>
        <g fill="#{fg_color}">
          <g transform="translate(35.616406, 270.624438)">
            <path d="M 98.171875 -24.578125 L 98.171875 0 L 0 0 L 0 -171.890625 L 24.578125 -171.890625 L 24.578125 -122.75 L 98.171875 -122.75 L 98.171875 -98.171875 L 122.75 -98.171875 L 122.75 -24.578125 Z M 24.578125 -24.578125 L 97.9375 -24.578125 L 97.9375 -98.171875 L 24.578125 -98.171875 Z"/>
          </g>
        </g>
        <g fill="#{fg_color}">
          <g transform="translate(175.593652, 270.624438)">
            <path d="M 122.75 -98.171875 L 122.75 0 L 98.171875 0 L 98.171875 -98.171875 L 24.578125 -98.171875 L 24.578125 0 L 0 0 L 0 -122.75 L 98.171875 -122.75 L 98.171875 -98.171875 Z"/>
          </g>
        </g>
        <g fill="#{highlight_color}">
          <g transform="translate(315.577325, 270.624438)">
            <path d="M 0 -24.578125 L 24.578125 -24.578125 L 24.578125 0 L 0 0 Z"/>
          </g>
        </g>
      </svg>
    SVG

    base64 = Base64.strict_encode64(svg.strip)

    %(<img src="data:image/svg+xml;base64,#{base64}" width="#{safe_size}" height="#{safe_size}" alt="Logo" style="display: inline-block; vertical-align: middle;" />).html_safe
  end
end

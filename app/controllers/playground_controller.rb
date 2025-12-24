# frozen_string_literal: true

# Controller for playground - demonstrates Inertia patterns
# with validation using ActiveModel and inertia_errors helper
class PlaygroundController < InertiaController
  include Pagy::Method
  include PlaygroundMockData
  helper EmailIconHelper

  skip_before_action :authenticate

  EMAIL_TYPES = {
    "password_reset" => {mailer: "TransactionalMailer", method: "password_reset", args: [:user, :token]},
    "email_verification" => {mailer: "TransactionalMailer", method: "email_verification", args: [:user, :token]},
    "magic_login" => {mailer: "TransactionalMailer", method: "magic_login", args: [:user, :token]},
    "welcome" => {mailer: "TransactionalMailer", method: "welcome", args: [:user]},
    "account_verified" => {mailer: "TransactionalMailer", method: "account_verified", args: [:user]},
    "account_deleted" => {mailer: "TransactionalMailer", method: "account_deleted", args: [:user]},
    "activity_alert" => {mailer: "NotificationMailer", method: "activity_alert", args: [:user, :activity]},
    "status_update" => {mailer: "NotificationMailer", method: "status_update", args: [:user, :status]},
    "reminder" => {mailer: "NotificationMailer", method: "reminder", args: [:user, :reminder]},
    "security_alert" => {mailer: "NotificationMailer", method: "security_alert", args: [:user, :event]},
    "invoice" => {mailer: "NotificationMailer", method: "invoice", args: [:user, :invoice]},
    "newsletter" => {mailer: "MarketingMailer", method: "newsletter", args: [:user, :newsletter]},
    "promotion" => {mailer: "MarketingMailer", method: "promotion", args: [:user, :promotion]},
    "announcement" => {mailer: "MarketingMailer", method: "announcement", args: [:user, :announcement]},
    "product_update" => {mailer: "MarketingMailer", method: "product_update", args: [:user, :update]}
  }.freeze

  PARTIAL_CONFIGS = {
    "header" => {props: [], has_content: false},
    "footer" => {props: [:social_links], has_content: false},
    "button" => {props: [:text, :url], has_content: false},
    "card" => {props: [], has_content: true},
    "divider" => {props: [], has_content: false},
    "badge" => {props: [:text, :variant], has_content: false},
    "alert" => {props: [:variant], has_content: true},
    "progress" => {props: [:percent, :label], has_content: false},
    "social_icons" => {props: [], has_content: false},
    "line_items" => {props: [], has_content: false},
    "key_value" => {props: [], has_content: false}
  }.freeze

  def index
  end

  # Navigation demo - preserveScroll/preserveState
  def navigation_demo
    # Generate a random number to demonstrate preserveState
    render inertia: {
      server_timestamp: Time.current.strftime("%H:%M:%S.%L"),
      random_number: rand(1000..9999)
    }
  end

  # Login form - basic authentication pattern
  def login_form
    submitted = session.delete(:submitted_params)
    render inertia: {
      form: Playground::LoginForm.defaults,
      submitted_params: submitted
    }
  end

  def submit_login_form
    @form = Playground::LoginForm.new(login_form_params)
    session[:submitted_params] = login_form_params.to_h

    if @form.valid?
      flash[:success] = "Login successful"
      redirect_to playground_login_form_path
    else
      flash[:alert] = "Invalid credentials"
      redirect_to playground_login_form_path, inertia: inertia_errors(@form, full_messages: false)
    end
  end

  # Contact form - simple inquiry pattern
  def contact_form
    submitted = session.delete(:submitted_params)
    render inertia: {
      form: Playground::ContactForm.defaults,
      submitted_params: submitted
    }
  end

  def submit_contact_form
    @form = Playground::ContactForm.new(contact_form_params)
    session[:submitted_params] = contact_form_params.to_h

    if @form.valid?
      flash[:success] = "Message sent successfully"
      redirect_to playground_contact_form_path
    else
      flash[:alert] = "Please fix the errors below"
      redirect_to playground_contact_form_path, inertia: inertia_errors(@form, full_messages: false)
    end
  end

  # User form - comprehensive with nested attributes
  def user_form
    submitted = session.delete(:submitted_params)
    render inertia: {
      user: Playground::UserForm.defaults,
      submitted_params: submitted
    }
  end

  def submit_user_form
    @form = Playground::UserForm.new(user_form_params)
    session[:submitted_params] = user_form_params.to_h

    if @form.valid?
      flash[:success] = "Form submitted successfully"
      redirect_to playground_user_form_path
    else
      flash[:alert] = "Invalid form data"
      redirect_to playground_user_form_path, inertia: inertia_errors(@form, full_messages: false)
    end
  end

  # Data Loading demo - partial reloads, deferred props, load when visible
  def data_loading
    render inertia: {
      # Always available - can be partially reloaded
      stats: generate_stats,
      timestamp: Time.current.strftime("%H:%M:%S.%L"),

      # Deferred - loads after initial render (simulates expensive query)
      expensive_report: InertiaRails.defer { generate_report },

      # Optional - only loads when explicitly requested (WhenVisible)
      chart_data: InertiaRails.optional { generate_chart_data }
    }
  end

  # Realtime demo - polling, prefetching
  def realtime
    render inertia: {
      dashboard: {
        timestamp: Time.current.strftime("%H:%M:%S"),
        cpu: rand(10..90),
        memory: rand(30..80),
        requests: rand(100..1000),
        active_users: rand(50..500)
      },
      prefetch_targets: [
        {name: "Login Form", path: playground_login_form_path, icon: "key-round"},
        {name: "Contact Form", path: playground_contact_form_path, icon: "mail"},
        {name: "Navigation Demo", path: playground_navigation_demo_path, icon: "compass"}
      ]
    }
  end

  # WebSocket demo page
  def websocket
    render inertia: {}
  end

  # Email template playground
  def emails
    render inertia: {
      email_types: EMAIL_TYPES.keys,
      email_type_labels: EMAIL_TYPES.keys.index_with { |t| t.titleize }
    }
  end

  # Render email preview as HTML
  def email_preview
    email_type = params[:email_type] || "welcome"
    theme = params[:theme] || "default"
    mode = params[:mode] || "light"

    html = render_email_preview(email_type, theme, mode)
    render json: {html: html, email_type: email_type, theme: theme, mode: mode}
  end

  # Send test email to Mailcatcher
  def send_test_email
    email_type = params[:email_type] || "welcome"
    theme = params[:theme] || "default"
    mode = params[:mode] || "light"
    recipient = params[:recipient] || "test@example.com"

    mail = build_email(email_type, theme, mode)
    mail.to = recipient
    mail.deliver_now

    head :ok
  rescue StandardError => e
    render json: {error: e.message}, status: :unprocessable_entity
  end

  # Render partial preview for component inspector
  def partial_preview
    partial = params[:partial] || "button"
    theme = params[:theme] || "default"
    mode = params[:mode] || "light"

    config = PARTIAL_CONFIGS[partial]
    return render(json: {error: "Unknown partial"}, status: :not_found) unless config

    html = render_partial_preview(partial, theme, mode, params)
    render json: {html: html, partial: partial, config: config}
  end

  # Trigger notification broadcast
  def send_notification
    notification = {
      id: SecureRandom.uuid,
      type: params[:type] || "info",
      title: params[:title] || "Notification",
      message: params[:message] || "This is a test notification",
      timestamp: Time.current.iso8601
    }

    ActionCable.server.broadcast("notifications", notification)
    head :ok
  end

  # Once Props demo - cached props across navigations
  def once_props
    render inertia: {
      # Regular prop - changes on every request
      timestamp: Time.current.strftime("%H:%M:%S.%L"),
      request_count: session[:once_props_request_count] = (session[:once_props_request_count] || 0) + 1,

      # Basic once prop - cached after first load
      countries: InertiaRails.once { generate_countries },

      # Once prop with expiration (refreshes after 30 seconds)
      plans: InertiaRails.once(expires_in: 30.seconds) { generate_pricing_plans },

      # Once prop with custom key (shared across pages using same key)
      permissions: InertiaRails.once(key: "user_permissions") { generate_permissions },

      # Combined: deferred + once (loads after render, then cached)
      heavy_data: InertiaRails.defer(once: true) { generate_heavy_data }
    }
  end

  # Second page to demonstrate once prop sharing via custom key
  # IMPORTANT: Must include the SAME once props as page 1 to preserve cache
  def once_props_page2
    render inertia: {
      # Regular prop - changes each request
      timestamp: Time.current.strftime("%H:%M:%S.%L"),

      # MUST include same once props to keep them cached!
      countries: InertiaRails.once { generate_countries },
      plans: InertiaRails.once(expires_in: 30.seconds) { generate_pricing_plans },

      # Same custom key as once_props - will use cached value
      available_permissions: InertiaRails.once(key: "user_permissions") { generate_permissions },

      # Deferred + once - must include on both pages to preserve cache
      heavy_data: InertiaRails.defer(once: true) { generate_heavy_data },

      # Page-specific data
      page_info: {name: "Page 2", purpose: "Demonstrates custom key sharing"}
    }
  end

  # Lists & State demo - infinite scroll, merging props, remembering state
  def lists_state
    # Generate mock items
    all_items = generate_items(100)

    # Use Pagy for pagination (v43+ API) - :countless for infinite scroll
    @pagy, paginated_items = pagy(:offset, all_items, limit: 10)

    # Build items with IDs
    items_with_ids = paginated_items.each_with_index.map do |item, i|
      {id: @pagy.offset + i + 1, **item}
    end

    render inertia: {
      # Infinite scroll with InertiaRails.scroll - pass pagy instance and block
      items: InertiaRails.scroll(@pagy) { items_with_ids },

      # Notifications array - merge appends new notifications to existing ones
      notifications: InertiaRails.merge { generate_notifications },

      # Filter options for remember state demo
      available_filters: %w[all active completed pending],
      available_sorts: %w[newest oldest name]
    }
  end

  private

  def login_form_params
    params.permit(:email, :password, :remember_me)
  end

  def contact_form_params
    params.permit(:name, :email, :subject, :message, :priority)
  end

  def user_form_params
    params.permit(
      :name, :email, :bio, :plan, :notifications, :dob,
      :marketing_emails, :terms,
      profile_attributes: %i[avatar_url timezone],
      address_attributes: %i[street city state zip country]
    )
  end

  # Email preview helpers
  def render_email_preview(email_type, theme, mode)
    mail = build_email(email_type, theme, mode)
    return "" unless mail

    mail.html_part&.body&.decoded || mail.body.to_s
  end

  def build_email(email_type, theme, mode)
    config = EMAIL_TYPES[email_type]
    return nil unless config

    user = EmailPreviewData.mock_user(theme: theme, dark_mode: mode == "dark")
    data = EmailPreviewData.for_email(email_type)

    mailer_class = config[:mailer].constantize
    method_name = config[:method]

    args = config[:args].map do |arg|
      case arg
      when :user then user
      when :token then data[:token]
      else data[arg]
      end
    end

    mailer_class.send(method_name, *args)
  end

  # Partial preview helpers
  def render_partial_preview(partial, theme, mode, props)
    user = EmailPreviewData.mock_user(theme: theme, dark_mode: mode == "dark")
    colors = EmailTheme.colors(theme: theme, mode: mode)

    locals = {email_colors: colors}
    config = PARTIAL_CONFIGS[partial]

    # Add props from request params
    config[:props].each do |prop|
      locals[prop] = props[prop] if props[prop].present?
    end

    # Provide default values for required props
    defaults = default_partial_props(partial)
    defaults.each { |k, v| locals[k] ||= v }

    # For partials that accept content, pass it as a local variable
    locals[:content] = "Sample content for #{partial}" if config[:has_content]
    content = render_to_string(partial: "mailers/shared/#{partial}", locals: locals)

    wrap_in_preview_layout(content, colors)
  end

  def default_partial_props(partial)
    case partial
    when "button" then {text: "Click Here", url: "https://example.com"}
    when "badge" then {text: "New", variant: :primary}
    when "alert" then {variant: :default}
    when "progress" then {percent: 65, label: "65% complete"}
    when "header" then {logo_url: nil}
    when "footer" then {
      social_links: [
        {platform: "linkedin", url: "https://linkedin.com/company/example"},
        {platform: "twitter", url: "https://twitter.com/example"},
        {platform: "github", url: "https://github.com/example"}
      ]
    }
    when "social_icons" then {
      links: [
        {platform: "linkedin", url: "https://linkedin.com/company/example"},
        {platform: "twitter", url: "https://twitter.com/example"},
        {platform: "github", url: "https://github.com/example"}
      ]
    }
    when "line_items" then {
      items: [
        {description: "Pro Plan (Monthly)", qty: 1, price: "$29.00", total: "$29.00"},
        {description: "Additional Users (3)", subtitle: "Extra team members", qty: 3, price: "$5.00", total: "$15.00"}
      ],
      subtotal: "$44.00",
      tax: "$3.96",
      total: "$47.96"
    }
    when "key_value" then {
      title: "Invoice Details",
      items: [
        {label: "Invoice #", value: "INV-2024-001"},
        {label: "Date", value: "December 14, 2024"},
        {label: "Due Date", value: "January 14, 2025", bold: true},
        {label: "Status", value: "Unpaid"}
      ]
    }
    else {}
    end
  end

  # URL sanitization helper for email partials (mirrors ApplicationMailer#safe_email_url)
  def safe_email_url(url)
    return "#" if url.blank?
    url.to_s.match?(/\A(https?:\/\/|mailto:|tel:|#)/i) ? url.to_s : "#"
  end
  helper_method :safe_email_url

  def wrap_in_preview_layout(content, colors)
    <<~HTML
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #{colors[:background]};
            padding: 24px;
            margin: 0;
          }
        </style>
      </head>
      <body>#{content}</body>
      </html>
    HTML
  end
end

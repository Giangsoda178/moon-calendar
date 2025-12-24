# frozen_string_literal: true

# Mock data generators for playground demos
# Extracted from PlaygroundController to keep controller focused on actions
module PlaygroundMockData
  extend ActiveSupport::Concern

  private

  # Stats for data loading demo
  def generate_stats
    {
      users: rand(100..500),
      revenue: rand(10_000..50_000),
      orders: rand(50..200),
      conversion_rate: (rand(15..45) / 10.0).round(1)
    }
  end

  # Expensive report (simulates slow query)
  def generate_report
    sleep(1.5) if Rails.env.development?
    (1..5).map do |i|
      {
        id: i,
        name: "Report Item #{i}",
        value: rand(1000..9999),
        trend: %w[up down stable].sample,
        change: rand(-20..20)
      }
    end
  end

  # Chart data for WhenVisible demo
  def generate_chart_data
    (1..7).map do |i|
      day = (Date.current - (7 - i).days).strftime("%a")
      {day: day, value: rand(100..500), previous: rand(80..400)}
    end
  end

  # Items for infinite scroll demo
  def generate_items(count)
    statuses = %w[active completed pending]
    count.times.map do |i|
      {
        title: "Item #{i + 1}",
        description: "Description for item #{i + 1}",
        status: statuses.sample,
        created_at: rand(1..30).days.ago.iso8601
      }
    end
  end

  # Notifications for merge props demo
  def generate_notifications
    [
      {
        id: SecureRandom.hex(4),
        message: "New notification at #{Time.current.strftime('%H:%M:%S')}",
        type: %w[info success warning].sample,
        time: Time.current.iso8601
      }
    ]
  end

  # Countries list for once props demo (simulates expensive lookup)
  def generate_countries
    sleep(0.8) if Rails.env.development?
    {
      generated_at: Time.current.iso8601,
      items: [
        {code: "US", name: "United States", flag: "🇺🇸"},
        {code: "CA", name: "Canada", flag: "🇨🇦"},
        {code: "UK", name: "United Kingdom", flag: "🇬🇧"},
        {code: "DE", name: "Germany", flag: "🇩🇪"},
        {code: "FR", name: "France", flag: "🇫🇷"},
        {code: "JP", name: "Japan", flag: "🇯🇵"},
        {code: "AU", name: "Australia", flag: "🇦🇺"},
        {code: "BR", name: "Brazil", flag: "🇧🇷"},
        {code: "IN", name: "India", flag: "🇮🇳"},
        {code: "MX", name: "Mexico", flag: "🇲🇽"}
      ]
    }
  end

  # Pricing plans for once props demo (rarely changes)
  def generate_pricing_plans
    sleep(0.5) if Rails.env.development?
    {
      generated_at: Time.current.iso8601,
      items: [
        {id: "free", name: "Free", price: 0, features: %w[5GB 1-user Basic-support]},
        {id: "pro", name: "Pro", price: 29, features: %w[50GB 5-users Priority-support API-access]},
        {id: "enterprise", name: "Enterprise", price: 99, features: %w[Unlimited Unlimited 24/7-support Custom-integrations SSO]}
      ]
    }
  end

  # Permissions for once props demo with custom key
  def generate_permissions
    sleep(0.3) if Rails.env.development?
    %w[read write delete admin manage_users manage_billing view_reports export_data]
  end

  # Heavy data for deferred + once demo (simulates expensive computation)
  def generate_heavy_data
    sleep(1.2) if Rails.env.development?
    {
      generated_at: Time.current.iso8601,
      metrics: (1..5).map do |i|
        {
          id: i,
          name: "Metric #{i}",
          value: rand(1000..9999),
          unit: %w[requests users GB MB].sample
        }
      end,
      summary: "Computed #{rand(100..999)} records in #{rand(100..500)}ms"
    }
  end
end

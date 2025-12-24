# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    # No authentication for playground demo
    # In production, identify by session/user
  end
end

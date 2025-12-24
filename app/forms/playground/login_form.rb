# frozen_string_literal: true

module Playground
  # Simple login form - demonstrates basic authentication pattern
  class LoginForm < ApplicationForm
    attribute :email, :string
    attribute :password, :string
    attribute :remember_me, :boolean, default: false

    validates :email, presence: true, format: {with: /\A[^@\s]+@[^@\s]+\z/, message: "is invalid"}
    validates :password, presence: true, length: {minimum: 8}
  end
end

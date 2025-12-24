# frozen_string_literal: true

module Playground
  # Demonstrates comprehensive form validation with nested attributes
  # Used in /playground/form to test Inertia form integration
  class UserForm < ApplicationForm
    # Basic fields
    attribute :name, :string
    attribute :email, :string
    attribute :bio, :string
    attribute :plan, :string, default: "starter"
    attribute :notifications, :string, default: "all"
    attribute :dob, :string
    attribute :marketing_emails, :boolean, default: false
    attribute :terms, :boolean, default: false

    # Nested attributes (stored as hashes)
    attribute :profile_attributes, default: -> { {} }
    attribute :address_attributes, default: -> { {} }

    # Validations
    validates :name, presence: true
    validates :email, presence: true, format: {with: /\A[^@\s]+@[^@\s]+\z/, message: "format is invalid"}
    validates :bio, length: {minimum: 10}, allow_blank: true
    validates :terms, acceptance: {accept: [true, "1"], message: "must be accepted"}

    # Nested validations
    validate :validate_address

    private

    def validate_address
      return if address_attributes.blank?

      errors.add("address_attributes.city", "City is required") if address_attributes[:city].blank?
      errors.add("address_attributes.country", "Country is required") if address_attributes[:country].blank?
    end
  end
end

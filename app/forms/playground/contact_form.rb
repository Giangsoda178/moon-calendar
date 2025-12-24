# frozen_string_literal: true

module Playground
  # Contact form - demonstrates typical contact/inquiry pattern
  class ContactForm < ApplicationForm
    attribute :name, :string
    attribute :email, :string
    attribute :subject, :string
    attribute :message, :string
    attribute :priority, :string, default: "normal"

    validates :name, presence: true
    validates :email, presence: true, format: {with: /\A[^@\s]+@[^@\s]+\z/, message: "is invalid"}
    validates :subject, presence: true, length: {maximum: 100}
    validates :message, presence: true, length: {minimum: 20, maximum: 1000}
    validates :priority, inclusion: {in: %w[low normal high urgent]}
  end
end

# frozen_string_literal: true

# Base class for all form objects
# Provides common functionality for ActiveModel-based forms
class ApplicationForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  # Returns default attributes as a hash for Inertia props
  def self.defaults
    new.attributes
  end
end

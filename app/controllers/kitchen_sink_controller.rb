# frozen_string_literal: true

class KitchenSinkController < InertiaController
  skip_before_action :authenticate

  def index
  end
end

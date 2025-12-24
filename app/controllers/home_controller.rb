# frozen_string_literal: true

class HomeController < InertiaController
  skip_before_action :authenticate
  before_action :perform_authentication

  def index
    redirect_to calendar_index_path
  end
end

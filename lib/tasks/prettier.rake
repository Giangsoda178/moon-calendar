# frozen_string_literal: true

desc "Run Stylelint"
task :prettier do
  sh "pnpm format"
end

namespace :prettier do
  desc "Autocorrect Stylelint offenses"
  task :autocorrect do
    sh "pnpm format:fix"
  end
end

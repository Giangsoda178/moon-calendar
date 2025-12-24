# frozen_string_literal: true

desc "Run ESLint"
task :eslint do
  sh "pnpm lint:js"
end

namespace :eslint do
  desc "Autocorrect ESLint offenses"
  task :autocorrect do
    sh "pnpm fix:js"
  end
end

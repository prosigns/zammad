# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

FactoryBot.define do
  factory :permission do
    name { Faker::Job.unique.position.downcase }
  end
end

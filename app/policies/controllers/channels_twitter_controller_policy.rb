# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class Controllers::ChannelsTwitterControllerPolicy < Controllers::ApplicationControllerPolicy
  default_permit!('admin.channel_twitter')
end
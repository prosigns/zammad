# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class Controllers::ReportProfilesControllerPolicy < Controllers::ApplicationControllerPolicy
  default_permit!('admin.report_profile')
end

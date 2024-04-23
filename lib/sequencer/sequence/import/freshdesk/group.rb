# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class Sequencer::Sequence::Import::Freshdesk::Group < Sequencer::Sequence::Base

  def self.sequence
    [
      'Common::ModelClass::Group',
      'Import::Freshdesk::Group::Mapping',
      'Import::Common::Model::Attributes::AddByIds',
      'Import::Common::Model::FindBy::Name',
      'Import::Common::Model::Update',
      'Import::Common::Model::Create',
      'Import::Common::Model::Save',
      'Import::Freshdesk::MapId',
      'Import::Common::Model::Statistics::Diff::ModelKey',
      'Import::Common::ImportJob::Statistics::Update',
      'Import::Common::ImportJob::Statistics::Store',
    ]
  end
end

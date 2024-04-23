# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe Gql::Mutations::Ticket::Update, :aggregate_failures, type: :graphql do
  let(:query) do
    <<~QUERY
      mutation ticketUpdate($ticketId: ID!, $input: TicketUpdateInput!) {
        ticketUpdate(ticketId: $ticketId, input: $input) {
          ticket {
            id
            title
            group {
              name
            }
            priority {
              name
            }
            customer {
              fullname
            }
            owner {
              fullname
            }
            objectAttributeValues {
              attribute {
                name
              }
              value
            }

          }
          errors {
            message
            field
          }
        }
      }
    QUERY
  end
  let(:agent)           { create(:agent, groups: [ Group.find_by(name: 'Users')]) }
  let(:customer)        { create(:customer) }
  let(:user)            { agent }
  let(:group)           { agent.groups.first }
  let(:priority)        { Ticket::Priority.last }
  let(:ticket)          { create(:ticket, group: agent.groups.first, customer: customer) }
  let(:article_payload) { nil }

  let(:input_base_payload) do
    {
      title:      'Ticket Create Mutation Test',
      groupId:    gql.id(group),
      priorityId: gql.id(priority),
      customerId: gql.id(customer),
      ownerId:    gql.id(agent),
      article:    article_payload
      # pending_time: 10.minutes.from_now,
      # type: ...
    }
  end

  let(:input_payload) { input_base_payload }
  let(:variables)     { { ticketId: gql.id(ticket), input: input_payload } }

  let(:expected_base_response) do
    {
      'id'                    => gql.id(Ticket.last),
      'title'                 => 'Ticket Create Mutation Test',
      'owner'                 => { 'fullname' => agent.fullname },
      'group'                 => { 'name' => agent.groups.first.name },
      'customer'              => { 'fullname' => customer.fullname },
      'priority'              => { 'name' => Ticket::Priority.last.name },
      'objectAttributeValues' => [],
    }
  end

  let(:expected_response) do
    expected_base_response
  end

  context 'when updating a ticket' do

    context 'with an agent', authenticated_as: :agent do

      it 'updates the attributes' do
        gql.execute(query, variables: variables)
        expect(gql.result.data['ticket']).to eq(expected_response)
      end

      context 'without title' do
        let(:input_payload) { input_base_payload.tap { |h| h[:title] = '   ' } }

        it 'fails validation' do
          gql.execute(query, variables: variables)
          expect(gql.result.error_message).to include('Variable $input of type TicketUpdateInput! was provided invalid value for title')
        end
      end

      context 'with an article payload' do
        let(:article_payload) do
          {
            body: 'dummy',
            type: 'note',
          }
        end

        it 'adds a new article with a specific type' do
          expect { gql.execute(query, variables: variables) }
            .to change(Ticket::Article, :count).by(1)

          expect(Ticket.last.articles.last.type.name).to eq('note')
        end

        it 'adds a new article with a specific sender' do
          expect { gql.execute(query, variables: variables) }
            .to change(Ticket::Article, :count).by(1)

          expect(Ticket.last.articles.last.sender.name).to eq('Agent')
        end

        context 'with time unit' do
          let(:time_accounting_enabled) { true }
          let(:article_payload) do
            {
              body:     'dummy',
              type:     'web',
              timeUnit: 123,
            }
          end

          before do
            Setting.set('time_accounting', time_accounting_enabled)
          end

          it 'adds a new article with time unit' do
            expect { gql.execute(query, variables: variables) }
              .to change(Ticket::Article, :count).by(1)

            expect(Ticket.last.articles.last.ticket_time_accounting.time_unit).to eq(123)
          end

          context 'when time accounting disabled' do
            let(:time_accounting_enabled) { false }

            it 'does not create ticket article' do
              expect { gql.execute(query, variables: variables) }
                .not_to change(Ticket::Article, :count)

              expect(gql.result.error_message)
                .to match('Time Accounting is not enabled')
            end
          end
        end

        context 'with active secure mailing (S/MIME)' do
          before do
            Setting.set('smime_integration', true)
          end

          it 'adds a new article' do
            expect { gql.execute(query, variables: variables) }
              .to change(Ticket::Article, :count).by(1)

            expect(Ticket.last.articles.last.type.name).to eq('note')
          end
        end
      end

      context 'with custom object_attribute', db_strategy: :reset do
        let(:object_attribute) do
          screens = { create: { 'admin.organization': { shown: true, required: false } } }
          create(:object_manager_attribute_text, object_name: 'Ticket', screens: screens).tap do |_oa|
            ObjectManager::Attribute.migration_execute
          end
        end
        let(:input_payload) do
          input_base_payload.merge(
            {
              objectAttributeValues: [ { name: object_attribute.name, value: 'object_attribute_value' } ]
            }
          )
        end
        let(:expected_response) do
          expected_base_response.merge(
            {
              'objectAttributeValues' => [{ 'attribute' => { 'name'=>object_attribute.name }, 'value' => 'object_attribute_value' }]
            }
          )
        end

        it 'updates the attributes' do
          gql.execute(query, variables: variables)
          expect(gql.result.data['ticket']).to eq(expected_response)
        end
      end

      context 'when moving the ticket into a group with only :change permission' do
        let(:group) { create(:group) }

        before do
          user.groups << group
          user.group_names_access_map = { user.groups.first.name => %w[read change], group.name => ['change'] }
        end

        it 'updates the ticket, but returns an error trying to access the new ticket' do
          gql.execute(query, variables: variables)
          expect(ticket.reload.group_id).to eq(group.id)
          expect(gql.result.payload['data']['ticketUpdate']).to eq({ 'ticket' => nil, 'errors' => nil }) # Mutation did run, but data retrieval was not authorized.
          expect(gql.result.payload['errors'].first['message']).to eq('Access forbidden by Gql::Types::TicketType')
          expect(gql.result.payload['errors'].first['extensions']['type']).to eq('Exceptions::Forbidden')
        end
      end

      context 'with no permission to the group' do
        let(:group) { create(:group) }

        it 'raises an error', :aggregate_failures do
          gql.execute(query, variables: variables)
          expect(gql.result.error_type).to eq(Exceptions::Forbidden)
          expect(gql.result.error_message).to eq('Access forbidden by Gql::Types::GroupType')
        end
      end
    end

    context 'with a customer', authenticated_as: :customer do
      let(:input_payload) { input_base_payload.tap { |h| h.delete(:customerId) } }

      let(:expected_response) do
        expected_base_response.merge(
          {
            'owner'    => { 'fullname' => nil },
            'priority' => { 'name' => Ticket::Priority.where(default_create: true).first.name },
          }
        )
      end

      it 'updates the ticket with filtered values' do
        gql.execute(query, variables: variables)
        expect(gql.result.data['ticket']).to eq(expected_response)
      end

      context 'when sending a different customerId' do
        let(:input_payload) { input_base_payload.tap { |h| h[:customerId] = create(:customer).id } }

        it 'overrides the customerId' do
          gql.execute(query, variables: variables)
          expect(gql.result.data['ticket']).to eq(expected_response)
        end
      end

      context 'with an article payload' do
        let(:article_payload) do
          {
            body: 'dummy',
            type: 'web',
          }
        end

        it 'adds a new article with a specific type' do
          expect { gql.execute(query, variables: variables) }
            .to change(Ticket::Article, :count).by(1)

          expect(Ticket.last.articles.last.type.name).to eq('web')
        end

        it 'adds a new article with a specific sender' do
          expect { gql.execute(query, variables: variables) }
            .to change(Ticket::Article, :count).by(1)

          expect(Ticket.last.articles.last.sender.name).to eq('Customer')
        end
      end
    end
  end
end

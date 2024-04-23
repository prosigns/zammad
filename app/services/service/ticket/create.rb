# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class Service::Ticket::Create < Service::BaseWithCurrentUser
  include Service::Concerns::HandlesCoreWorkflow

  def execute(ticket_data:)
    Transaction.execute do
      set_core_workflow_information(ticket_data, ::Ticket, 'create_middle')

      article_data = ticket_data.delete(:article)
      tag_data     = ticket_data.delete(:tags)

      preprocess_ticket_data! ticket_data

      Ticket.new(ticket_data).tap do |ticket|
        Pundit.authorize current_user, ticket, :create?
        ticket.save!

        create_article(ticket, article_data)
        assign_tags(ticket, tag_data)
      end
    end
  end

  private

  def create_article(ticket, article_data)
    return if article_data.blank?

    preprocess_article_data! ticket, article_data

    Service::Ticket::Article::Create
      .new(current_user: current_user)
      .execute(article_data: article_data, ticket: ticket)
  end

  def assign_tags(ticket, tag_data)
    return if tag_data.blank?

    tag_data.each do |tag|
      next if !::Tag.tag_allowed?(name: tag.strip, user_id: current_user.id)

      ticket.tag_add(tag.strip)
    end
  end

  # Desktop UI supplies this data from frontend
  # Mobile UI leaves this processing for GraphQL
  def preprocess_ticket_data!(ticket_data)
    return if !customer?(ticket_data[:group]&.id)

    ticket_data[:customer_id] = current_user.id
  end

  # Desktop UI supplies this data from frontend
  # Mobile UI leaves this processing for GraphQL
  def preprocess_article_data!(ticket, article_input)
    if customer? ticket.group_id
      preprocess_permission_customer! ticket, article_input
      return
    end

    case article_input[:sender]
    when 'Customer'
      preprocess_article_data_customer! ticket, article_input
    when 'Agent'
      preprocess_article_data_agent! ticket, article_input
    end
  end

  def customer?(group_id)
    return if !current_user.permissions?('ticket.customer')

    !current_user.group_access?(group_id, :create)
  end

  def preprocess_permission_customer!(ticket, article_input)
    article_input.merge!(
      from: current_user.fullname,
      to:   group_name(ticket)
    )
  end

  def preprocess_article_data_customer!(ticket, article_input)
    article_input.merge!(
      from: customer_recipient_line(ticket),
      to:   group_name(ticket)
    )
  end

  def preprocess_article_data_agent!(ticket, article_input)
    article_input.merge!(
      from: group_name(ticket),
      to:   customer_recipient_line(ticket)
    )
  end

  def group_name(ticket)
    ticket.group&.name || ''
  end

  def customer_recipient_line(ticket)
    customer = ticket.customer

    return if !customer

    Channel::EmailBuild.recipient_line "#{customer.firstname} #{customer.lastname}".presence, customer.email
  end
end

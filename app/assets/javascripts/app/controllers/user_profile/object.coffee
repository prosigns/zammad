class App.UserProfileObject extends App.ControllerObserver
  organizationLimit: 3

  model: 'User'
  observeNot:
    cid: true
    created_at: true
    created_by_id: true
    updated_at: true
    updated_by_id: true
    preferences: true
    password: true
    last_login: true
    login_failed: true
    source: true
    image_source: true

  events:
    'click .js-showMoreOrganizations a': 'showMoreOrganizations'
    'focusout [contenteditable]': 'update'

  render: (user) =>
    if user
      @user = user

    # update taskbar with new meta data
    App.TaskManager.touch(@taskKey)

    # get display data
    userData = []
    for attributeName, attributeConfig of App.User.attributesGet('view')

      # check if value for _id exists
      name    = attributeName
      nameNew = name.substr( 0, name.length - 3 )
      if nameNew of user
        name = nameNew

      # do not show firstname and lastname since they are already shown via diplayName()
      continue if name is 'firstname' || name is 'lastname' || name is 'organization'

      # do not show if configured to be not shown
      continue if !attributeConfig.shown

      # Fix for issue #2277 - note is not shown for customer/organisations if it's empty
      # Always show for these two conditions:
      # 1. the attribute exists and is not empty
      # 2. it is a richtext note field
      continue if ( !user[name]? || user[name] is '' ) && attributeConfig.tag isnt 'richtext'

      # add to show if all checks passed
      userData.push attributeConfig

    @html App.view('user_profile/object')(
      user:     user
      userData: userData
    )
    @renderOrganizations()

    @$('[contenteditable]').ce({
      mode:      'textonly'
      multiline: true
      maxlength: 250
    })

  showMoreOrganizations: (e) ->
    @preventDefaultAndStopPropagation(e)
    @organizationLimit = (parseInt(@organizationLimit / 100) + 1) * 100
    @renderOrganizations()

  renderOrganizations: ->
    elLocal = @el
    @user.secondaryOrganizations(0, @organizationLimit, (secondaryOrganizations) ->
      organizations = []
      for organization in secondaryOrganizations
        el = $('<li></li>')
        new App.UserProfileOrganization(
          object_id: organization.id
          el: el
        )
        organizations.push el

      elLocal.find('.js-organizationList li').not('.js-showMoreOrganizations').remove()
      elLocal.find('.js-organizationList').prepend(organizations)
    )

    if @user.organization_ids && @user.organization_ids.length < @organizationLimit
      @el.find('.js-showMoreOrganizations').addClass('hidden')
    else
      @el.find('.js-showMoreOrganizations').removeClass('hidden')

  update: (e) =>
    name  = $(e.target).attr('data-name')
    value = $(e.target).html()
    user  = App.User.find(@object_id)
    if user[name] isnt value
      @lastAttributes[name] = value
      data = {}
      data[name] = value
      user.updateAttributes(data)
      @log 'debug', 'update', name, value, user

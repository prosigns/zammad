class SessionTakeOver extends App.Controller
  constructor: ->
    super

    @controllerBind(
      'ws:login'
      ->
        App.WebSocket.send(
          event: 'session_takeover',
          data:
            taskbar_id: App.TaskManager.TaskbarId()
        )
    )

    # session take over message
    @controllerBind(
      'session_takeover'
      (data) =>
        # check if error message is already shown
        if !@error

          # only if new client id isn't own client id
          if data.taskbar_id isnt App.TaskManager.TaskbarId()
            @error = new App.SessionMessage(
              head:         __('Session')
              message:      __('A new session was created with your account. This session will be stopped to prevent a conflict.')
              keyboard:     false
              backdrop:     true
              buttonClose:  false
              buttonSubmit: __('Continue session')
              forceReload:  true
            )
            @disconnectClient()
    )

App.Config.set('session_taken_over', SessionTakeOver, 'Plugins')

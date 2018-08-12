порядок сообщений с сервера после play

открытие соединение с вебсокетом:
`mse-init-segment`
нужно послать send('resume')
`event:resumed`
`ArrayBuffer`
...
`ArrayBuffer`

seek:
`mb old frames:ArrayBuffer`
`event:seeked`
`ArrayBuffer`
...
`ArrayBuffer`

seek live:
`mb old frames:ArrayBuffer`
`event:switched_to_live`
`ArrayBuffer`
...
`ArrayBuffer`

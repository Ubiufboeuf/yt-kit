export type VideoContainer = 
| 'webm'
| 'mp4'
| 'ogg'
| 'ogv'
| 'mov'
| 'avi'
| 'mkv'
| 'flv'
| 'wmv'
| 'mpeg'
| '3gp'

export type AudioContainer = 
| 'webm'
| 'mp4'
| 'ogg'
| 'oga'
| 'wav'
| 'mp3'
| 'aac'
| 'flac'
| 'opus'
| 'm4a'
| 'wma'

export type MediaContainer = VideoContainer & AudioContainer

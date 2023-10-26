# Enhance Server

server html generator and implementation of `Enhance` frontend library 

## Features

write jsx in server

api for interacting with `Enhance` library

## Note

Currently it have 2 mode: generate string immediately, or object creation.

### string

generating string immediately where it define is faster than instantiating object

the drawback is lack of post processing, since it all string we cant differ which is
user content or html. So we cant, for example, do a sanitizing automatically

### object

creating object first will allow for complex preprocessing automatically

relatively, creating object per element vs generating string will be slower and create more memory

### hybrid

we can default to generating a string. Additionally, we let the user to set object mode, where it have the
abillity for complex post processing

we can safe memory by generating string for static html, and opt in for post processing


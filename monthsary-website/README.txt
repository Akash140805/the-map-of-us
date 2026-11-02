MONTHSARY WEBSITE — CREATOR-READY VERSION

The visitor experience is read-only. There are no photo, video, or audio
upload controls. The person preparing the website adds all media and text
inside the project before sharing it.

HOW TO RUN
1. Extract the ZIP.
2. Keep index.html, css/, js/, and assets/ together.
3. Add your photos and voice recording using the filenames below.
4. Edit js/content.js to personalize the captions and letter.
5. Open index.html in a modern browser, or upload the complete folder to
   your hosting service.

ADD YOUR OWN BACKGROUND MUSIC
Place your chosen instrumental/music file here:
  assets/background-music.mp3

If your file has a different name or format, update the audio path in
backgroundMusic near the top of js/content.js. The visitor starts music by
tapping the Music button (browser autoplay rules require this first tap).
Music fades in and out smoothly, loops while enabled, fades out and pauses
when the Voice Letter chapter opens, then fades back in when she leaves it.
The Voice Letter recording is never mixed with the background music.

ADD YOUR PHOTOS
Place four photos in assets/photos/:
  memory-01.jpg
  memory-02.jpg
  memory-03.jpg
  memory-04.jpg

The Memory Garden loads these automatically. To change the photo order,
caption, title, or description, edit the memories list in js/content.js.
If you have fewer or more photos, add/remove memory objects in that list.

ADD YOUR VOICE RECORDING
Place your recording in:
  assets/voice-letter.mp3

The Voice Letter chapter loads and plays it automatically. Visitors only
see Play, Pause/Resume, and Replay controls. No file picker is shown.

PERSONALIZE YOUR LETTER
Open js/content.js and edit voiceLetter.paragraphs. Keep the paragraph
text in the same order as your recording so the read-along reveal matches.
You can also change salutation and signature there.

VOICE TIMING NOTE
Sentence reveal timing is estimated from recording duration and sentence
word counts. Natural pauses or varied speaking speed may cause the highlight
to drift. If exact synchronization is important, add sentence timestamps
for the final recording and the timing can be tuned to those points.

PROJECT FILES
- index.html: page structure
- css/styles.css: theme, layout, and animations
- js/content.js: creator-editable photos, captions, letter, and audio path
- js/main.js: map progression, adventure game, creator-supplied looping background music with fade-in/fade-out and automatic
  fade-out/pause during the Voice Letter, and memory navigation
- js/voice-letter.js: fixed audio playback and sentence reveal
- assets/: your photos and voice recording

The five destinations remain:
Memory Garden → Heartwood Trail → Our Somewhere → Voice Letter → Forever Sky.
The existing theme, map, game, and finale are preserved.

VizHash.js: a javascript implementation of visual hashes
========================================================

<a href="http://jsfiddle.net/2nYsg/3/embedded/result/">Online demo</a>

VizHash is an open source implementation of <a href="http://sebsauvage.net/wiki/doku.php?id=php:vizhash_gd">PHP VizHash_GD</a> in javascript using HTML5 canvas.

It takes a string, and turn it into an (almost) unique image that is easy to tell appart from other similar images. It is useful in cases like:

- you want people to identify what a text is without error but you don't want to display the text (like for a password);
- you want people to be able to tell which texts are the same among a lot of them quickly (for exemple IP addresses, emails, username, etc).

This implementations generate images that are compatible with VizHash_GD:

<table>
    <caption>Image generated for the string "sebsauvage.net"</caption>
    <thead>
        <tr>
            <th>VizHash_GD</th>
            <th>VizHash.js</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><img src="https://github.com/sametmax/VizHash.js/raw/master/vizhash_gd.png"></th>
            <th><img src="https://github.com/sametmax/VizHash.js/raw/master/vizhash_js.png"></th>
        </tr>
    </tbody>
</table>

The difference in picture quality is because we coudn't find a way to make antialiasing work with PHP GD.

VizHash.js is distributed under the <a href="http://www.opensource.org/licenses/zlib-license.php">zlib/libpng licence</a>.

Some stuff you could use it for
================================

* Display a <a href="http://jsfiddle.net/TANLB/embedded/result/">visual representation of passwords</a> so you know you are entering the right one. There is a <a href="https://github.com/sametmax/jQuery-Visual-Password">jQuery plugin</a> for that.
* Display a visual representation of bitcoin paiement addresses, so you can compare the one you entered with the one provided. It should avoid a lot of "Oh Oh" moment and it's much easier to compare than QR codes.
* Display anonymous comment hash of IP so you can easily follow a conversation thread by knowing who says what, but not who is who.
* Display a visual representation of Git commit hash to ease history browsing.


Usage
======

Include in your header:

    <script type="text/javascript" src="vizhash.min.js"></script>

Then:

    var text = "Text to hash";
    var width = 256; // this is the maximum
    var height = 256; // this is the maximum

    if (vizhash.supportCanvas()) {
        var vhash = vizhash.canvasHash(text, width, height);
        document.body.appendChild(vhash.canvas);
    }

Check the demo for stuff like getting a PNG and some CSS enhancements.


What you should know
=====================

* There is no unitests yet. It should work, but you know the drill... And as Unix dev, we hadn't the opportunity to try it under IE.
* Image are compatible with VizHash_GD to a certain point: enough for the human eye to be able to match a picture from each implementation without a doubt. But there are differences that will prevent you from easily matching them programatically.
* On one hand, VizHash.js uses zero server ressources unlike VizHash_GD. But it does add weight to the page, workload to the client, and it requires canvas support. IE 9+, FF 3.6+, Chrome 17+, 5.05+ and Opera 11.6+ support canvas.
* Part of the JS code shows a weird style, or is inneficient. Of one the reasons is that to maintain compatibility with VizHash_GD, the hash integer array state must be exactly changing at the same time, for the same operations. While some parts of the algorythm might have made sense in the PHP code, it feels strange in a javascript context. But if you change it, you risk loosing the result parity.

Possible improvements
======================

* Add some randomness to make it more secure like Mozilla <a href="https://github.com/mozilla/watchdog-visualhash/blob/master/Chrome/util.js#L49">does</a> with their own visual hashes. Espacially, we want to make it hard to bruteforce a password hash from a screenshoft.
* Make it more beautiful. Need to work with a color-minded designer with tech skills and sync with VizHash_GD. We could also add an option for rounded corner, iphone glassy icon effect, shadows, etc. But it can be done in CSS so is it worth it ?
* Add unit tests. Obviously. Which means making lots of private methods public.


Special thanks:
===============

* The mozilla team for inspiring us with <a href="https://wiki.mozilla.org/Identity/Watchdog/Visual_Hashing">something similar</div>.
* <a href="http://sebsauvage.net">Sebsauvage</a> for his PHP implementation.
* Paul Johnston for providing his <a href="http://pajhome.org.uk/crypt/md5/index.html">javascript hash libs</a>.

Donate
=======

Bitcoin always appreciated :-)

<img style="vertical-align:middle;" src="https://github.com/sametmax/VizHash.js/raw/master/bitcoin_hash.png">JfymvUm9y2Z47puGfnsrGewDDCBPaYFj</a>

See ? The simple discrete hash, easy to compare!
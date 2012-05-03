VizHash.js: a javascript implementation of visual hashes
**********************************************************

VizHash is an implementation of <a href="http://sebsauvage.net/wiki/doku.php?id=php:vizhash_gd">PHP VizHash_GD</a> in javascript using HTML5 canvas.

It takes a string, and turn it into an (almost) unique image that is easy to tell appart from other similar images. It is uselful in two cases:

- you want people to identify that a text is without error but you don't want to show the text (like for a password)
- you want people to be able to tell which texts are the same among a lot of them quickly (for exemple IP addresses, emails, username, etc)

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
            <th><img src="vizhash_gd.png"></th>
            <th><img src="vizhash_js.png"></th>
        </tr>
    </tbody>
</table>

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


What you should know
=====================

* There is no unitests yet. It should work, but you know the drill...
* Image are compatible with VizHash_GD to a certain point: enought for the humane eye to be able to match a picture from each implementation without a doubt. But there are differences that will prevent you from easily match them programatically.
* On one hand, VizHash.js uses zero server ressources unlike VizHash_GD. But it does add weight to the page, workload to the client, and it requires canvas support. IE 9+, FF 3.6+, Chrome 17+, 5.05+ and Opera 11.6+ support canvas.
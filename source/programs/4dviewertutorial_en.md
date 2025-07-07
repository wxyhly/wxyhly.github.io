---
title: Tutorial of 4D Viewer
---
In order to understand 4D world, we need to firstly go to 2D world. Many literary art works have mentioned 2D world and 2D creatures. But how does 2D world look like in 2Ders' eyes? With computer's help, we can simulate and visualize it. (Of course this is a pre-excercise for 4D viewer)

## Eyes of 2D creature

Assuming that there exists electromagnetic waves in 2D planiverse(In this case magnetic field is a scalar field, not a vector any more), and the 2Ders' eyes can capture the light from the 2d sun and all the 2D objects nearby. All things are restricted in the 2D plane, nothing can escape from the plane. However, the smiling face below is not a 2D creature: Its eyes and mouth are completely embedded inside its head. No light beam can reach the eyes and no food can be eaten by the mouth. Real 2Ders' eyes must be on the surface of the head to receive light.
![Left: The fake 2Der is a projection of a 3Der, Right: A real 2Der's face](/img/eye2d001.svg)

## 2D Chanllenge
![A cube and a 2Der standing on the ground](/img/eye2d002.svg)
In 2Ders' eyes, this simple scene is like the left picture below:
![A 1D vision(left) 2D scene with a given thickness(right) ](/img/eye2d003.svg)
In order to show what 2Ders' have seen, we need to give the 1 dimensional picture a width. It seems that we are looking at the original 2D scene with a given thickness.

What are these objects in the scene below?
![](/img/eye2d010.gif)
Got answer?

3

2

1

<a onclick="$('#nanj1').toggle()" href="javascript:void(0)" target="_self">Click here to show the answer</a>
<div id="nanj1" style="display:none">

![](/img/eye2d001.gif)</div>

## 3D Stereoscopic Vision

Why humans need two eyes? Because of the slightly different position of eyes, our brain can construct a feeling of 3D distance. Naturally, we assume 2Ders also have something like that. The picture below is a 2D Stereoscopic Version of the previous scene.
<iframe src="/three/eye2d.html?2" width="100%" height="110" scrolling="no"></iframe>

## Can 3Ders see inside like X-ray?

Now I tell you the true 2D scene is:
![](/img/eye2d002.gif)
Or,
![](/img/eye2d001.jpg)
Both are possible! 2Ders can see nothing inside. Who knows?
## Send 2Der an invitation to our world?

Now we can tell those 2Ders, 3D spatial world exists. How can we tell them? All the substances, waves, and particles are restricted in 2D plane, so **we cannot interact with 2D world directly but we assume that there exists a mysterious method to exchange information**.

Okay, let's send some pictures to 2Der, for example the famous photo *Lena*. Then we told 2D engineers how to decode the information, and they understood it rapidly. But the screen they use is 1 dimensional, how can they display a 2D photo from 3D world? Maybe, the smart engineer can design and construct a 2D displayer specified for the 2D photo, or even "2D print out" the photo, but 2Ders can still only see the border of the photo, remember, they can't see anything inside.
![2Der looking at the 2D photo Lena from 3D world](/img/eye2d002.jpg)
Walking around the photo, 2Der found that it is a colorful textured square, there's no chance to see the figure inside. What about a transparent photo?
![Do you know where these colorful strips are in the original photo?](/img/eye2d003.jpg)
### Transparent Photo

Now we pretend to be a 2Der, and let's try to see a blue rhombus with white background：
![](/img/eye2d006.gif)
This is the transparent version made for 2Ders:
![](/img/eye2d005.gif)
The left and right image are for stereoscopic vision. In fact 2Ders can just see a line：
![](/img/eye2d004.gif)
I admit that this method is very hard to understand, because I can't figure out what shape the blue thing is, even with stereoscopic vision.

And here comes the photo *Lena*：
![](/img/eye2d007.gif)
What a mess!
### Cross Line Method

Finally, we use cross section to show 2Der 1D contents of 2D photo. These 1D contents come from some chosen lines through the 2D photo. We can even make a first-person perspective game for them.

**Tips:**
- 3D Control：Keyboard **WASD** to move around, move your mouse left and right or press **JL** to look around in horizontal plane. scroll **mouse wheel** or press **IK** to look upward or downward. Notice that 2Ders' mouse can only be placed on the 1D ground, hence you can only move left and right. (This is also a pre-exercise for 4D Viewer)
- View Control： **left/right arrow** / **ZW** to rotate the 2D photo.

<iframe src="/three/3dviewer42der.html?iframe" width="100%" height="466" scrolling="no"></iframe>

We take two cross lines(horizontal and vertical) apart to better see these colors, both through the center of the photo.
To make the best use of stereoscopic vision, we present 3D depth(or distance) on the cross lines.

## A message from 4D

One day, a 4Der connected to someone's computer and tell us there exists a 4D world, like we did to 2Ders. He made a 4D Viewer for us to see 3D photos and 4D games! There are both transparent voxels and cross sections:
![Position of three perpendicular cross sections in 3D retina](/img/eye3d002.png)
Let's see an ordinary 3D egg: (Nothing about 4D, just last pre-exercise in 3D) **Click image below to open the Viewer**. Use `W` `S` `A` `D` `Q` `E` to move upward / downward / left / right / front / back, Drag with the left mouse button to rotate, drag with the middle and the right mouse button to move.
<a href="/4dViewer/examples/egg.html?en" target="hqekler"><img src="/img/eye3d001.jpg" class="nofancybox"></a>
Now we can see the yolk inside the egg like X-ray! This is one of 4Der's basic abilities.
Then a tesseract(Hypercube):  Drag with the left mouse button to rotate the 3D retina, drag with the middle mouse button to rotate the camera in 4D. In this time, you can also scroll your mouse wheel to go out from the tesseract.
<a href="/4dViewer/examples/hypercube.html?en" target="hqekler"><img src="/img/eye3d003.jpg" class="nofancybox"></a>

### What happened with the tesseract?
- When 3D retina rotates(Drag with the left mouse button), the 4D camera's position does not change. The analog in 3D case is：
![Rotating a photo of a cube, it is called a rotation in 2D](/img/eye3d001.gif)
- When the camera in 4D rotates, the 3D image changes steadily. The analog in 3D case is：
![Looking around in the cube, it is called a rotation in 3D](/img/eye3d002.gif)
- You may noticed that you can also drag with middle mouse button, these designs come from software Jenn3D.<a name="stereo"></a>

## 4D Stereoscopic Vision
To make the best use of stereoscopic vision, we present 4D depth(or distance) on the cross section.
![4D Stereoscopic Vision and its coordinates](/img/eye3d005.jpg)
The picture below is a tesseract frame. From 3D retina wse can see it's a smaller cube inside a bigger one. From the cross section we can see the smaller cube is actually further than the bigger one.
![A tesseract frame](/img/eye3d004.jpg)

## 4D physics scenes

Inspired from 4D Toys, I made my own *4D Rigid Body Physics Engine*. In 4D world Newtonian Mechanics can also perform well. Here are some scenes:

<table><tr><td style="text-align:center"><img src="/img/newtonf004.jpg">

[24-cell Dice (Right click to fire a glome)](/4dViewer/physique/dice.html)</td>
<td style="text-align:center"><img src="/img/newtonf003.jpg">

[Some 4D blocks (Right click to fire a glome)](/4dViewer/physique/cubes.html)</td></tr><tr>
<td style="text-align:center"><img src="/img/newtonf002.jpg">

[4D car (Please read instructions below to know how to play)](/4dViewer/physique/car.html)</td>
<td style="text-align:center"><img src="/img/newtonf001.jpg">

[4D wheels and gyros (Contains multiple scenes)](/4dViewer/physique/gyro.html)</td></tr><tr><td style="text-align:center"><img src="/img/newtonf005.jpg"><ul><ol>

[spheritorus-spheritorus link (unstable, easy to unlink)](/4dViewer/physique/unlink.html)
[spheritorus-torisphere link](/4dViewer/physique/st_ts_link.html)
[spheritorus-tiger link](/4dViewer/physique/st_tiger_link.html)
[torisphere-tiger link](/4dViewer/physique/tiger_ts_link.html)
[tiger-tiger link (One biger and one smaller)](/4dViewer/physique/tiger_tiger_link.html)
</ol></ul></td><td style="text-align:center"><img src="/img/newtonf006.jpg"><ul><ol>4D cogwheels (Speed controls in control panel)<br>
</ol><ol>

[Perpendicular cogwheels](/4dViewer/physique/cogwheel.html)
[Double rotation synthesizer](/4dViewer/physique/cogwheel2.html)
</ol></ul></td></tr></table>

## Guide & Instructions of 4D physics scenes
### 4D Car
Use `W` `S` to move ahead/move back，`J` `L` `I` `K` to turn，`U` `O`to spin. The camera is fixed on the car. Use keyboard `1` `2` `3` to toggle camera's location.
This is a tesseract-shaped car with 8 duocylinder wheels. This scene is designed to verify article *[Transportation in 4D](/archives/trans4d/)(sorry in Chinese)*.

### 4D wheels and gyros
You can select scenes from the control panel. Right click to fire a glome(4D sphere) to interact with these objects.
Here are the rolling cases of 8 types of 4D objects and the contacts on the 3D ground are drawn:
![rolling cases](/img/newtonf001.svg)
What are these 4D shapes respectively?
There are 2 kinds of stable gyroscopes in 4D: dicone and coninder. Others (Like duocone, sphone..) don't have spinning stability.

## Minecraft4D
With 4D Viewer, we can build a 4D game in minecraft style. See [Minecraft 4D tutorial](/programs/mc4tutorial.html) for detail.
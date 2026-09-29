---
title: "Tinkering Tech: Computers, Microcontrollers, and Train Cams"
description: A beginner's guide to connecting a computer to your DCC layout, building small projects with ESP32 and Arduino boards, and adding miniature cameras, with checklists that keep your trains safe.
order: 14
icon: solar:cpu-bolt-bold
---

Model railroading has a tech side, and it welcomes beginners. A laptop can read and save every setting in a locomotive. A small circuit board can make a crossing signal blink. A tiny camera can show the layout from the engineer's seat. This guide covers where to start, what to buy first, and how to avoid the few mistakes that cause real damage.

**Software settings are reversible when you back them up first.** Most tinkering happens in settings and code, and you can undo both.

## Your computer and DCC: meet JMRI

**[DCC](/learn/glossary#dcc-digital-command-control)** (Digital Command Control) sends digital commands through the rails to a small circuit board in each locomotive, called a **decoder**. Each decoder stores its settings in numbered slots called **CVs** (configuration variables). CVs control things like the locomotive's address, top speed, how gently it starts, and which sounds play.

**JMRI** (Java Model Railroad Interface) is free, open-source software that runs on Windows, macOS, and Linux. It contains several tools. Beginners usually meet these three first:

- **DecoderPro** reads a decoder's CVs and shows them as plain labeled settings instead of raw numbers. It saves each locomotive's settings to a roster file on your computer.
- **PanelPro** draws track diagrams and control panels on screen, so you can throw turnouts, show signals, and watch where trains are.
- **WiThrottle server** lets phones and tablets act as wireless throttles over your home Wi-Fi.

### Back up before you change anything

This habit protects you more than any other:

1. Put the locomotive on a **programming track** (a short, electrically isolated piece of track wired to your system's program output).
2. In DecoderPro, read all the CVs and save the roster entry.
3. Change one setting at a time and test it.
4. If you don't like the result, write the saved settings back.

Many decoders also support a factory reset, often by writing a specific value to CV8. Check the decoder's manual for the exact value, and remember that a reset erases custom sound and speed tuning. A backup brings all of that back.

### Phones as throttles

With the WiThrottle server running, free and paid throttle apps connect over Wi-Fi. For example, **Engine Driver** runs on Android and **WiThrottle** runs on iPhone and iPad. An old phone with no SIM card works fine as a spare throttle. Some command stations and wireless add-ons speak the same protocol directly, so you may not need a computer running at all.

### The computer interface

JMRI can't talk to the rails on its own. Your DCC system needs a **computer interface**, usually a USB adapter or a network module made for that brand of command station. Each major DCC manufacturer offers one. Check the JMRI website's list of supported hardware for your system before you buy anything.

### How our layout does it

Our layout runs on JMRI. A computer connects to the DCC system over USB, and JMRI's WiThrottle server lets members drive trains with the Engine Driver app on a pair of Android tablets. The workbench area has its own compact DCC system, an NCE Power Cab.

## Microcontrollers: small boards, big fun

A **microcontroller** is a tiny computer on one chip that runs a single program over and over. Hobby boards such as **Arduino** and **ESP32** plug into your computer by USB, and you program them with free tools like the Arduino IDE. Modelers use them for:

- **Signals:** red, yellow, and green LEDs that change as trains pass.
- **Animation:** servos that move crossing gates, doors, or turnouts slowly and realistically.
- **Sensors:** infrared or light sensors that detect a passing train.
- **Lighting:** flickering welding arcs, building lights that switch on at dusk, or a firebox glow.

The ESP32 adds built-in Wi-Fi and Bluetooth, which makes it handy for wireless projects. Classic Arduino boards like the Uno are simpler and more forgiving for a first build.

### A starter kit

You don't need much. Many "starter kits" bundle most of this:

- A development board (for example, an Arduino Uno or an ESP32 DevKit)
- A USB cable that carries data, not just charging power
- A solderless **breadboard** for building circuits without soldering
- Jumper wires, male-to-male and male-to-female
- An assortment of resistors (220 to 1,000 ohm covers most LED work)
- A bag of LEDs in a few colors
- One or two small hobby servos (for example, the common 9-gram micro servo)
- A separate 5V power supply for servos and larger projects
- A multimeter for checking voltage and continuity

### Voltage rules that save boards

- **5V vs 3.3V:** An Arduino Uno's pins work at 5 volts. An ESP32's pins work at 3.3 volts and are not built to accept 5 volts. Connecting a 5V signal to an ESP32 pin can destroy it. Use a **logic level shifter** between the two, or stick to parts rated for your board's voltage.
- **Always use a resistor with an LED.** Without one, the LED draws too much current and burns out, and it can damage the pin driving it.
- **Power servos separately.** Servos draw bursts of current that can reset or damage a board. Give them their own 5V supply and connect that supply's ground to the board's ground.
- **Never power a microcontroller straight from the track or from household mains.** DCC track power runs well above what these boards accept, and mains voltage is dangerous to you and the board. Use a proper low-voltage supply or a purpose-built regulator.

### DCC-EX: an open-source example

**DCC-EX** is a volunteer-run, open-source project that shows how far this can go. Its EX-CommandStation turns an Arduino board plus a motor driver board into a working DCC command station. It works with JMRI, Engine Driver, and WiThrottle, and it offers both a build-it-yourself path and ready-to-run hardware. Even if you never build one, its documentation explains DCC clearly for beginners.

## Train cams: ride along from the cab

On-board cameras put you in the engineer's seat. Our [layout](/about) uses them so visitors can ride along from a train's point of view. For your own setup, the common choices are:

- **Miniature FPV cameras:** tiny analog cameras from the drone hobby that send live video over a radio link to a small receiver and screen.
- **Small Wi-Fi cameras:** compact boards, such as ESP32 camera modules, that stream video to a phone or computer over your network.

A few things to plan for:

- **Power:** A battery gives the simplest start. Track power works only through a proper regulator or a decoder function output rated for the load, never wired straight across the rails.
- **Mounting:** Flat cars, gondolas, and open cabs make easy hosts. Use removable mounts like double-sided foam tape or a small bracket, so you can take the camera off without damage.
- **Clearance:** Measure against tunnels, bridges, and overhead structures before the first run. A camera that sits too tall will hit something.
- **Heat:** Cameras and transmitters get warm. Leave airflow around them, and keep them away from thin plastic shells that could soften or warp.
- **Streaming basics:** Analog FPV has almost no delay but lower image quality. Wi-Fi streams look sharper but may lag and can drop out on a busy network. Test in the room where you'll run.

## Checklist: a safe first project

Start with a blinking crossing light. It teaches the whole loop of wiring, coding, and testing, and nothing touches the layout.

- Install the Arduino IDE and your board's support package.
- Upload the built-in "Blink" example and watch the onboard LED flash.
- On the breadboard, wire two red LEDs, each through its own resistor, to two output pins.
- Double-check that each LED's longer leg (the positive side) faces the pin, not ground.
- Change the code so the two LEDs alternate, like a railroad crossing.
- Power everything from USB only.
- When it works, save your code with a clear name and a note about the wiring.

## Checklist: before connecting anything to the layout

- Back up every affected locomotive's CVs in DecoderPro.
- Confirm each device's voltage rating and your board's logic level (5V or 3.3V).
- Use a separate, low-voltage power supply. Nothing runs straight from track power or mains.
- Connect grounds between supplies that share signal wires.
- Test the project on the bench first, then on a single isolated section of track.
- Label every new wire at both ends.
- Measure clearance for anything mounted on a car or beside the track.
- Keep a way to cut power fast, like a switch or an unplugged cord within reach.
- If you work on a shared or club layout, ask before connecting anything.

## Keep exploring

- [Glossary of terms](/learn/glossary): plain explanations of rail and model words
- [New to model railroading?](/learn/new-to-model-railroading): the basics of scale, gauge, and DCC
- [About the layout](/about): how our model came to be

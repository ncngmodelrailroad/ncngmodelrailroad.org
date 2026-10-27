---
title: "Tinkering Tech: Computers, Microcontrollers, and Train Cams"
description: Connect a computer to your trains, build a blinking crossing light, and try a train camera.
order: 14
icon: solar:cpu-bolt-bold
updatedDate: 2026-10-01
---

Read [Electronics and DCC Basics](/learn/electronics-dcc-basics) first. It explains decoders, CVs, programming tracks, and safe wiring. This optional guide covers three projects: a computer for your trains, a blinking light, and a train camera.

## The short version

- JMRI is free software that saves locomotive settings and turns phones into train controllers.
- Save a locomotive's settings before you change them.
- A good first electronics project is two blinking crossing lights. It runs from USB and never touches the layout.
- For a first train camera, use a battery-powered camera on a car you can remove.
- **Volunteering?** You do not need your own tools. See [Before your first session](/learn/getting-your-hands-dirty#before-your-first-session).

## What JMRI adds

**JMRI** (Java Model Railroad Interface) is free, open-source software for Windows, macOS, and Linux. Download it from the official JMRI website.

Your **DCC system** (the box that sends power and commands to the track) needs a **computer interface**, usually a USB or network adapter for that brand. Before you buy one, check JMRI's supported-hardware list and its notes for your exact **command station** (the main DCC control box).

JMRI gives a beginner three things:

- **Settings with names.** A **decoder** (the small circuit board inside a locomotive) stores its settings as numbered **CVs**. JMRI's DecoderPro tool shows them with plain labels, such as "Acceleration."
- **Saved copies.** DecoderPro saves each locomotive's settings to a roster file on your computer.
- **Phones as controllers.** JMRI's WiThrottle server lets phones and tablets drive trains over Wi-Fi.

### Back up before you change CVs

A saved copy makes experiments safer, but it is not a perfect undo button. It holds only settings your system can read. Some systems cannot read any. Some decoders have settings that are unreadable, locked, or unknown to DecoderPro.

A backup never includes the decoder's **firmware** (its built-in program) or **sound project** (its recorded sounds). Those need the decoder maker's own tools and files, and a mistake may not be fixable. Leave them alone until you learn that process.

With that limit in mind:

1. Put the locomotive on the **programming track**, a separate track used only for changing settings, set up as [Electronics and DCC Basics](/learn/electronics-dcc-basics) describes. The Power Cab has one track output. In programming mode it changes every decoder on that output, so the locomotive must be alone there.
2. In DecoderPro, read every settings page your system supports. Check that each read worked, then save.
3. Change one setting at a time and test it, so you know which change did what.
4. If you do not like the result, write the saved settings back.

A **factory reset**, often done by writing a value to CV8 (check the decoder's manual), puts settings back to factory defaults and erases your custom ones. It does not repair firmware or a damaged sound project.

### Phones as throttles

A **throttle** is the controller you drive a train with. With the WiThrottle server running, throttle apps connect over Wi-Fi. For example, **Engine Driver** runs on Android. Several WiThrottle-compatible apps run on iPhone and iPad. Pick one that is still updated and lists JMRI or your command station as supported. An old phone or tablet may work if it runs a current app and joins your Wi-Fi.

### How our layout does it

Our layout runs on JMRI. A computer connects to the DCC system over USB. JMRI's WiThrottle server lets members drive trains with the Engine Driver app on Android tablets.

## A first microcontroller project: a crossing light

A **microcontroller** board is a tiny computer that runs one program over and over. **Arduino** and **ESP32** boards plug into a computer by USB. You program them with the free Arduino IDE (a code editor) from the official Arduino website. Modelers use them for signals, crossing gates, sensors, and building lights. Start with two red lights that take turns blinking, like a grade crossing.

### What you need

A boxed starter kit usually includes all of this:

- A development board with a USB port, good documentation, and Arduino IDE support (for example, an Arduino Uno or an ESP32 board)
- A USB cable that carries data, not only charging power
- A **solderless breadboard** (a board that holds parts without soldering) and jumper wires
- Two red **LEDs** (small lights) and two **resistors** (220 to 1,000 ohms). Resistors limit current.

### Voltage rules for this project

- **Know your board's logic level** (the voltage its pins use). Classic Arduino boards such as the Uno use 5V pins. ESP32 pins use 3.3V, and a 5V signal can destroy them. Use parts rated for your board.
- **Give every LED its own resistor.** Without one, the LED pulls too much current and can damage the pin that drives it.
- **Power the project through USB only.** Never connect a board directly to track power or household mains (wall power).

### Build it

1. Install the Arduino IDE and the support package for your board.
2. Upload the built-in "Blink" example and watch the board's small light flash. Some ESP32 boards have no built-in light. Wire one LED and resistor to a pin and change the pin number in the code.
3. On the breadboard, wire each red LED through its own resistor to its own output pin.
4. Check that each LED's longer leg, the positive side, faces the pin, not ground. A backward LED will not light, but it is easy to flip.
5. Change the code so the two LEDs take turns.
6. Save your code with a clear name and a note about the wiring.

Nothing here touches the layout.

**Try later: servos.** A **servo** is a small motor that moves gates or **turnouts** (track switches). Learn servo power first. Servos need their own power supply, matched to their rated voltage and strong enough for all of them moving at once. Never power a servo from a board's signal pin.

## A first train camera

On-board cameras let visitors to our [layout](/about) ride along from the train's point of view. For your own first camera, keep it simple:

- **Use a camera with its own battery.** Small Wi-Fi camera boards and tiny drone cameras both work. Wi-Fi video looks sharper but can lag. Analog drone cameras have little delay but a lower-quality picture.
- **Put it on a car you can remove.** A flat car or a gondola (an open-top car) works well. Double-sided foam tape or a small bracket makes removal easy, but tape can leave residue or lift paint. Test it on a hidden spot first.
- **Check clearance.** Push the car slowly by hand through tunnels, under bridges, and past anything overhead before the first powered run.
- **Check heat.** Cameras, transmitters, and batteries get warm. Leave airflow, keep them off thin plastic shells, and stop if anything gets hot.

**Advanced note: track power and transmitters.** Never wire a camera straight across the rails or straight to a decoder function output. Track power is not the steady power a camera needs. It needs a purpose-built DCC-to-DC power module, or a rectifier, filter capacitor, and regulator matched to the camera. A function output can switch a camera on only through a suitable switching circuit within its current rating. In the US, use a transmitter with an FCC ID only as certified. Some hobby 5.8 GHz video transmitters require an amateur radio license instead. Elsewhere, follow your country's rules for radio transmitters.

## What it costs

Prices are rough US ranges from when this guide was last updated (2026) and will drift. Use them for budgeting, not shopping.

- **Software:** JMRI and Engine Driver are free.
- **Development board alone:** about $10 to $30.
- **Boxed starter kit:** about $40 to $110, depending on the brand.
- **Analog drone-style camera with built-in transmitter:** about $20 to $30, plus about $90 to $130 for a small receiving monitor.
- **Wi-Fi camera board:** about $10 to $25.

## Brands to start with

These are long-established examples, not endorsements. Check reviews of the exact item before you buy.

- **Boards and starter kits:** official Arduino boards and kits, and Espressif ESP32 development boards.
- **Tutorials:** Adafruit and SparkFun publish free beginner guides.

## Before connecting a project to the layout

A bench mistake is cheap. A layout mistake can affect everyone's trains.

1. Confirm each device's voltage rating and your board's logic level.
2. Test the project on the bench first.
3. Check clearances for anything on a car or beside the track.
4. Label every new wire at both ends.
5. On a shared or club layout, get permission before connecting anything.

## Keep exploring

- [Electronics and DCC Basics](/learn/electronics-dcc-basics): wiring, power, and how DCC works
- [Getting Your Hands Dirty](/learn/getting-your-hands-dirty): what to try, when to ask first, and what to leave alone
- [DCC-EX](https://dcc-ex.com), for further reading: an open-source project that builds a DCC command station from Arduino or ESP32 boards

---
title: "Tinkering Tech: Computers, Microcontrollers, and Train Cams"
description: Build a blinking crossing light, connect a computer to your trains, and try a train camera.
order: 14
icon: solar:cpu-bolt-bold
updatedDate: 2026-10-01
---

This guide gets you to a working blinking crossing light on your desk, then shows how a computer and a small camera can add to your trains. Everything here is optional, and the first project never touches the layout. For DCC terms such as decoder, CV, and programming track, see [Electronics and DCC Basics](/learn/electronics-dcc-basics).

## Build a blinking crossing light

A **microcontroller** board is a tiny computer that runs one program over and over. Arduino and ESP32 boards plug into a computer by USB, and you program them with the Arduino IDE, a code editor from the official Arduino website. Your first project is two red lights that take turns blinking, like a grade crossing.

### What you need

A small boxed starter kit usually has all of it:

- A board with a USB port and Arduino IDE support, such as an Arduino Uno or an ESP32 board
- A USB cable that carries data, not only charging power
- A **breadboard**, a board that holds parts without soldering, plus jumper wires
- Two red LEDs and two resistors between 220 and 1,000 ohms

### Three rules for this project

- **Know your board's pin voltage.** Uno pins use 5V. ESP32 pins use 3.3V, and 5V can destroy them.
- **Give every LED its own resistor.** Without one, the LED pulls too much current and can damage the pin.
- **Power it from USB only.** Never connect the board to track power or wall power.

### Build it

1. Install the Arduino IDE and the support package for your board.
2. Upload the built-in "Blink" example and watch the light on the board flash. If your board has no built-in light, wire one LED and resistor to a pin and change the pin number in the code.
3. On the breadboard, wire each LED through its own resistor to its own output pin.
4. Point each LED's longer leg toward the pin. A backward LED stays dark but does no harm. Flip it and try again.
5. Change the code so the two LEDs take turns.
6. Save the code with a clear name and a note about the wiring.

If something does not light, check one wire at a time. Most mistakes here cost nothing.

**Next step: servos.** A **servo** is a small motor that can move a crossing gate or a [turnout](/learn/glossary#turnout-switch). Servos need their own power supply, matched to their voltage and strong enough for all of them at once. Never power a servo from a board pin.

## Connect a computer to your trains

**JMRI** is free software for Windows, macOS, and Linux. Your DCC system needs a computer interface, usually a USB or network adapter for that brand. Check JMRI's supported-hardware list for your system before you buy one.

JMRI gives you three things:

- **Plain labels.** Its DecoderPro tool shows decoder settings with names such as "Acceleration" instead of numbers.
- **Saved copies.** DecoderPro saves each locomotive's settings to a file on your computer.
- **Phones as controllers.** Its WiThrottle server lets throttle apps on phones and tablets drive trains over Wi-Fi. Engine Driver runs on Android, and several compatible apps run on iPhone and iPad.

### Save settings before you change them

1. Put the locomotive alone on the programming track.
2. In DecoderPro, read every page your system supports, check that each read worked, and save.
3. Change one setting at a time and test it.
4. If you do not like the result, write the saved settings back.

A saved copy is not a perfect undo. It holds only settings your system can read, and it never includes the decoder's firmware or sound files. Leave firmware and sound updates alone until you learn the maker's tools.

### How our layout does it

A JMRI computer runs our layout over USB. Members drive trains with the Engine Driver app on Android tablets through JMRI. The workbench has an NCE Power Cab.

## Try a train camera

A small camera on a car shows the layout from the train's point of view. Keep the first one simple:

- **Use a camera with its own battery.** Small Wi-Fi camera boards and tiny drone cameras both work.
- **Mount it on a car you can remove,** such as a flat car or an open-top gondola. Double-sided foam tape works, but test it on a hidden spot because it can lift paint.
- **Check clearance.** Push the car slowly by hand through tunnels and under bridges before the first powered run.
- **Check heat.** Leave airflow around the camera and battery, and stop if anything gets hot.

Small rechargeable camera batteries need careful charging. See [Workshop Safety](/learn/workshop-safety#batteries).

Do not wire a camera to the rails or a decoder output. Track power needs a proper conversion circuit first, so treat that as a later project. Video transmitters also follow radio rules, so buy one with a certification label for your country.

## Before anything touches a layout

1. Test the project on the bench first.
2. Confirm each part's voltage rating.
3. Label every new wire at both ends.
4. On a shared or club layout, ask before you connect anything.

Anything that plugs into the wall belongs on a ready-made, listed power supply. See [Workshop Safety](/learn/workshop-safety#mains-power).

## What it costs

Prices are rough and change over time.

- **JMRI and Engine Driver:** free
- **Board alone:** about $10 to $30
- **Starter kit:** about $40 to $110
- **Camera:** about $10 to $30 for a Wi-Fi camera board or analog drone camera, plus about $90 to $130 for a small monitor if your camera needs one

Adafruit and SparkFun publish free beginner tutorials.

Next: [Electronics and DCC Basics](/learn/electronics-dcc-basics).

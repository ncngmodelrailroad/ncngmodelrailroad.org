---
title: "Tinkering Tech: Computers, Microcontrollers, and Train Cams"
description: Use JMRI safely, then try a simple crossing-light or train-camera project.
order: 14
icon: solar:cpu-bolt-bold
updatedDate: 2026-10-01
---

Read [Electronics and DCC Basics](/learn/electronics-dcc-basics) first. It explains decoders, CVs, programming tracks, and safe wiring. This guide covers the optional next step: a computer for your decoders, a small programmable board, and a camera that rides on a train.

You do not need to buy a tool kit before volunteering. The layout has shared tools for layout work, including an NCE Power Cab at the workbench. [Email before attending](/contact), and ask what is available and what to bring.

## What JMRI adds

**JMRI** (Java Model Railroad Interface) is free, open-source software for Windows, macOS, and Linux. Download it from the official JMRI website. Your DCC system needs a **computer interface**, usually a USB or network adapter for that brand. Before you buy one, check JMRI's supported-hardware list and its notes on limitations for your exact command station.

JMRI gives a beginner three things:

- **Labeled settings.** DecoderPro shows a decoder's CVs as named settings, like "Acceleration," instead of raw numbers.
- **Roster backups.** DecoderPro saves each locomotive's settings to a roster file on your computer.
- **Phone throttles.** JMRI's WiThrottle server lets phones and tablets drive trains over Wi-Fi.

### Back up before you change CVs

A DecoderPro backup reduces the risk of changing CV settings, but it is not a complete restore point. It saves only the CVs your system and DecoderPro can read. Some systems can't read CVs at all, and some decoders have CVs that are write-only, locked, or missing from DecoderPro's definition. A backup never includes a decoder's firmware or sound project. Those need the decoder maker's own tools and files and may not be recoverable, so leave them alone until you know that process.

With that limit in mind:

1. Put the locomotive on the programming track, set up as [Electronics and DCC Basics](/learn/electronics-dcc-basics) describes. The Power Cab has one track output. In programming-track mode it programs every decoder on that output, so the locomotive must be alone there.
2. In DecoderPro, read every settings page your system supports, check that the reads succeeded, and save the roster entry.
3. Change one setting at a time and test it.
4. If you don't like the result, write the saved settings back.

A factory reset, often done by writing a value to CV8 (check the decoder's manual), resets CVs to their defaults and erases your custom settings. It changes CVs only and does not restore firmware or a damaged sound project.

### Phones as throttles

With the WiThrottle server running, throttle apps connect over Wi-Fi. For example, **Engine Driver** runs on Android, and several WiThrottle-compatible apps run on iPhone and iPad. Choose one that is still maintained and lists JMRI or your command station as supported. An old phone or tablet may work if it runs a current compatible app and can join the local Wi-Fi.

### How our layout does it

Our layout runs on JMRI. A computer connects to the DCC system over USB, and JMRI's WiThrottle server lets members drive trains with the Engine Driver app on a pair of Android tablets.

## A first microcontroller project: a crossing light

A **microcontroller** board is a small computer that runs one program over and over. **Arduino** and **ESP32** boards plug into a computer by USB, and you program them with the free Arduino IDE from the official Arduino website. Modelers use them for signals, servo-driven crossing gates, sensors, and building lights. Start with two alternating red lights, like a grade crossing.

### What you need

A boxed starter kit usually includes all of this:

- A development board with a USB port, good documentation, and Arduino IDE support (for example, an Arduino Uno or an ESP32 board)
- A USB cable that carries data, not just charging power
- A solderless breadboard and jumper wires
- Two red LEDs and two resistors (220 to 1,000 ohms)

### Voltage rules for this project

- **Know your board's logic level.** Classic Arduino boards such as the Uno use 5V pins. ESP32 pins use 3.3V and can be destroyed by a 5V signal. Use parts rated for your board.
- **Give every LED its own resistor.** Without one, the LED draws too much current and can damage the pin driving it.
- **Power the project through USB only.** Never connect a board directly to track power or household mains.

### Build it

- Install the Arduino IDE and your board's support package.
- Upload the built-in "Blink" example and watch the onboard LED flash. Some ESP32 boards have no user LED, so wire one LED and resistor to a pin and change the pin number in the code.
- On the breadboard, wire each red LED through its own resistor to its own output pin.
- Check that each LED's longer leg, the positive side, faces the pin, not ground.
- Change the code so the two LEDs alternate.
- Save your code with a clear name and a note about the wiring.

Nothing here touches the layout. When you want to go further, learn servo power before moving gates or turnouts. Servos need their own supply, matched to their rated voltage and able to deliver current for all of them moving at once. Never power a servo from a board's signal pin.

## A first train camera

On-board cameras let visitors to our [layout](/about) ride along from a train's point of view. For your own first camera, keep it simple:

- **Use a battery-powered camera.** Small Wi-Fi camera boards and miniature cameras from the drone hobby both work. Wi-Fi streams look sharper but can lag. Analog drone cameras have little delay but lower image quality.
- **Mount it on a removable car.** A flat car or gondola works well. Double-sided foam tape or a small bracket makes removal easier, but tape can leave residue or lift paint, so test it on a hidden spot first.
- **Check clearance.** Push the car slowly through tunnels, bridges, and past overhead structures before the first powered run.
- **Check heat.** Cameras, transmitters, and batteries get warm. Leave airflow, keep them off thin plastic shells, and stop if anything gets hot.

**Advanced note: track power and transmitters.** Never wire a camera straight across the rails or straight to a decoder function output. Track power needs a purpose-built DCC-to-DC power module, or a rectifier, filter capacitor, and regulator matched to the camera. A function output can switch a camera only through a suitable switching circuit within its current rating. In the US, use a transmitter with an FCC ID only as certified. Some hobby 5.8 GHz video transmitters require an amateur radio license instead. Elsewhere, follow your country's rules for radio transmitters.

## What it costs

Prices are rough US ranges from when this guide was last updated (2026) and will drift. Use them for budgeting, not shopping.

- **Software:** JMRI and Engine Driver are free.
- **Development board alone:** about $10 to $30.
- **Boxed starter kit:** about $40 to $110, depending on the brand.
- **Analog drone-style camera with built-in transmitter:** about $20 to $30, plus about $90 to $130 for a small receiving monitor.
- **Wi-Fi camera board:** about $10 to $25.

## Before connecting a project to the layout

- Confirm each device's voltage rating and your board's logic level.
- Test the project on the bench first.
- Check clearances for anything on a car or beside the track.
- Label every new wire at both ends.
- On a shared or club layout, get permission before connecting anything.

## Keep exploring

- [Electronics and DCC Basics](/learn/electronics-dcc-basics): wiring, power, and how DCC works
- [Getting Your Hands Dirty](/learn/getting-your-hands-dirty): what to try, when to ask first, and what to leave alone
- [Further reading: DCC-EX](https://dcc-ex.com): an open-source project that builds a DCC command station from Arduino or ESP32 boards

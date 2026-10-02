---
title: "Tinkering Tech: Computers, Microcontrollers, and Train Cams"
description: A beginner's guide to connecting a computer to your DCC layout, building small projects with ESP32 and Arduino boards, and adding miniature cameras, with checklists that keep your trains safe.
order: 14
icon: solar:cpu-bolt-bold
updatedDate: 2026-10-01
---

Model railroading has a tech side, and it welcomes beginners. A laptop can read and save a locomotive's decoder settings. A small circuit board can make a crossing signal blink. A tiny camera can show the layout from the engineer's seat.

**Most settings can be restored when you back them up first.** Most tinkering happens in decoder settings and your own code, and a backup lets you undo most of it. The exceptions are decoder firmware, sound files, and settings your system can't read, covered below.

**You do not need to buy a tool kit before volunteering.** The layout has shared tools for layout work, including an NCE Power Cab at the workbench. [Email before attending](/contact), and ask what is available and what to bring. The shopping lists in this guide are for projects at home.

JMRI and Engine Driver are free. Other prices in this guide are rough US estimates, checked in October 2026, and they vary by store and brand.

## Your computer and DCC: meet JMRI

**[DCC](/learn/glossary#dcc-digital-command-control)** (Digital Command Control) sends digital commands through the rails to a small circuit board in each locomotive, called a **decoder**. Each decoder stores its settings in numbered slots called **CVs** (configuration variables). CVs control things like the locomotive's address, top speed, how gently it starts, and which sounds play.

**JMRI** (Java Model Railroad Interface) is free, open-source software that runs on Windows, macOS, and Linux. It contains several tools. Beginners usually meet these three first:

- **DecoderPro** reads a decoder's CVs and shows them as plain labeled settings instead of raw numbers. It saves each locomotive's settings to a roster file on your computer.
- **PanelPro** draws track diagrams and control panels on screen, so you can throw turnouts, show signals, and, if your layout has occupancy detectors, watch where trains are.
- **WiThrottle server** lets phones and tablets act as wireless throttles over your home Wi-Fi.

### Back up before you change anything

This habit protects you more than any other:

1. Put the locomotive alone on a **programming track**, a short piece of track used only for programming. Some systems have a separate program output. Others, like the NCE Power Cab at our workbench, use one output for both. In program-track mode, every decoder connected to that output gets programmed, so connect it only to an isolated programming track, or disconnect the rest of the layout first.
2. In DecoderPro, read all the CVs (use "Read All Sheets" where your system supports it), check that the reads succeeded, and save the roster entry.
3. Change one setting at a time and test it.
4. If you don't like the result, write the saved settings back.

A DecoderPro backup covers only the CV settings it can read. Some systems can't read CVs at all, and some decoders have CVs that are write-only, locked, or missing from DecoderPro's definition for that model, so treat the backup as a good record, not a guaranteed full restore. It also does not save a decoder's sound project or firmware. Those need the decoder maker's own tools and files, and you may not be able to recover them, so leave them alone until you know that process.

Many decoders also support a factory reset, often by writing a specific value to CV8. Check the decoder's manual for the exact value. A reset returns the CVs to their defaults and erases your custom speed and sound settings. It does not restore a replaced or damaged sound project. Writing your DecoderPro backup back to the decoder restores the CV settings it saved.

### Phones as throttles

With the WiThrottle server running, free and paid throttle apps connect over Wi-Fi. For example, **Engine Driver** runs on Android and **WiThrottle** runs on iPhone and iPad. An old phone with no SIM card works fine as a spare throttle.

### The computer interface

JMRI can't talk to the rails on its own. Your DCC system needs a **computer interface**, usually a USB adapter or a network module made for that brand of command station. Most DCC manufacturers offer one, but features vary by system. Check JMRI's supported-hardware list, and its notes on limitations, for your exact command station before you buy.

### How our layout does it

Our layout runs on JMRI. A computer connects to the DCC system over USB, and JMRI's WiThrottle server lets members drive trains with the Engine Driver app on a pair of Android tablets. The workbench area has its own compact DCC system, an NCE Power Cab.

## Microcontrollers: small programmable boards

A **microcontroller** is a tiny computer on one chip that runs a single program over and over. Hobby boards such as **Arduino** and **ESP32** plug into your computer by USB, and you program them with free tools like the Arduino IDE. Modelers use them for:

- **Signals:** red, yellow, and green LEDs that change as trains pass.
- **Animation:** servos that move crossing gates, doors, or turnouts slowly and realistically.
- **Sensors:** infrared or light sensors that detect a passing train.
- **Lighting:** flickering welding arcs, building lights that switch on at dusk, or a firebox glow.

The ESP32 has built-in Wi-Fi and Bluetooth and uses 3.3V logic. The classic Arduino Uno has no wireless and uses 5V logic.

### A starter kit for home projects

You don't need much. A development board alone runs about $10 to $30. A boxed starter kit with a board, breadboard, wires, LEDs, and parts runs about $40 to $110, depending on the brand. Many kits bundle most of this:

- A development board (for example, an Arduino Uno or an ESP32 DevKit)
- A USB cable that carries data, not just charging power
- A solderless **breadboard** for building circuits without soldering
- Jumper wires, male-to-male and male-to-female
- An assortment of resistors (220 to 1,000 ohm covers most LED work)
- A bag of LEDs in a few colors
- One or two small hobby servos (for example, the common 9-gram micro servo)
- A separate power supply for servos and larger projects, matched to their rated voltage
- A multimeter for checking voltage and continuity

### Voltage rules that save boards

- **5V vs 3.3V:** An Arduino Uno's pins work at 5 volts. An ESP32's pins work at 3.3 volts and are not built to accept 5 volts. Connecting a 5V signal to an ESP32 pin can destroy it. Use a **logic level shifter** between the two, or stick to parts rated for your board's voltage.
- **Always use a resistor with an LED.** Without one, the LED draws too much current and burns out, and it can damage the pin driving it.
- **Power servos separately.** Servos draw bursts of current that can reset or damage a board. Never power a servo from a board's signal pin. Give servos their own supply, matched to their rated voltage and able to deliver enough current for all of them moving at once. For simple, non-isolated low-voltage circuits like this, connect that supply's ground to the board's ground.
- **Never power a microcontroller straight from the track or from household mains.** DCC track power runs well above what these boards accept, and mains voltage is dangerous to you and the board. Use a proper low-voltage supply or a purpose-built DCC-to-DC power module.

### DCC-EX: an open-source example

**DCC-EX** is a volunteer-run, open-source project that builds a DCC command station from hobby boards. Its EX-CommandStation turns a supported microcontroller board (such as an Arduino Mega or a supported ESP32 board) plus a compatible motor driver into a working DCC command station. Check DCC-EX's current supported-hardware list before you buy parts. It works with JMRI, Engine Driver, and WiThrottle, and it offers both a build-it-yourself path and ready-to-run hardware. A basic do-it-yourself build (board, motor driver, and track power supply) runs about $75 to $120. The ready-to-run command station costs about $120 to $160, depending on whether you add a power supply.

## Train cams: ride along from the cab

On-board cameras put you in the engineer's seat. Our [layout](/about) uses them so visitors can ride along from a train's point of view. For your own setup, the common choices are:

- **Miniature FPV cameras:** tiny analog cameras from the drone hobby that send live video over a radio link to a small receiver and screen. A combined camera and transmitter runs about $20 to $30, and a small receiving monitor about $90 to $130.
- **Small Wi-Fi cameras:** compact boards, such as ESP32 camera modules, that stream video to a phone or computer over your network. These boards run about $10 to $25.

A few things to plan for:

- **Power:** A battery gives the simplest start. Use track power only through a purpose-built DCC-to-DC power module, or a rectifier, filter capacitor, and regulator matched to the camera's voltage and current. To switch the camera from a decoder function output, have the output drive a suitable switching circuit within its current rating. Never wire a camera straight across the rails or straight to a function output.
- **Mounting:** Flat cars, gondolas, and open cabs make easy hosts. Removable mounts, like double-sided foam tape or a small bracket, make the camera easier to take off. Tape can lift paint or decals, so test it on a hidden spot first.
- **Clearance:** Measure against tunnels, bridges, and overhead structures before the first run. A camera that sits too tall will hit something.
- **Heat:** Cameras and transmitters get warm. Leave airflow around them, and keep them away from thin plastic shells that could soften or warp.
- **Streaming basics:** Analog FPV has almost no delay but lower image quality. Wi-Fi streams look sharper but may lag and can drop out on a busy network. Test in the room where you'll run.
- **Radio rules:** In the US, look for an FCC ID on the transmitter and use it only as certified. Many hobby 5.8 GHz FPV transmitters are not certified for unlicensed use and need an amateur radio license to operate legally. Check your local rules before you transmit.

## Checklist: a safe first project

Start with a blinking crossing light. Nothing touches the layout.

- Install the Arduino IDE and your board's support package.
- Upload the built-in "Blink" example and watch the onboard LED flash. Some ESP32 boards have no user LED, so wire one LED and resistor to a pin and change the pin number in the code.
- On the breadboard, wire two red LEDs, each through its own resistor, to two output pins.
- Double-check that each LED's longer leg (the positive side) faces the pin, not ground.
- Change the code so the two LEDs alternate, like a railroad crossing.
- Power everything from USB only.
- When it works, save your code with a clear name and a note about the wiring.

## Checklist: before connecting anything to the layout

- Back up every affected locomotive's CVs in DecoderPro.
- Confirm each device's voltage rating and your board's logic level (5V or 3.3V).
- Use a low-voltage power supply matched to each device. Nothing runs straight from track power or mains. Anything powered from the track goes through a proper DCC-to-DC power module.
- For simple, non-isolated low-voltage circuits, connect grounds between supplies that share signal wires. For DCC interfaces and other commercial modules, follow the maker's wiring diagram, because some are isolated on purpose.
- Test the project on the bench first, then on a single isolated section of track.
- Label every new wire at both ends.
- Measure clearance for anything mounted on a car or beside the track.
- Keep a way to cut power fast, such as a switched power strip, a switched outlet, or a plug you can pull without reaching across the project.
- If you work on a shared or club layout, ask before connecting anything.

## Keep exploring

- [Electronics and DCC basics](/learn/electronics-dcc-basics): wiring, power, and how DCC works
- [Your first workbench](/learn/first-workbench-tools): the hand tools that make projects easier
- [Getting your hands dirty](/learn/getting-your-hands-dirty): what you can safely try, and how to recover
- [Glossary of terms](/learn/glossary): plain explanations of rail and model words
- [New to model railroading?](/learn/new-to-model-railroading): the basics of scale, gauge, and DCC
- [About the layout](/about): how our model came to be

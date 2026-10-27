---
title: Electronics and DCC Basics
description: A beginner's guide to meters, soldering, DCC, LED lights, and staying safe around model railroad wiring.
order: 13
icon: solar:plug-circle-bold
updatedDate: 2026-10-01
---

Model railroads run on low voltage, so this is a good place to learn electronics from zero. Two habits keep you safe: turn the power off before you touch wiring, and use a meter to find problems. The one thing to respect is a short circuit, which can make wires and rails hot.

**New to all of this?** Read the short version and the safety section. Then skip to [Before you touch the layout wiring](#before-you-touch-the-layout-wiring). Come back to the rest when a project needs it.

## The short version

- The rails use low voltage. Wall outlets use high voltage that can hurt you. Never open or work inside anything plugged into the wall.
- Unplug the system before you touch any wiring.
- At the club, ask an experienced member before you change layout wiring.
- **Volunteering?** You do not need your own tools. See [Before your first session](/learn/getting-your-hands-dirty#before-your-first-session).

## Low voltage and wall power are different worlds

Voltage is how hard electricity pushes.

- **Track power is low voltage.** A DCC system puts about 12 to 22 volts on the rails. Touching the rails by accident normally carries little shock risk. Still, take off rings and watches, keep your hands dry, and turn the power off before you work.
- **Wall power is high voltage.** The 120 volts in a wall outlet, called mains voltage, can injure or kill. Hobby work never needs you inside it.
- **Never open a power supply.** A power supply, the box that turns wall power into track power, can hold a stored charge even when unplugged. If one misbehaves, replace it.
- **Respect short circuits.** A short is a path that lets power skip the locomotive, such as a metal tool lying across both rails. Good systems shut off fast. A short left in place can still make a wire or rail very hot.

## Your multimeter

A **digital multimeter** is a handheld tester. It measures voltage (push), resistance (how hard it is for power to flow), and continuity (whether two points connect).

Follow these steps before you touch anything powered:

1. Plug the black lead into the jack marked COM.
2. Plug the red lead into the jack marked V.
3. Turn the dial to a voltage setting.

Never put a meter set for continuity, resistance, or current across powered rails. On those settings it acts like a wire, so it can short the track or damage the meter.

- **Continuity** works with the power off. The meter beeps if the two points connect. Use it to find broken feeder wires and hidden shorts. A beep does not prove a joint can carry a running train's power.
- **DC voltage** (a V with a straight line) is for batteries and lighting adapters.
- **AC voltage** (a V with a wavy line) is the setting people use for DCC track.
- **Compare readings instead of chasing exact numbers.** You want the same reading on every section of track.

**Advanced note:** DCC power is a fast square wave, not smooth AC, so many meters read it low. A true RMS meter helps only if it is rated for several kilohertz. A dedicated DCC meter, or a rectifier adapter for a DC meter, gives the most reliable numbers.

## Soldering basics

Soldering joins wires with melted metal called **solder**. Early joints are often lumpy, and that is normal. Make your first joints on two pieces of scrap wire at your own bench.

- **A temperature-controlled iron.** It holds a steady heat you choose. Keep each touch short, because a hot iron melts plastic quickly.
- **Rosin-core electronics solder.** Never use acid-core solder. It is for plumbing and eats away at wiring. Lead-free solder melts about 35 C (60 F) hotter than leaded solder and flows less easily, so set the iron hotter and use extra flux. Wash your hands before you eat or drink after handling either kind.
- **Flux.** A paste or liquid that helps solder flow. After the iron is off and the work has cooled, wipe off the leftover flux with isopropyl alcohol. Keep the alcohol capped and away from the iron, because it catches fire easily.
- **Eye and lung protection.** Wear safety glasses. Use fume extraction, a small fan with a filter, to pull rosin smoke away from your face. Rosin fumes can irritate your lungs and can cause asthma with repeated exposure.
- **Heat-shrink tubing.** A plastic sleeve that shrinks to cover a joint. Slide it onto the wire, well away from the joint, before you solder. After the joint cools, move it over the bare metal and shrink it with a heat gun, not an open flame.

To make a joint:

1. Touch the iron to both wires to heat them. Heat the joint, not the solder.
2. Feed solder into the joint.
3. Pull the iron away as soon as the solder flows.

A good joint is smooth, covers both wires, holds when tugged gently, and has no cracks or blobs. Lead-free joints often look dull. Judge by shape and grip, not shine.

Soldering to rail on a finished layout can melt the plastic ties and damage scenery. On the club layout, do it only with approval and with an experienced member beside you.

## Wire, feeders, and bus wiring

Most layouts run a pair of thick **bus wires** under the table. Short, thinner **feeder** wires drop from the bus to the rails every few feet. This gives every piece of track steady power. Wire thickness is measured in gauge (AWG). Smaller numbers mean thicker wire. Use one color for each rail everywhere, so future repairs go faster.

## DCC in plain terms

**[DCC](/learn/glossary#dcc-digital-command-control)** (Digital Command Control) is a way to run many trains on the same track. When the system is on, the rails carry power plus digital commands. Each locomotive listens only for the commands meant for it.

![Diagram of a DCC system. A throttle sends commands to the command station, which passes them to the booster. The booster powers the track, and a decoder inside each locomotive reads the commands.](/images/learn/dcc-signal-path.svg)

- **Throttle or cab.** The controller you drive with. It can be wired, radio, or a phone app.
- **Command station.** The brain. It turns what you do on the throttle into commands.
- **Booster.** The muscle. It puts those commands on the rails as track power.
- **Decoder.** A small circuit board inside the locomotive that controls the motor, lights, and sound. Each decoder has an **address**, a number you use to pick that locomotive, often the number painted on its side.
- **Consist.** Two or more locomotives set to run together as one unit.
- **Programming track.** The track you use to set a decoder's address and settings. Those settings are stored as numbered **CVs** (configuration variables), such as how fast the locomotive speeds up and its top speed. The Power Cab at our workbench has a single track output. Programming from that output can change every decoder connected to it, so connect only the locomotive you mean to change.
- **Power districts and circuit breakers.** Bigger layouts often split the track into districts, each with its own breaker, so a short shuts down only one section. Breaker testing belongs to whoever maintains the layout's power districts.

Equipment that follows NMRA DCC standards generally works together for basic functions, across makers such as NCE, Digitrax, and ESU. Throttles and control networks usually work only with their own brand.

At our layout:

- **The workbench** has an NCE Power Cab, a compact system that combines throttle, command station, and booster in one.
- **On the layout**, members run trains with the Engine Driver app on Android tablets. The tablets connect over Wi-Fi to JMRI, free software on a computer that links to the layout's DCC system by USB.

Your own throttles and decoders may not work with ours, so ask before you connect them to the layout.

## LED lighting basics

- **Always limit the current.** An LED on its own draws more and more current (flow of electricity) until it burns out. Wire a resistor, a small part that slows the flow, in series (in a line) with it. Prewired LEDs often include one. For 12 to 14 volt hobby circuits, about 1,000 ohms is a common, safe starting value.
- **Mind the polarity.** Polarity means which side is positive. An LED passes current only one way. The longer leg is positive (the anode). Many LEDs handle only a few volts backward, so wiring one backward at 12 volts or more can ruin it.
- **On DCC track power or any AC supply**, the polarity flips back and forth all the time. Protect the LED in one of three ways: wire a diode across it pointing the opposite way (antiparallel), feed it through a bridge rectifier, or use a lighting board built for DCC.

## What to buy for home projects

For layout work, first ask what shared tools are available. Prices are rough US ranges from when this guide was last updated (2026) and will drift. Use them for budgeting, not shopping.

### Basic soldering kit

About $120 to $210 with a compact iron, if you already own a suitable power adapter. About $210 to $300 with a bench station. Fume extraction costs extra.

- **Safety glasses** marked ANSI Z87.1.
- **Digital multimeter** (about $20 to $35). Look for autoranging (it picks the range for you), a continuity beeper, fused inputs, a CAT II or CAT III safety rating, and an independent certification mark such as UL, ETL, CSA, or TÜV.
- **Temperature-controlled soldering iron** with a stand and tip cleaner (compact, about $25 to $40; bench station, about $115 to $130). Pick one with easy-to-find replacement tips. Hakko and Weller are examples.
- **Thin rosin-core electronics solder** (about $10 to $16) and **rosin flux** (about $8 to $17).
- **Wire strippers** (about $12 to $25) and **basic electronics flush cutters** (about $7 to $11).
- **Heat-shrink tubing** (about $8 to $15), a **heat gun** (about $20 to $35), and fume extraction.

### Optional: DCC for a home layout

Only if you are building your own layout:

- **Basic non-sound starter set** (command station, booster, and throttle in one): about $195 to $235. A Power Cab-class system runs about $215 to $220.
- **Decoder without sound**: about $20 to $40 for HO; larger O-scale decoders cost roughly twice that.
- **Sound decoder**: about $70 to $150 for HO; about $165 to $220 for O scale.

## Brands to start with

These are long-established examples, not endorsements. Check reviews of the exact item before you buy.

- **Solder and flux:** Kester and MG Chemicals.
- **Strippers and cutters:** Klein Tools strippers and Xuron cutters.
- **DCC systems:** NCE, Digitrax, and ESU.
- **Decoders:** TCS, SoundTraxx, and ESU.

## Before you touch the layout wiring

Our layout has been growing since 1986. Its wiring holds years of work you cannot see from the top. Follow these steps every time.

1. **Ask an experienced member first.** Check that you may do the work and which areas need care.
2. **Turn off and unplug the system.** Tell everyone in the room you have done it.
3. **Match the wiring already there.** Follow the colors and methods in place.
4. **Test before you cut.** Use continuity to confirm which wire goes where.
5. **Label anything you disconnect.**
6. **Keep solder, the iron, and tools off the track** and away from scenery.
7. **After a wiring change, ask the person responsible for the layout how they want it tested.**
8. **Write down what you changed** so the next person can follow your work.

## Keep exploring

- [Glossary](/learn/glossary): model and rail words in plain English
- [Your First Workbench](/learn/first-workbench-tools): the hand tools that come before a soldering iron
- [Tinkering Tech](/learn/tinkering-tech): JMRI, microcontrollers, and train cameras

### Further reading

- [Wiring for DCC](https://www.wiringfordcc.com): a free reference on feeders, buses, boosters, and troubleshooting
- [JMRI](https://www.jmri.org), which runs on the layout computer, and [Engine Driver](https://enginedriver.mstevetodd.com), the Android throttle app used on the layout

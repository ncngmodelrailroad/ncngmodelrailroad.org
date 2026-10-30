---
title: Electronics and DCC Basics
description: Learn to use a meter, solder a wire, light an LED, and understand how DCC runs the trains.
order: 13
icon: solar:plug-circle-bold
updatedDate: 2026-10-01
---

By the end of this guide you will be able to test a wire with a meter, make a solder joint, and follow how a command from a throttle reaches a locomotive. Model railroads run on low voltage, and most mistakes are fixable.

## Before you touch the layout wiring

Our layout has been growing since 1986, and its wiring holds years of hidden work. Follow these steps every time.

1. **Ask an experienced member first** which areas need care.
2. **Turn off and unplug the system,** and tell everyone in the room.
3. **Match the wiring already there.** Follow the colors and methods in place.
4. **Disconnect one end of a wire before a continuity test.** On a connected layout, the meter can beep through other wires, rails, or locomotives, so a beep does not prove which wire is which. Still unsure? Ask before you cut.
5. **Label anything you disconnect.**
6. **Keep solder, the iron, and tools off the track** and away from scenery.
7. **After a wiring change, ask the person responsible for the layout how it should be tested.**
8. **Write down what you changed** so the next person can follow your work.

## Low voltage and wall power

- **Track power is low voltage,** about 12 to 22 volts on a DCC layout. Touching the rails by accident carries little shock risk. Turn the power off before you work anyway.
- **Wall power is a different world.** Hobby work never needs you inside anything plugged into the wall, and you should never open a power supply. See [Workshop Safety](/learn/workshop-safety#mains-power).
- **Respect short circuits.** A short is a path that lets power skip the locomotive, such as a metal tool lying across both rails. Good systems shut off fast, but a short left in place can make a wire or rail hot.

## First project: test a wire with a meter

A **multimeter** is a handheld tester. Grab two pieces of scrap wire and try this at your own bench.

1. Plug the black lead into the jack marked COM and the red lead into the jack marked V.
2. Turn the dial to the continuity setting (often a speaker or sound-wave symbol).
3. Touch the two probes together. The meter beeps.
4. Touch one probe to each end of a wire. A beep means the wire connects end to end. Two separate wires stay silent.

Use continuity, with the power off, to find broken wires and hidden shorts.

To read voltage, switch the dial to a voltage setting first. Never put a meter set for continuity or resistance across powered rails; on those settings it acts like a wire and can short the track. For DCC track, people use the AC voltage setting (a V with a wavy line). DCC confuses many meters, so compare readings between track sections instead of chasing an exact number.

## Second project: solder two wires

Soldering joins wires with melted metal called **solder**. Early joints are often lumpy, and that is normal. Practice on scrap wire.

1. Strip about a quarter inch of insulation from each wire and twist the bare ends together.
2. Touch the hot iron to the wires to heat them. Heat the joint, not the solder.
3. Feed solder into the joint until it flows through the wires.
4. Pull the iron away and let the joint cool without moving it.

A good joint is smooth, covers both wires, and holds when tugged gently. Lead-free joints often look dull, so judge by shape and grip, not shine. Cover the bare metal with **heat-shrink tubing**, a plastic sleeve you slide on before soldering and shrink afterward.

Three rules for the bench:

- Use rosin-core electronics solder, never acid-core plumbing solder.
- Always put the iron back in its stand, and wear safety glasses.
- Work with fresh air, and wash your hands before you eat.

For lead, fumes, and cleanup, see [Workshop Safety](/learn/workshop-safety#soldering-and-lead). Soldering to rail on a finished layout can melt plastic ties and scenery, so on the club layout do it only with an experienced member beside you.

## How layout wiring is arranged

Most layouts run a pair of thick **bus wires** under the table. Short, thinner **feeder** wires drop from the bus to the rails every few feet, so every piece of track gets steady power.

## DCC in plain terms

**[DCC](/learn/glossary#dcc-digital-command-control)** lets many trains run on the same track. The rails carry power plus digital commands, and each locomotive listens only for the commands meant for it.

![Diagram of a DCC system. A throttle sends commands to the command station, which passes them to the booster. The booster powers the track, and a decoder inside each locomotive reads the commands.](/images/learn/dcc-signal-path.svg)

- **Throttle:** the controller you drive with.
- **Command station:** turns what you do on the throttle into commands.
- **Booster:** puts those commands on the rails as track power.
- **Decoder:** a small circuit board inside the locomotive that controls the motor, lights, and sound. Each one has an **address**, a number you use to pick that locomotive.
- **CVs:** numbered settings stored in the decoder, such as top speed. You change them on a programming track.

At our layout, the workbench has an NCE Power Cab, which combines throttle, command station, and booster in one box. It has a single track output, so programming from it can change every decoder connected to it. Connect only the locomotive you mean to change. On the layout, a JMRI computer runs the DCC system over USB, and members drive trains with the Engine Driver app on Android tablets through JMRI. Ask before you connect your own throttle or decoder.

## Light an LED

- **Add a resistor.** An LED alone draws more and more current until it burns out. Wire a resistor in line with it. For 12 to 14 volt hobby circuits, about 1,000 ohms is a safe starting value. Prewired LEDs often include one.
- **Mind the direction.** An LED passes current only one way, and the longer leg is positive. Backward at 12 volts, it can fail.
- **On DCC track power,** the direction flips constantly. Use a lighting board built for DCC, or wire a second diode across the LED pointing the other way.

For battery-powered lighting, see [Workshop Safety](/learn/workshop-safety#batteries).

## A small practice kit

Buy nothing before your first club visit; the club has shared tools. When you want to practice at home, this is enough:

- A basic temperature-controlled soldering iron with a stand
- Thin rosin-core electronics solder, such as Kester
- An inexpensive digital multimeter with a continuity beeper
- Wire strippers
- A bundle of scrap hookup wire

Expect roughly $60 to $100 for the set. Prices are rough and change over time.

Optional upgrades: heat-shrink tubing, flush cutters such as Xuron, a small fume fan, and a bench soldering station.

Next: [Tinkering Tech](/learn/tinkering-tech)

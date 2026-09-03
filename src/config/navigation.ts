/**
 * Site navigation.
 *
 * The desktop bar has room for roughly seven slots inside the 76rem shell
 * before items start wrapping onto a second line. Anything past that belongs in
 * `children`, which renders as a disclosure on desktop and as an indented group
 * in the mobile menu, so no destination becomes unreachable.
 */
export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  cta?: boolean;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Explore Map', href: '/map/', icon: 'solar:map-bold' },
  { label: 'Events', href: '/events', icon: 'solar:calendar-bold' },
  { label: 'Gallery', href: '/gallery', icon: 'solar:camera-bold' },
  { label: 'Trains', href: '/trains', icon: 'solar:tram-bold' },
  { label: 'Learn', href: '/learn', icon: 'solar:book-bold' },
  {
    label: 'More',
    children: [
      { label: 'Volunteer', href: '/volunteer' },
      { label: 'Contact', href: '/contact' },
      { label: 'Board', href: '/board-members' },
      { label: 'Links', href: '/links' },
    ],
  },
  { label: 'Get Involved', href: '/donate', cta: true },
];

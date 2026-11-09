import { TRANSLATION_ENABLED, useLanguage } from '../i18n/LanguageContext.jsx'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search, Menu, X, ChevronDown, ArrowRight, Users, Eye, Info, ClipboardList,
  FileText, Stamp, KeyRound, Megaphone, ShieldCheck, Landmark, Building, Boxes,
  Star, Bus, Navigation, MapPin, Building2, Store, LayoutGrid, Plane, Warehouse,
  Users2, ShoppingBag, Luggage, BedDouble, Link2, HeartPulse, Briefcase, Phone,
  ParkingCircle, Compass, Mountain, Waves, Tent, Utensils, Coffee, Wifi,
} from 'lucide-react'
import Logo from './Logo.jsx'
import LanguageSwitch from './LanguageSwitch.jsx'

/* ----------------------------- nav config ----------------------------- */
/* Top-level menu names follow the brand design; every page is grouped below. */

const menus = [
  {
    label: 'Experience at RAK',
    columns: 2,
    groups: [
      {
        heading: 'Discover',
        items: [
          { label: 'Things to Do', icon: Compass, to: '/things-to-do' },
          { label: 'Adventure & Mountains', icon: Mountain, to: '/adventure-mountains' },
          { label: 'Beaches & Islands', icon: Waves, to: '/beaches-islands' },
          { label: 'Culture & Heritage', icon: Landmark, to: '/culture-heritage' },
        ],
      },
      {
        heading: 'Enjoy',
        items: [
          { label: 'Desert Experiences', icon: Tent, to: '/desert-experiences' },
          { label: 'Family Activities', icon: Users, to: '/family-activities' },
          { label: 'Dining & Nightlife', icon: Utensils, href: 'https://visitrasalkhaimah.com/things-to-do/food-drinks/' },
          { label: 'Hotels in RAK', icon: BedDouble, href: 'https://visitrasalkhaimah.com/plan-your-trip/accommodations/' },
        ],
      },
    ],
  },
  {
    label: 'Fly',
    columns: 2,
    groups: [
      {
        heading: 'Travel Information',
        items: [
          { label: 'Flight Information', icon: Plane, to: '/flights' },
          { label: 'Luggage & Check-In', icon: Luggage, to: '/luggage-checkin' },
        ],
      },
      {
        heading: 'Operations & Procedures',
        items: [
          { label: 'Operating Rules & Regulations', icon: ClipboardList, to: '/operations' },
          { label: 'Landing Permissions & Procedures', icon: FileText, to: '/landing-permissions' },
          { label: 'Requirements of Crew - Immigration', icon: Stamp, to: '/crew-immigration' },
          { label: 'Airside Driving License', icon: KeyRound, to: '/apron-driving-license' },
          { label: 'RAK Airport PRO', icon: Megaphone, to: '/airport-pro' },
          { label: 'Authorities', icon: ShieldCheck, to: '/authorities' },
        ],
      },
    ],
  },
  {
    label: 'Services',
    columns: 2,
    groups: [
      {
        heading: 'Facilities',
        items: [
          { label: 'Facilities & Services', icon: Building, to: '/facilities' },
          { label: 'Free Wi-Fi & Internet', icon: Wifi, to: '/wifi' },
          { label: 'Parking', icon: ParkingCircle, to: '/parking' },
          { label: 'Cargo Facilities', icon: Boxes, to: '/cargo' },
          { label: 'VIP Handling Services', icon: Star, to: '/vip-handling' },
        ],
      },
      {
        heading: 'Getting There',
        items: [
          { label: 'Public Transport', icon: Bus, to: '/public-transport' },
          { label: 'Airport Free Bus Service', icon: Navigation, to: '/bus-service' },
          { label: 'Location Map', icon: MapPin, to: '/map' },
        ],
      },
    ],
  },
  {
    label: 'Shop & Dine',
    columns: 1,
    groups: [
      {
        items: [
          { label: 'RAK Duty Free', desc: 'Shop the world, tax-free', icon: ShoppingBag, to: '/duty-free' },
          { label: 'Cafés & Bars', desc: 'Coffee, dining & lounges', icon: Coffee, to: '/cafes-bars' },
        ],
      },
    ],
  },
  {
    label: 'More',
    columns: 2,
    align: 'right',
    groups: [
      {
        heading: 'Business Opportunities',
        items: [
          { label: 'Business Opportunities', icon: Building2, to: '/business' },
          { label: 'Advertising At RAK Airport', icon: Megaphone, to: '/advertising' },
          { label: 'Retail Space', icon: Store, to: '/retail-space' },
          { label: 'Office Space', icon: LayoutGrid, to: '/office-space' },
          { label: 'Corporate Aviation', icon: Star, to: '/corporate-aviation' },
          { label: 'Passenger Airline Operations', icon: Plane, to: '/passenger-operations' },
          { label: 'Maintenance Facilities', icon: Warehouse, to: '/maintenance-facilities' },
          { label: 'Operators in RAK Airport', icon: Users2, to: '/operators' },
        ],
      },
      {
        heading: 'Company',
        items: [
          { label: 'Careers', icon: Briefcase, to: '/careers' },
          { label: 'About Us', icon: Info, to: '/about' },
          { label: 'Management Team', icon: Users, to: '/management' },
          { label: 'Mission & Vision', icon: Eye, to: '/mission' },
          { label: 'Useful Links', icon: Link2, to: '/useful-links' },
          { label: 'Contact', icon: Phone, to: '/contact' },
        ],
      },
    ],
  },
]

/* menu width by column count */
const widthByCols = { 1: 'w-72', 2: 'w-[540px]', 3: 'w-[760px]' }

/* ----------------------------- components ----------------------------- */

function MenuItem({ item, onClick, delay }) {
  const { t: tr, language } = useLanguage()
  const Icon = item.icon
  const content = <>
      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-all duration-300 group-hover/item:bg-gradient-to-br group-hover/item:from-brand-500 group-hover/item:to-teal-accent group-hover/item:text-white">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-ink">{tr(item.label)}</span>
        {item.desc && <span className="block truncate text-[11.5px] text-ink/45">{tr(item.desc)}</span>}
      </span>
      <ArrowRight
        size={14}
        className="ml-auto flex-shrink-0 text-brand-400 opacity-0 -translate-x-1 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
      />
    </>
  const className = "animate-item-in group/item flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-brand-50"
  if (item.href) {
    return <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      style={{ animationDelay: `${delay}s` }}
      className={className}
    >{content}</a>
  }
  return <Link to={item.to} onClick={onClick} style={{ animationDelay: `${delay}s` }} className={className}>{content}</Link>
}

function Dropdown({ menu }) {
  const { t: tr, language } = useLanguage()
  const cols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }[menu.columns]
  const right = menu.align === 'right'
  let idx = 0
  return (
    <div
      className={`animate-drop-in absolute top-[calc(100%+16px)] z-50 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-brand-100/80 bg-white shadow-[0_30px_70px_rgba(15,39,64,0.2)] ${
        right ? 'right-0' : 'left-1/2 -translate-x-1/2'
      } ${widthByCols[menu.columns]}`}
    >
      <span
        className={`pointer-events-none absolute -top-2 h-4 w-4 rotate-45 border-l border-t border-brand-100/80 bg-white ${
          right ? 'right-10' : 'left-1/2 -translate-x-1/2'
        }`}
      />
      <div className={`grid ${cols} gap-2 p-4`}>
        {menu.groups.map((group, gi) => (
          <div key={group.heading || gi}>
            {group.heading && (
              <div className="mb-1 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-400">
                {tr(group.heading)}
              </div>
            )}
            {group.items.map((it) => (
              <MenuItem key={it.label} item={it} delay={idx++ * 0.03} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const { t: tr, language } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileSub, setMobileSub] = useState(null)
  const closeTimer = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close any open menu on navigation
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [pathname])

  const open = (label) => {
    clearTimeout(closeTimer.current)
    setOpenMenu(label)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 shadow-[0_4px_30px_rgba(15,39,64,0.08)] backdrop-blur-xl'
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <nav className="container-x flex h-[70px] items-center justify-between gap-2">
        <Link to="/" className="flex-shrink-0 transition-transform hover:scale-[1.02]">
          <Logo />
        </Link>

        {/* Right-aligned nav group */}
        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
          {menus.map((menu) => (
            <div
              key={menu.label}
              className="relative"
              onMouseEnter={() => open(menu.label)}
              onMouseLeave={scheduleClose}
            >
              <button
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors hover:text-brand-600 ${
                  openMenu === menu.label ? 'text-brand-600' : 'text-ink/70'
                }`}
              >
                {tr(menu.label)}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${openMenu === menu.label ? 'rotate-180' : ''}`}
                />
              </button>
              {openMenu === menu.label && (
                <div onMouseEnter={() => open(menu.label)}>
                  <Dropdown menu={menu} />
                </div>
              )}
            </div>
          ))}
        </div>

          {/* Language toggle - visible on desktop, repeated at the foot of the mobile menu */}
          {TRANSLATION_ENABLED && <div className="ms-1 hidden lg:block">
            <LanguageSwitch />
          </div>}

          <button
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-brand-50 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={tr("Toggle menu")}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="max-h-[80vh] animate-drop-in overflow-y-auto border-t border-brand-100 bg-white lg:hidden">
          <div className="container-x flex flex-col py-3">
            {menus.map((menu) => (
              <MobileAccordion
                key={menu.label}
                label={menu.label}
                open={mobileSub === menu.label}
                onToggle={() => setMobileSub((s) => (s === menu.label ? null : menu.label))}
              >
                {menu.groups.map((group, gi) => (
                  <div key={group.heading || gi}>
                    {group.heading && (
                      <div className="px-3 pt-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-400">
                        {tr(group.heading)}
                      </div>
                    )}
                    {group.items.map((it) => (
                      <MobileLeaf key={it.label} item={it} onClick={() => setMobileOpen(false)} />
                    ))}
                  </div>
                ))}
              </MobileAccordion>
            ))}
            {TRANSLATION_ENABLED && <div className="pt-4">
              <LanguageSwitch />
            </div>}
          </div>
        </div>
      )}
    </header>
  )
}

function MobileAccordion({ label, open, onToggle, children }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="border-b border-brand-50">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-3.5 text-sm font-semibold text-ink/80"
      >
        {tr(label)}
        <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

function MobileLeaf({ item, onClick }) {
  const { t: tr, language } = useLanguage()
  const Icon = item.icon
  const content = <>
      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon size={15} />
      </span>
      <span className="text-[13px] font-semibold text-ink/85">{tr(item.label)}</span>
    </>
  const className = "flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-50"
  if (item.href) {
    return <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      className={className}
    >{content}</a>
  }
  return <Link to={item.to} onClick={onClick} className={className}>{content}</Link>
}

import { getRoutePath } from '@/config/get-route-path'
import { link, list, note, p, steps, sub, type Section } from '../_components/content'

// The fan dashboard's contact form. Other pages' "contact support" links go to
// this Support page; from here, the next step is the form itself.
const CONTACT_SUPPORT = getRoutePath('contact_support')
const RESALE_TERMS = `${getRoutePath('terms_and_conditions')}#transfers-and-resale`

export const SUPPORT_SECTIONS: Section[] = [
  {
    title: 'Fan Support',
    blocks: [
      p('Everything you need to know about finding events, buying tickets and managing your Afrorevive account, in one place.'),
    ],
    children: [
      {
        title: 'General',
        navLabel: 'General',
        children: [
          {
            title: 'Do I need an account to browse or buy tickets?',
            blocks: [
              p(
                'You do not need an account to browse events on Afrorevive. However, you will need to create an account before purchasing tickets. Having an account also gives you access to features such as:',
              ),
              list(['ticket reselling & transfer', 'order management, and more.']),
            ],
          },
          {
            title: 'Supported countries and currencies',
            blocks: [
              p(
                'Afrorevive currently operates in Africa, with our primary operations based in Nigeria. Event organizers can create and manage events from anywhere in the world.',
              ),
              p(
                'We accept payments globally through our secure payment gateway, making it easy for fans worldwide to purchase tickets and access events.',
              ),
            ],
          },
          {
            title: 'Mobile vs web: what can I do on each?',
            blocks: [
              p(
                'The Afrorevive website currently offers our full range of fan features, including browsing events, purchasing tickets, transferring tickets and reselling tickets.',
              ),
              p(
                'The mobile app is currently used to display your ticket QR code for scanning at the event entrance. Additional features, including ticket purchases, transfers and resale, will be available on the mobile app soon.',
              ),
            ],
          },
          {
            title: 'Contacting the event organizer',
            blocks: [
              p(
                'Each event page includes the organizer’s contact details. For questions about a specific event, such as the lineup, venue, schedule or refund policy, we recommend contacting the organizer directly.',
              ),
            ],
          },
        ],
      },
      {
        title: 'Account Help',
        navLabel: 'Account Help',
        children: [
          {
            title: 'Creating an Afrorevive fan account',
            blocks: [
              steps([
                'Select Log in at the top of any page.',
                'Choose your role and select Sign up.',
                'Follow the steps to finish setting up your account.',
              ]),
              p('You can also create your account at checkout when you buy your first ticket.'),
              note(
                'Each email address can be used for one Afrorevive account type only. If your email is already linked to an organizer or vendor account, use a different email for your fan account.',
              ),
            ],
          },
          {
            title: 'Can I change the email address linked to my account?',
            blocks: [
              p(
                'Yes. You can update your email address at any time from your Account Settings. Once you enter your new email address, you will be asked to confirm the change from your new inbox.',
              ),
            ],
          },
          {
            title: 'I forgot my password. How can I reset it?',
            blocks: [
              steps([
                'Select Log in, then Forgot password.',
                'Enter the email address linked to your account.',
                'Open the reset link we send you and choose a new password.',
              ]),
            ],
          },
          {
            title: 'Deleting your account',
            blocks: [
              p(
                'To delete your account, contact Afrorevive Support from the Support page in your dashboard and ask for your account to be deleted. Our team will process your request and assist you with any questions you may have.',
              ),
              link('contact support', CONTACT_SUPPORT),
            ],
          },
        ],
      },
      {
        title: 'Tickets & Orders',
        navLabel: 'Tickets & Orders',
        children: [
          {
            title: 'Viewing tickets after purchase',
            blocks: [
              p(
                'Your tickets are saved in My Tickets in your account on the Afrorevive website. At the event, open the Afrorevive mobile app and show your ticket QR code at the entrance to be scanned.',
              ),
            ],
          },
          {
            title: 'Transferring tickets',
            blocks: [
              p('You can send a ticket to someone else from the Afrorevive website:'),
              steps([
                'Open the ticket in My Tickets and select Transfer.',
                'Enter the email address the person uses for their Afrorevive account.',
                'Confirm the transfer.',
              ]),
              p(
                'The ticket moves to them straight away, with no need for them to accept it, and it’s removed from your account. Tickets for private events can’t be transferred.',
              ),
              note(
                'The email must belong to a registered Afrorevive account. If the person doesn’t have an account yet, they’ll need to sign up with that same email address to receive the ticket.',
              ),
            ],
          },
          {
            title: 'Selling a ticket you’ve purchased',
            blocks: [
              p('Can’t make it? You can resell your ticket on Afrorevive:'),
              steps([
                'Open the ticket in My Tickets and turn on List for resale.',
                'Set your own price.',
                'Your ticket appears on the event page next to the organizer’s tickets.',
              ]),
              p(
                'When someone buys it, they get a new QR code and your original ticket is cancelled. The money goes straight into your Afrorevive wallet, and you can withdraw it from there.',
              ),
              p('Group tickets, invite-only tickets and tickets for private events can’t be resold.'),
              link('learn more', RESALE_TERMS),
            ],
          },
        ],
      },
      {
        title: 'Refunds & Cancellations',
        navLabel: 'Refunds & Cancellations',
        children: [
          {
            title: 'How to request a refund',
            blocks: [
              p(
                'Refund eligibility is determined by each event organizer’s refund policy. To request a refund, please contact the organizer directly using the contact details provided on the event page.',
              ),
            ],
          },
          {
            title: 'What happens if the event is cancelled?',
            blocks: [
              p(
                'In the event of a cancellation, please contact our support team through the Support page in your dashboard, and we will assist you with your ticket.',
              ),
            ],
          },
          {
            title: 'What happens if the event is postponed or rescheduled?',
            blocks: [
              p(
                'If an event is postponed or rescheduled, the organizer will determine how existing tickets are handled. We recommend checking the event page for the latest updates and contacting the organizer directly if you have any questions about your ticket.',
              ),
            ],
          },
          {
            title: 'I bought a resale ticket. Can I get a refund?',
            blocks: [
              p(
                'Resale tickets are valid tickets for the event and are subject to the organizer’s refund policy. If the event is cancelled, please contact our support team through the Support page in your dashboard for assistance.',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Creator Support',
    blocks: [
      p(
        'Welcome to Afrorevive, a platform that connects event organizers with the vendors and service providers who bring experiences to life. Whether you’re hosting an event, selling products, or offering services, Afrorevive gives you the tools to manage your activities in one place.',
      ),
      p('This guide explains how the platform works, how to get started, and how to make the most of its features.'),
    ],
    children: [
      {
        title: 'Getting Started On Afrorevive',
        navLabel: 'Getting Started On Afrorevive',
        children: [
          {
            title: 'Who are creators on Afrorevive?',
            blocks: [
              p(
                'Creators are the people who bring events to life on Afrorevive, from the organizers who host them to the vendors who serve at them.',
              ),
              list([
                '**Event organizers:** create events, sell tickets, manage guests and work with vendors.',
                '**Vendors:** apply for slots to sell products or provide services at events.',
                '**Where we operate:** Afrorevive currently operates in Africa, with our primary operations based in Nigeria. Organizers can create and manage events from anywhere in the world.',
              ]),
              note(
                'Each email address can only be associated with one Afrorevive account type. To use Afrorevive as both an organizer and a vendor, or also as a fan, you will need a separate email address for each account.',
              ),
            ],
          },
          {
            title: 'Full Asset Requirement List',
            blocks: [
              p('Prepare these assets before you begin so that your event and profile look their best.'),
              sub('Event flyer'),
              p(
                'Every event requires a flyer, which is displayed on your event page and across Afrorevive. Your flyer should be designed in a 3:4 aspect ratio (portrait) so that it displays correctly on all devices.',
              ),
              sub('Vendor profile assets'),
              p('Vendors should prepare the details that make up their profile, which organizers review when considering applications:'),
              list([
                'A short bio describing your business and the services you offer',
                'Your contact details',
                'Your social media links',
                'Photos of your past work for your gallery',
              ]),
            ],
          },
        ],
      },
      {
        title: 'Organizer',
        heading: 'accent',
        navLabel: 'For Organizers',
        blocks: [
          p(
            'Afrorevive gives organizers everything they need to sell tickets, manage guests and work with vendors from one platform, and you can create and manage events from anywhere in the world. To get started, create your organizer account with an email address that is not linked to another Afrorevive account, complete your profile, add your payout details and create your first event.',
          ),
        ],
        children: [
          {
            title: 'Organizer verification',
            blocks: [
              p(
                'Every organizer on Afrorevive is verified before they can publish an event. Verification is completed by filling in all of your organizer profile details, so your first event can only be published once your profile is complete. This helps fans and vendors trust the events they buy tickets for and apply to work at.',
              ),
            ],
          },
          {
            title: 'Creating & Publishing Events',
            heading: 'h2',
            blocks: [
              p(
                'Creating an event on Afrorevive is simple. Follow the event creation process, and once everything looks right, review your event and publish it.',
              ),
            ],
            children: [
              {
                title: 'Public events',
                blocks: [
                  p('Public events are open to everyone, making them the simplest way to reach the widest audience.'),
                  sub('How it works'),
                  p(
                    'Your event appears in discovery, and anyone can find it and purchase tickets straight away, with no approval needed from you.',
                  ),
                  note(
                    'A public event cannot be changed to private once it is created, so decide how open you want your event to be before you publish.',
                  ),
                ],
              },
              {
                title: 'Private events',
                blocks: [
                  p(
                    'Private events give you full control over who attends, making them ideal for exclusive launches, VIP experiences and confidential gatherings.',
                  ),
                  sub('How it works'),
                  p(
                    'Your event appears in discovery, but fans must request access before they can buy tickets, signing up first if they do not yet have an account. Requests stay pending until you approve them, and once approved, fans can purchase tickets for your event.',
                  ),
                  note(
                    'Once access has been approved, it cannot be revoked. Tickets for private events cannot be resold or transferred, and group tickets are not available. A private event can be switched to public at any time.',
                  ),
                ],
              },
            ],
          },
          {
            title: 'Selling Tickets',
            heading: 'h2',
            blocks: [p('Afrorevive offers several ticket types so you can sell to your audience in the way that suits your event.')],
            children: [
              {
                title: 'Single tickets',
                blocks: [
                  p('Standard tickets that admit one person.'),
                  p('Set your ticket name, price and quantity, and fans can purchase their tickets directly from your event page.'),
                  note('Once your event is published, tickets cannot be deleted, so check your prices and quantities carefully before going live.'),
                ],
              },
              {
                title: 'Group tickets',
                blocks: [
                  p('One purchase that admits a whole group.'),
                  p('A single buyer purchases the ticket once, and it admits their entire group at the entrance.'),
                  note('Group tickets cannot be resold, and they are not available for private events.'),
                ],
              },
              {
                title: 'Invite-only tickets',
                blocks: [
                  p('Free or paid tickets for one person, sent to specific guests through your guestlist.'),
                  p(
                    'Guests accept their invite by signing in or signing up with the email address it was sent to. Guests with paid invites have 5 days to complete payment.',
                  ),
                  note('Invite-only tickets are held until your event is published.'),
                ],
              },
              {
                title: 'Door tickets',
                blocks: [
                  p('Tickets sold on-site through the mobile app.'),
                  p(
                    'Create new door tickets, or convert an existing online single or group ticket into a door ticket. Buyers can pay in cash or through a Paystack QR code.',
                  ),
                  note('Each buyer receives a receipt by email.'),
                ],
              },
            ],
          },
          {
            title: 'Managing Guests & Access',
            heading: 'h2',
            blocks: [
              p(
                'Build your guestlist by adding guests by name and email address or uploading them with a CSV file, organize them into as many categories as you need, and choose which guests or categories to include for each event. You can also send guests invite-only tickets.',
              ),
              note('Vendors can only see your contact details once they have paid for their slot.'),
            ],
          },
          {
            title: 'Working with vendors',
            heading: 'h2',
            blocks: [
              p(
                'Rather than searching for vendors yourself, you post vendor listings on your event and vendors apply to them. Review each vendor’s profile, including their bio, gallery and contact details, then approve the vendors that best fit your event. Free slots are confirmed as soon as you approve, while paid slots are confirmed once the vendor completes payment.',
              ),
            ],
            children: [
              {
                title: 'Vendor slots',
                blocks: [
                  p(
                    'For vendors who sell at your event, such as food, drinks or merchandise. Set the slot name, category, number of slots and price, or offer free slots.',
                  ),
                ],
              },
              {
                title: 'Service listings',
                blocks: [
                  p(
                    'For vendors who provide a service, such as media coverage. Set the category, your budget range and an application deadline.',
                  ),
                  note(
                    'Afrorevive does not handle payments for service listings, so payment for services is arranged directly between you and the vendor.',
                  ),
                ],
              },
            ],
          },
          {
            title: 'Running your event day',
            heading: 'h2',
            blocks: [
              p('The Afrorevive Organizer App helps you and your crew manage entry at the door and sell tickets on-site.'),
              p('Use the app to scan ticket QR codes, check in attendees by name or order ID, and check in guestlist guests by name.'),
              list([
                '**Door sales:** sell door tickets and accept cash or a Paystack QR code, which lets buyers pay by card, bank transfer or USSD in their browser. Each buyer receives a receipt by email.',
                '**Your crew:** invite anyone with an Afrorevive account by name and email address or with an invite link, and add them to the events they will work at. There is no limit on crew members per event.',
              ]),
              note(
                'Crew members can scan tickets and check in attendees and guests, but they cannot see sales or revenue figures. Crew access ends automatically 24 hours after your event ends.',
              ),
            ],
          },
          {
            title: 'Getting paid',
            heading: 'h2',
            blocks: [
              p('Afrorevive pays out your earnings automatically, so there is no need to request a withdrawal.'),
              sub('How it works'),
              p(
                'Add your bank and account number, and your account name is filled in automatically. Your next payout date is shown on your payout screen.',
              ),
              p('Your account name must match your profile name or company name, otherwise your payout details cannot be saved.'),
              note('In exceptional cases, you can request a payout by contacting us through the email address on our Contact Us page.'),
            ],
          },
        ],
      },
      {
        title: 'Vendors',
        heading: 'accent',
        navLabel: 'For Vendors',
        children: [
          {
            title: 'Setting up your vendor profile',
            blocks: [
              p(
                'Sign up as a vendor with an email address that is not linked to another Afrorevive account, add a clear bio, your contact details and social media links, and upload photos of your past work to your gallery so organizers can see what you offer.',
              ),
            ],
          },
          {
            title: 'Finding & Applying For Slots',
            heading: 'h2',
            blocks: [
              p('Browse upcoming events on the Afrorevive website and apply for the listings that suit your business.'),
              sub('How it works'),
              p(
                'Apply for vendor slots to sell products such as food, drinks or merchandise, or for service listings such as media coverage, within the organizer’s budget range and before their application deadline.',
              ),
            ],
          },
          {
            title: 'Tracking Your Slots',
            heading: 'h2',
            blocks: [
              p(
                'All of your requests are shown in My Slots, where you can follow each one from your application through to confirmation. If your plans change while a request is still pending, you can withdraw it from the slot page. If a request is not approved, you are welcome to continue applying for other slots.',
              ),
              sub('How it works'),
              list([
                '**Pending approval:** your request has been sent and is waiting for the organizer’s review.',
                '**Approved:** the organizer has accepted your request. For paid slots, complete your payment to secure your spot.',
                '**Secured:** your slot is confirmed and the organizer’s contact details are now available to you.',
              ]),
            ],
          },
          {
            title: 'Paying For Slots',
            heading: 'h2',
            blocks: [
              p(
                'When an organizer approves your request for a paid slot, you complete payment securely through Paystack to secure your spot. Free slots are confirmed as soon as the organizer approves your request, with no payment required.',
              ),
              p(
                'Once your payment is complete, the organizer’s contact details become visible to you so you can coordinate directly. Afrorevive does not handle payments for service listings, so these are arranged directly between you and the organizer.',
              ),
            ],
          },
          {
            title: 'Using the Afrorevive Vendor App',
            heading: 'h2',
            blocks: [
              p(
                'Use the app to view your secured slots and the details of your events. Use the website to discover events, apply for slots, make payments and manage your profile.',
              ),
              p('**We recommend using the Afrorevive website to manage your applications and payments, as these features are not available in the app.**'),
            ],
          },
        ],
      },
    ],
  },
]

import { getRoutePath } from '@/config/get-route-path'
import { list, p, type Section } from '../_components/content'

export const TERMS_LAST_UPDATED = '5 November 2026'

export const TERMS_SECTIONS: Section[] = [
  {
    title: 'General Terms',
    blocks: [
      p(
        'These Terms of Use govern the Afrorevive website and mobile apps (the “Platform”), operated by Afro Revive Events Limited (“Afrorevive”), a company registered in Nigeria.',
      ),
      p('Use of the Platform constitutes acceptance of these Terms.'),
    ],
    children: [
      {
        title: 'Role of Afrorevive',
        heading: 'h3',
        blocks: [
          p(
            'Afrorevive operates a marketplace that connects Fans, Organizers and Vendors. Unless otherwise stated, Afrorevive is not the organizer of any Event. Each Event is created, operated and controlled by its Organizer, and the contract for entry to an Event is between the Fan and the Organizer.',
          ),
        ],
      },
      {
        title: 'Where we operate',
        heading: 'h3',
        blocks: [
          p(
            'Afrorevive provides the technology, ticketing and payment collection services that support each transaction. Afrorevive currently operates in Africa, with primary operations in Nigeria. Events may be created and managed from any location, and payments are accepted globally.',
          ),
        ],
      },
      {
        title: 'Accounts & Eligibility',
        children: [
          {
            title: 'Creating an Afrorevive account',
            blocks: [
              p(
                'Creating an Account constitutes acceptance of these Terms. By completing registration, the User confirms that these Terms have been read, understood and agreed to, and that they apply to all use of the Account.',
              ),
              list([
                '**Age:** You must be at least 18 years old, or the age of majority where you live, to create an account or buy tickets.',
                '**Browsing:** You do not need an account to browse events. You need one to buy tickets, request access to private events, accept invitations, list events or apply for vendor slots.',
                '**Account types:** Fans, organizers and vendors each have their own account type. Organizers and vendors are together called “creators”.',
                '**Accurate details:** You must give true, current information and keep it up to date. You can change your email address in Account Settings.',
                '**Security:** You are responsible for keeping your login details safe and for everything done through your account. Contact us straight away if you think your account has been misused.',
                '**Business use:** If you use Afrorevive for a business, you confirm you have authority to bind that business to these Terms.',
              ]),
            ],
          },
          {
            title: 'Deleting your account',
            blocks: [
              p(
                'Account deletion may be requested through the Support page. Afrorevive may retain records as required by law, and Tickets for upcoming Events may be forfeited upon deletion.',
                { text: 'contact support', to: getRoutePath('help_center') },
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Fans',
    children: [
      {
        title: 'General',
        blocks: [
          p(
            'Ticket prices are set by the Organizer. Each purchase is subject to the Service Fee and applicable payment processing fees, which are paid by the Fan and displayed before payment.',
          ),
          p(
            'The Afrorevive website provides the full range of Fan features, including Ticket purchases, transfers and resale. The Afrorevive mobile application currently displays Ticket QR codes for entry.',
          ),
          p(
            'Each Event page displays the Organizer’s contact details. Questions regarding an Event, including its lineup, venue, schedule or refund policy, must be directed to the Organizer.',
          ),
          p(
            'Admission is subject to the Organizer’s event rules, including age restrictions, identification requirements, dress codes and safety policies. Age restrictions (for example, 12+ or 18+) are set by the Organizer for each Event and displayed on the Event page. The Organizer may refuse entry in accordance with those rules.',
          ),
        ],
      },
      {
        title: 'Tickets & Orders',
        blocks: [
          p(
            'Tickets are saved in My Tickets in your account on the Afrorevive website. At the event, open the Afrorevive mobile app and show your ticket QR code at the entrance to be scanned.',
          ),
          list([
            '**Keep your QR code private:** Each code can be scanned once, and whoever presents it first may be admitted.',
            'The organizer controls entry and may refuse admission under its own event rules, including age limits, ID checks, dress codes and safety rules.',
            '**The Afrorevive website offers the full range of fan features:** The mobile app currently displays ticket QR codes; more features will be added over time.',
          ]),
        ],
      },
      {
        title: 'Transfers & resale',
        children: [
          {
            title: 'Transferring tickets',
            blocks: [
              p('Tickets may be transferred through the Afrorevive website to the email address of a registered Account.'),
              p('A recipient without an Account must register with the same email address to receive the Ticket.'),
              p('Transfers take effect immediately and do not require acceptance by the recipient.'),
            ],
          },
          {
            title: 'Reselling tickets',
            blocks: [
              p(
                'Fans may list eligible Tickets for resale at a price of their choosing. When a resale Ticket is sold, the buyer receives a new QR code, the original Ticket is cancelled and the proceeds are credited to the seller’s Afrorevive Wallet. The 8% Service Fee is paid by the buyer.',
              ),
              p('The following cannot be resold:'),
              list(['Group Tickets', 'Invite-Only Tickets', 'Tickets for Private Events']),
              p('Resale Tickets are non-refundable.'),
            ],
          },
        ],
      },
      {
        title: 'Refunds & Cancellations',
        children: [
          {
            title: 'Refund requests',
            blocks: [
              p(
                'Refund eligibility is determined by each Organizer’s refund policy, as displayed on the Event page, and refund requests must be directed to the Organizer. Except where required by law, the Service Fee and payment processing fees are non-refundable.',
              ),
            ],
          },
          {
            title: 'Cancelled Events',
            blocks: [p('Where an Event is cancelled, Fans may contact Afrorevive through the Support page for assistance.')],
          },
          {
            title: 'Postponed or rescheduled Events',
            blocks: [p('Where an Event is postponed or rescheduled, the Organizer will determine how existing Tickets are handled.')],
          },
          {
            title: 'Resale tickets',
            blocks: [p('Resale Tickets are valid Tickets for the Event and are non-refundable, except where required by law.')],
          },
        ],
      },
    ],
  },
  {
    title: 'Creators',
    blocks: [
      p(
        'Creators are the Organizers who host Events and the Vendors who serve at them. Each email address may be associated with one Account type only, and a separate email address is required for each Account type.',
      ),
    ],
    children: [
      {
        title: 'Organizer verification',
        heading: 'h3',
        blocks: [
          p(
            'Every organizer on Afrorevive is verified before they can publish an event. Verification is completed by filling in all of your organizer profile details, so your first event can only be published once your profile is complete. This helps fans and vendors trust the events they buy tickets for and apply to work at.',
          ),
        ],
      },
      {
        title: 'Vendor verification',
        heading: 'h3',
        blocks: [
          p(
            'Sign up as a vendor with an email address that is not linked to another Afrorevive account, add a clear bio, your contact details and social media links, and upload photos of your past work to your gallery so organizers can see what you offer.',
          ),
        ],
      },
      {
        title: 'Getting Paid',
        blocks: [
          p(
            'Organizer earnings are paid automatically on the scheduled payout date to the bank account on the Organizer’s profile. The account name must match the profile name or registered company name. Afrorevive may hold payouts to cover refunds or chargebacks.',
          ),
          p(
            'Paid Vendor Slots carry an 8% Service Fee, paid by the Vendor. Payments for Service Listings are arranged directly between the Organizer and the Vendor.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Legal Terms',
    children: [
      {
        title: 'Privacy Policy',
        heading: 'h3',
        blocks: [
          p(
            'Afrorevive collects the personal data needed to run the Platform, including name, email address, Account and profile details, Ticket and order history, and basic demographic information such as age range, gender and location. Card details are processed by Paystack and are not stored by Afrorevive.',
          ),
          p(
            'Personal data is used to manage Accounts, process payments, deliver Tickets, provide support and improve the Platform. Afrorevive does not sell personal data, and shares it only where needed to provide the service:',
          ),
          list([
            'with Organizers, who receive the names, contact details and audience insights of buyers and guests for their Events;',
            'between Organizers and Vendors, whose contact details are shared once a Vendor Slot is secured;',
            'with Paystack, to process payments.',
          ]),
          p(
            'Users may request access to, correction of or deletion of their personal data through the Support page. Personal data is handled in line with the Afrorevive Privacy Policy and the Nigeria Data Protection Act 2023.',
          ),
        ],
      },
      {
        title: 'Payments and Fees',
        heading: 'h3',
        blocks: [
          p(
            'All payments on the Platform are processed by Paystack, and prices may be shown in NGN, USD or EUR. Afrorevive charges an 8% Service Fee on ticket sales, resales and paid Vendor Slots. Failed or charged-back payments may result in cancelled Tickets or Slots.',
          ),
        ],
      },
      {
        title: 'Code of Conduct',
        heading: 'h3',
        blocks: [
          p('Users are expected to use the Platform honestly and respectfully. Users must not:'),
          list([
            'post fake, misleading or unlawful Events.',
            'copy or tamper with Tickets or QR codes.',
            'use bots or automated tools on the Platform.',
            'harass or defraud other Users.',
            'upload unlawful or infringing content.',
          ]),
        ],
      },
      {
        title: 'Content and Intellectual Property',
        heading: 'h3',
        blocks: [
          p(
            'Users own the content they upload and permit Afrorevive to display it on the Platform. The Afrorevive name, logo and Platform belong to Afro Revive Events Limited.',
          ),
        ],
      },
      {
        title: 'Liability',
        heading: 'h3',
        blocks: [
          p(
            'The Platform is provided “as is” and may change or be unavailable at times. Afrorevive is not responsible for how Events are run or for goods and services provided by Vendors. Where the law allows, Afrorevive’s liability is limited to the fees paid to Afrorevive in the previous 12 months.',
          ),
        ],
      },
      {
        title: 'Violation of These Terms',
        heading: 'h3',
        blocks: [p('Afrorevive may suspend Accounts, remove listings or hold payouts where these Terms are breached.')],
      },
      {
        title: 'Governing Law & Changes',
        heading: 'h3',
        blocks: [
          p(
            'These Terms are governed by the laws of Nigeria. Consumers in the EU and UK keep their mandatory local consumer rights. Afrorevive may update these Terms, and continued use of the Platform means acceptance of the updated Terms. Questions may be sent through the Support or Contact Us page.',
          ),
        ],
      },
    ],
  },
]

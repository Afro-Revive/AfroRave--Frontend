/** The team, by group: founders, engineering, marketing. */
export default function TeamSection() {
  return (
    <section className='w-full text-white'>
      <div className='w-full max-w-[1280px] mx-auto flex flex-col items-center px-6 pt-20 md:px-[60px] md:pt-[100px]'>
        <h2 className='text-center font-work-sans font-black uppercase text-[40px] leading-none md:text-[64px]'>
          The team
        </h2>

        <p className='mt-5 max-w-3xl text-center font-work-sans text-base leading-snug md:text-xl'>
          Our team combines decades of real-world event industry knowledge with fresh talent across
          design, engineering, and marketing. We don’t just understand the event business, we’ve
          lived it.
        </p>

        <div className='mt-14 flex w-full flex-col items-center gap-12 md:mt-[70px] md:gap-10'>
          {TEAM.map((group) => (
            <div key={group.name} className='flex w-full flex-col items-center gap-5'>
              <h3 className='font-inter text-base font-medium uppercase tracking-[0.3em] md:text-sm'>
                {group.name}
              </h3>

              {/* Mobile: rows of 2 then 1 (every third name takes the whole row). */}
              <ul className='grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-8 md:flex md:flex-wrap md:justify-center md:gap-x-[120px]'>
                {group.members.map((member) => (
                  <TeamMember key={`${group.name}-${member.name}`} {...member} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamMember({ initials, name, role }: { initials: string; name: string; role: string }) {
  return (
    <li className='flex w-full max-w-[200px] flex-col items-center text-center nth-[3n]:col-span-2 md:w-[200px]'>
      <span
        aria-hidden
        className='flex size-[72px] items-center justify-center rounded-full border-[3px] border-white font-inter text-2xl font-bold md:size-[86px] md:text-[30px]'>
        {initials}
      </span>
      <p className='mt-3 font-inter-tight text-lg font-bold md:text-2xl'>{name}</p>
      <p className='mt-0.5 max-w-[150px] font-inter-tight text-sm leading-tight'>{role}</p>
    </li>
  )
}

// Initials are set by hand: not every one is first + last letter (Cyril is CY).
const TEAM = [
  {
    name: 'Founding team',
    members: [
      { initials: 'EA', name: 'Eseose Atie', role: 'Co-Founder & UI/UX Designer' },
      { initials: 'CY', name: 'Cyril Atie', role: 'Co-Founder' },
    ],
  },
  {
    name: 'Engineering',
    members: [
      { initials: 'AA', name: 'Abiodun Abdullahi', role: 'Backend Developer' },
      { initials: 'IA', name: 'Iseoluwa Ariyibi', role: 'Frontend Developer' },
      { initials: 'TI', name: 'Trinity Izeiyamu', role: 'IT Specialist' },
    ],
  },
  {
    name: 'Marketing',
    members: [
      { initials: 'EA', name: 'Eseose Atie', role: 'Creative Director' },
      { initials: 'EA', name: 'Esther Atie', role: 'Marketing Strategist' },
    ],
  },
]

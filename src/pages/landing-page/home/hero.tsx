import { AfroCarousel } from '@/components/afro-carousel'

export default function Hero() {
  return <AfroCarousel items={carouselItems} />
}

const carouselItems = [
  {
    id: '1',
    image: '/assets/landing-page/carousel/contest-2025.png',
    alt: 'Rave',
  },
  {
    id: '2',
    image: '/assets/landing-page/carousel/nwb.png',
    alt: 'Rave',
  },
  {
    id: '3',
    image: '/assets/landing-page/carousel/soul-poster.png',
    alt: 'Rave',
  },
  {
    id: '4',
    image: '/assets/landing-page/c1.png',
    alt: 'Rave',
  }
]

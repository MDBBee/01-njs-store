import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import h_1 from '../../public/images/h-1.jpg';
import h_2 from '../../public/images/h-2.jpg';
import h_3 from '../../public/images/h-3.jpg';
import h_4 from '../../public/images/h-4.jpg';
import h_5 from '../../public/images/h-5.jpg';
import h_6 from '../../public/images/h-6.jpg';
import Image from 'next/image';

const carouselImages = [h_1, h_2, h_3, h_4, h_5, h_6];

function HeroCarousel() {
  return (
    <div className="hidden lg:block">
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {carouselImages.map((image, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3 group"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-1">
                    <Image
                      src={image}
                      alt="hero"
                      className="w-full h-[24rem] rounded-md object-cover group-hover:scale-95 duration-300"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
export default HeroCarousel;

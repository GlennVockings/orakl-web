import { GlassCard } from "@/components/cards/GlassCard";
import { GameCardBanner } from "@/components/GameCardBanner";
import { KnowledgeVoid } from "@/components/KnowledgeVoid/KnowledgeVoid";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CardScene } from "@/components/cards/CardScene";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const games = [
  {
    name: "Faux Stakes",
    image: "/images/fauxstakes-game-card.png",
    link: "/games/faux-stakes",
    status: "",
  },
  {
    name: "Predictor",
    image: "/images/predictor-game-card.png",
    link: "/games/predictor",
    status: "Coming Soon",
  },
  {
    name: "Arena",
    image: "/images/arena-game-card.png",
    link: "/games/arena",
    status: "Coming Soon",
  },
];

export default function Home() {
  return (
    <KnowledgeVoid
      vanishingPoint={{
        x: 0.8,
        y: 0.75,
      }}
      mobileVanishingX={0.5}
    >
      <CardScene contentClassName="max-w-[680px]">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
              Orakl
            </p>

            <h1 className="max-w-[560px] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.05] lg:text-[56px]">
              Know more. Predict better.
            </h1>

            <p className="max-w-[520px] text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Put your knowledge to the test across predictions, games and
              competitive experiences.
            </p>
          </div>
        </div>
      </CardScene>

      <CardScene contentClassName="max-w-[1100px]">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-[560px] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.05] lg:text-[56px]">
              Games
            </h2>
          </div>

          <div className="flex justify-center lg:justify-start lg:ml-8">
            <Carousel
              opts={{
                align: "center",
              }}
              className="w-full max-w-[250px] lg:max-w-[900px]"
            >
              <CarouselContent>
                {games.map((game) => {
                  return (
                    <CarouselItem className="lg:basis-1/3" key={game.name}>
                      <Link
                        href={game.status ? "/" : game.link}
                        className="flex justify-center"
                      >
                        <div className="group w-[220px] sm:w-[260px] lg:w-[300px] hover:scale-[1.015]">
                          <AspectRatio
                            ratio={2 / 3}
                            className="relative overflow-hidden rounded-lg"
                          >
                            <Image
                              src={game.image}
                              alt={game.name}
                              fill
                              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 38vw, 320px"
                              className="object-cover lg:grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                            />

                            {game.status ? (
                              <GameCardBanner text={game.status} />
                            ) : (
                              ""
                            )}
                          </AspectRatio>
                        </div>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </CardScene>

      <CardScene contentClassName="max-w-[680px]">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-[560px] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.05] lg:text-[56px]">
              Play for Orakls. Not money.
            </h2>

            <p className="max-w-[520px] text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Orakls are Orakl's virtual game currency — built for competition,
              strategy and bragging rights. Each game has its own balance, so
              every experience stands on its own.
            </p>
          </div>
        </div>
      </CardScene>
    </KnowledgeVoid>
  );
}

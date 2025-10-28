import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function Forecast({data, weatherCode}) {
  const autoplay = useRef(
    Autoplay({
      delay: 3000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: true, 
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, draggable: true },
    [autoplay.current]
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi]);

  return (
    <div className="embla overflow-hidden mb-6" ref={emblaRef}>
      <div className="flex">
        {
          data?.daily?.time.map((el, i) => (
            <div key={i} className="flex-none w-1/3 me-4 bg-[#1e1e1e] rounded-lg p-3 text-center">
                <p className="text-sm mb-2">
                  {
                    new Date(el).toLocaleDateString("en-ID", {
                      weekday: "short",
                    })
                  }
                </p>
                <img
                  src={weatherCode[data.daily.weather_code[i]]?.icon}
                  alt="Mon"
                  className="mx-auto w-[50px] h-[50px] mb-2 rounded-md bg-white/10"
                />
                <p className="font-medium forecastTemp">{Math.round(data.daily.temperature_2m_max[i]) + " °C"}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}


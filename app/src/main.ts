import './styles/main.scss';
import.meta.glob('./assets/images/**/*.{png,jpg,jpeg,svg,webp,avif}');

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

import { debounce, addWillChange, removeWillChange } from './ts/utils';
import { CONFIG, isMobileOrTablet } from './ts/globals';

function initializeScrollTrigger(locoScroll: LocomotiveScroll): void {
  gsap.registerPlugin(ScrollTrigger);

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value?: number) {
      if (arguments.length && typeof value === 'number') {
        locoScroll.scrollTo(value, { duration: 0 });
      }
    },  
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: (document.querySelector("[data-scroll-container]") as HTMLElement)?.style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => {
    locoScroll.update();
  });

  ScrollTrigger.refresh();
}

document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
  const scrollContainer = document.querySelector("[data-scroll-container]") as HTMLElement;
  
  if (!scrollContainer) {
    console.error('Container de scroll não encontrado');
    return;
  }

  const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    lerp: 0.08,
    multiplier: 0.6,
    touchMultiplier: 2,
  });

  initializeScrollTrigger(locoScroll);
  
  window.addEventListener("resize", debounce((): void => {

  }, CONFIG.DEBOUNCE_DELAY));

});

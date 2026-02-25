import { createFileRoute } from "@tanstack/react-router";
import {
  BoxContainer,
  BoxHeadingText,
  BoxSubText,
} from "../components/BoxContainer";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <section id="about-us" className="container mx-auto p-10  xl:w-2/3">
      <BoxContainer>
        <BoxHeadingText className="lg:text-5xl font-bold capitalize leading-relaxed">
          We love <span className="text-primary">Nou Store</span>
        </BoxHeadingText>
        <BoxSubText>
          In a world of specialized shops, Nou Store stands out by offering
          everything you need in one place. We're more than a store – we're your
          shopping partner, dedicated to saving you time, money, and effort.
          Join thousands of happy customers who trust us for their everyday and
          extraordinary purchases.
        </BoxSubText>
        <p></p>
      </BoxContainer>
    </section>
  );
}
